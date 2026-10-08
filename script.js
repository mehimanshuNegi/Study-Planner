/* ========================================================
   STUDY PLANNER — FULL-STACK REAL-TIME CONTROLLER
   Integrates REST APIs with persistent MongoDB backend:
   Authentication, Tasks, Quick Notes, Dashboard Analytics,
   Pomodoro Study Sessions, Weekly Timetable, and Settings.
   ======================================================== */

// Global state cache
var activeScheduleSlots = [];

// ========================================================
// 1. AUTHENTICATION & PROFILE DOM SYNC
// ========================================================
async function initAppState() {
    var isAuthPage = window.location.pathname.endsWith('login.html') || 
                     window.location.pathname.endsWith('login');

    if (!isAuthPage) {
        var user = await authService.checkAuth(true);
        if (!user) return;
        syncUserProfileDOM(user);
        injectLogoutAction();
    }

    // Load dynamic data across views
    await renderAllTaskViews();
    await renderQuickNotesDOM();
    await loadDashboardStats();
    await renderScheduleSlots('mon');
    updateTimerDisplay();

    // Setup search listener
    var searchInput = document.getElementById("globalSearchInput");
    if (searchInput) {
        searchInput.addEventListener("input", function(e) {
            handleGlobalSearch(e.target.value);
        });
    }

    // Keyboard shortcut Ctrl+K / Cmd+K
    document.addEventListener("keydown", function(e) {
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
            e.preventDefault();
            if (searchInput) {
                searchInput.focus();
                searchInput.select();
            }
        }
    });

    // Enter key listeners
    var taskInput = document.getElementById("dashNewTaskInput");
    if (taskInput) {
        taskInput.addEventListener("keydown", function(e) {
            if (e.key === "Enter") addDashboardTask();
        });
    }

    var noteInput = document.getElementById("quickNoteInput");
    if (noteInput) {
        noteInput.addEventListener("keydown", function(e) {
            if (e.key === "Enter") addQuickNote();
        });
    }

    // Profile form listener
    var formProfile = document.getElementById("profileSetupForm");
    if (formProfile) {
        formProfile.addEventListener("submit", handleProfileFormSubmit);
    }
}

function syncUserProfileDOM(user) {
    if (!user) user = authService.getUser();
    if (!user) return;

    // Update all name displays
    var nameDisplays = document.querySelectorAll(".user-name-display, #studentDisplayName, .user-pill-name, .topbar-name");
    nameDisplays.forEach(function(el) {
        el.textContent = user.name;
    });

    // Update avatar initials
    var initial = user.name ? user.name.charAt(0).toUpperCase() : "S";
    var avatars = document.querySelectorAll(".user-avatar-sm, .avatar-topbar");
    avatars.forEach(function(el) {
        el.textContent = initial;
    });

    // Subtitle display
    var subDisplays = document.querySelectorAll(".user-pill-sub");
    subDisplays.forEach(function(el) {
        if (user.branch && user.semester) {
            el.textContent = (user.branch.split(" ")[0]) + " • " + user.semester + " Sem";
        } else if (user.branch) {
            el.textContent = user.branch;
        } else if (user.semester) {
            el.textContent = user.semester + " Sem";
        } else {
            el.textContent = "Student Profile";
        }
    });

    // If on registration / settings page, populate inputs
    var nameField = document.getElementById("studentName");
    if (nameField) nameField.value = user.name || "";
    var rollField = document.getElementById("rollNo");
    if (rollField) rollField.value = user.rollNo || "";
    var emailField = document.getElementById("email");
    if (emailField) emailField.value = user.email || "";
    var notesField = document.getElementById("notes");
    if (notesField && user.notes) notesField.value = user.notes;
}

function injectLogoutAction() {
    var sidebarFooter = document.querySelector(".sidebar-footer");
    if (sidebarFooter && !document.getElementById("sidebarLogoutBtn")) {
        var logoutBtn = document.createElement("button");
        logoutBtn.id = "sidebarLogoutBtn";
        logoutBtn.className = "btn-logout";
        logoutBtn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg> Sign Out';
        logoutBtn.onclick = function() {
            authService.logout();
        };
        sidebarFooter.appendChild(logoutBtn);
    }
}

async function handleProfileFormSubmit(e) {
    if (e) e.preventDefault();
    var nameVal = document.getElementById("studentName") ? document.getElementById("studentName").value.trim() : "";
    var rollVal = document.getElementById("rollNo") ? document.getElementById("rollNo").value.trim() : "";
    var notesVal = document.getElementById("notes") ? document.getElementById("notes").value.trim() : "";
    var passwordVal = document.getElementById("password") ? document.getElementById("password").value : "";

    try {
        await authService.updateProfile({
            name: nameVal,
            rollNo: rollVal,
            notes: notesVal
        });

        // If new password entered (not masked placeholder)
        if (passwordVal && passwordVal.indexOf("•••") === -1 && passwordVal.length >= 6) {
            var currentPass = prompt("Please enter your current password to confirm this change:");
            if (currentPass) {
                await authService.updatePassword(currentPass, passwordVal);
            }
        }

        alert("Profile settings successfully updated and saved to database!");
    } catch (err) {
        alert("Error saving profile: " + err.message);
    }
    return false;
}

function updateStudentName() {
    var input = document.getElementById("nameInput");
    if (!input) return;
    var newName = input.value.trim();
    if (!newName) {
        alert("Please enter a valid student name.");
        return;
    }

    authService.updateProfile({ name: newName })
        .then(function() {
            input.value = "";
            syncUserProfileDOM();
        })
        .catch(function(err) {
            alert("Error: " + err.message);
        });
}


// ========================================================
// 2. REAL TASK MANAGEMENT & MULTI-VIEW RENDERING
// ========================================================
async function renderAllTaskViews() {
    var tasks = [];
    try {
        tasks = await taskService.getTasks();
    } catch (e) {
        console.warn("Could not fetch tasks:", e);
        return;
    }

    var totalTasks = tasks.length;
    var completedTasks = tasks.filter(function(t) { return t.completed; }).length;
    var pendingTasks = totalTasks - completedTasks;

    // 1. Update badges
    var badges = document.querySelectorAll(".nav-badge, #sidebarTaskBadge");
    badges.forEach(function(b) {
        b.textContent = pendingTasks;
    });

    // 2. Update stats on Dashboard
    var statCompletedDisplay = document.getElementById("statCompletedCount");
    if (statCompletedDisplay) {
        statCompletedDisplay.textContent = completedTasks + " / " + totalTasks;
    }

    var dashCounter = document.getElementById("dashTaskCounter");
    if (dashCounter) {
        dashCounter.textContent = completedTasks + " of " + totalTasks + " done";
    }

    var progressFill = document.getElementById("statCompletedProgress");
    if (progressFill) {
        var pct = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
        progressFill.style.width = pct + "%";
    }

    // 3. Render Dashboard task list
    var dashList = document.getElementById("dashTaskList");
    if (dashList) {
        if (tasks.length === 0) {
            dashList.innerHTML = '<div style="padding: 24px; text-align: center; color: var(--text-muted); font-size: 13px;">No tasks yet. Add your first study task below!</div>';
        } else {
            var dashHtml = "";
            for (var i = 0; i < tasks.length; i++) {
                var t = tasks[i];
                var isDoneClass = t.completed ? "task-row is-done" : "task-row";
                var checkClass = t.completed ? "custom-checkbox checked" : "custom-checkbox";
                var catClass = t.category || "dsa";

                dashHtml += 
                    '<div class="' + isDoneClass + '" data-id="' + t.id + '">' +
                        '<div class="task-left">' +
                            '<div class="' + checkClass + '" onclick="toggleTaskById(\'' + t.id + '\')" title="Toggle completion">' +
                                '<svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg>' +
                            '</div>' +
                            '<span class="task-title">' + escapeHtml(t.title) + '</span>' +
                        '</div>' +
                        '<div class="task-right">' +
                            '<span class="category-badge ' + catClass + '">' + escapeHtml(t.subject || t.category) + '</span>' +
                            '<button class="task-menu-btn" onclick="deleteTaskById(\'' + t.id + '\')" title="Delete task">' +
                                '<svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>' +
                            '</button>' +
                        '</div>' +
                    '</div>';
            }
            dashList.innerHTML = dashHtml;
        }
    }

    // 4. Render dedicated Tasks page
    var mainList = document.getElementById("taskList");
    if (mainList) {
        var summaryCount = document.getElementById("taskSummaryCount");
        if (summaryCount) {
            summaryCount.textContent = "Total Tasks: " + totalTasks + " | Completed: " + completedTasks;
        }

        if (tasks.length === 0) {
            mainList.innerHTML = '<div style="padding: 30px; text-align: center; color: var(--text-muted); font-size: 13.5px;">No tasks yet. Add a study assignment or homework above.</div>';
        } else {
            var fullHtml = "";
            for (var j = 0; j < tasks.length; j++) {
                var item = tasks[j];
                var pClass = (item.priority === "High") ? "priority-high" : 
                             (item.priority === "Low") ? "priority-low" : "priority-med";
                var completedClass = item.completed ? "task-item completed" : "task-item";
                var doneBtnText = item.completed ? "Undone" : "Done";

                fullHtml += 
                    '<div class="' + completedClass + '" data-id="' + item.id + '">' +
                        '<div>' +
                            '<b>' + escapeHtml(item.subject || "Course") + ':</b> ' + escapeHtml(item.title) + ' ' +
                            '<span class="' + pClass + '" style="margin-left: 8px;">' + escapeHtml(item.priority || "Medium") + '</span>' +
                            '<br><small style="color: var(--text-muted);">Target Date: ' + escapeHtml(item.dueDate || "Today") + '</small>' +
                        '</div>' +
                        '<div>' +
                            '<button onclick="toggleTaskById(\'' + item.id + '\')" class="btn" style="padding: 4px 10px; font-size: 12px; margin-right: 6px;">' + doneBtnText + '</button>' +
                            '<button onclick="deleteTaskById(\'' + item.id + '\')" class="btn btn-danger" style="padding: 4px 10px; font-size: 12px;">Delete</button>' +
                        '</div>' +
                    '</div>';
            }
            mainList.innerHTML = fullHtml;
        }
    }
}

async function toggleTaskById(taskId) {
    try {
        await taskService.toggleComplete(taskId);
        await renderAllTaskViews();
        loadDashboardStats();
    } catch (err) {
        console.error("Error toggling task:", err);
    }
}

async function deleteTaskById(taskId) {
    try {
        await taskService.deleteTask(taskId);
        await renderAllTaskViews();
        loadDashboardStats();
    } catch (err) {
        console.error("Error deleting task:", err);
    }
}

async function addDashboardTask() {
    var input = document.getElementById("dashNewTaskInput");
    var categorySelect = document.getElementById("dashNewTaskCategory");
    if (!input) return;

    var text = input.value.trim();
    if (!text) {
        input.focus();
        return;
    }

    var cat = categorySelect ? categorySelect.value : "dsa";
    var subjectName = categorySelect ? categorySelect.options[categorySelect.selectedIndex].text : "General";

    try {
        await taskService.createTask({
            title: text,
            subject: subjectName,
            category: cat,
            priority: "Medium",
            dueDate: new Date().toISOString().split("T")[0]
        });
        input.value = "";
        await renderAllTaskViews();
        loadDashboardStats();
    } catch (err) {
        alert("Failed to create task: " + err.message);
    }
}

async function addTask() {
    var subjectEl = document.getElementById("taskSubject");
    var descEl = document.getElementById("taskDesc");
    var dateEl = document.getElementById("taskDate");
    var priorityEl = document.getElementById("taskPriority");

    if (!descEl) return;
    var taskText = descEl.value.trim();
    if (!taskText) {
        alert("Please enter a task description!");
        descEl.focus();
        return;
    }

    var subject = subjectEl ? subjectEl.value : "General";
    var taskDate = dateEl && dateEl.value ? dateEl.value : new Date().toISOString().split("T")[0];
    var priority = priorityEl ? priorityEl.value : "Medium";

    var categoryMap = {
        "Web Technologies": "webtech",
        "DBMS": "dbms",
        "Computer Networks": "dsa",
        "Java": "oop",
        "Operating Systems": "dsa"
    };

    try {
        await taskService.createTask({
            title: taskText,
            subject: subject,
            category: categoryMap[subject] || "dsa",
            priority: priority,
            dueDate: taskDate
        });
        descEl.value = "";
        await renderAllTaskViews();
    } catch (err) {
        alert("Failed to add task: " + err.message);
    }
}

function toggleTaskComplete(btn) {
    var parent = btn.closest("[data-id]");
    if (parent) toggleTaskById(parent.getAttribute("data-id"));
}

function deleteTask(btn) {
    var parent = btn.closest("[data-id]");
    if (parent) deleteTaskById(parent.getAttribute("data-id"));
}

function toggleDashboardTask(el) {
    var row = el.closest("[data-id]");
    if (row) toggleTaskById(row.getAttribute("data-id"));
}

function deleteDashboardTask(btn) {
    var row = btn.closest("[data-id]");
    if (row) deleteTaskById(row.getAttribute("data-id"));
}


// ========================================================
// 3. REAL QUICK NOTES
// ========================================================
async function renderQuickNotesDOM() {
    var container = document.getElementById("quickNotesList");
    if (!container) return;

    var notes = [];
    try {
        notes = await noteService.getNotes();
    } catch (e) {
        console.warn("Could not load notes:", e);
        return;
    }

    if (notes.length === 0) {
        container.innerHTML = '<div style="padding: 14px; text-align: center; color: var(--text-muted); font-size: 12.5px;">No quick notes yet. Add a reminder below.</div>';
    } else {
        var html = "";
        for (var i = 0; i < notes.length; i++) {
            var n = notes[i];
            var colorClass = n.color ? " " + n.color : "";
            html += 
                '<div class="note-item-clean' + colorClass + '" data-note-id="' + n.id + '">' +
                    '<span>' + escapeHtml(n.content || n.text) + '</span>' +
                    '<button class="note-delete-btn" onclick="deleteQuickNote(\'' + n.id + '\')" title="Delete note">&times;</button>' +
                '</div>';
        }
        container.innerHTML = html;
    }

    var counter = document.querySelector("#quick-notes-section .section-counter");
    if (counter) {
        counter.textContent = notes.length + " memo" + (notes.length === 1 ? "" : "s");
    }
}

async function addQuickNote() {
    var input = document.getElementById("quickNoteInput");
    if (!input) return;

    var text = input.value.trim();
    if (!text) {
        input.focus();
        return;
    }

    var colors = ["", "sage", "pink"];
    var randomColor = colors[Math.floor(Math.random() * colors.length)];

    try {
        await noteService.createNote({
            content: text,
            color: randomColor
        });
        input.value = "";
        await renderQuickNotesDOM();
    } catch (err) {
        alert("Failed to add note: " + err.message);
    }
}

async function deleteQuickNote(noteId) {
    try {
        await noteService.deleteNote(noteId);
        await renderQuickNotesDOM();
    } catch (err) {
        console.error("Failed to delete note:", err);
    }
}


// ========================================================
// 4. POMODORO / FOCUS TIMER WITH DATABASE PERSISTENCE
// ========================================================
var timerInterval = null;
var timerRunning = false;
var timerRemainingSeconds = 25 * 60;
var timerTotalSeconds = 25 * 60;
var timerMode = "focus";
var CIRCLE_CIRCUMFERENCE = 2 * Math.PI * 45;

function setTimerMode(mode) {
    if (timerRunning) pauseTimer();
    timerMode = mode;

    var buttons = document.querySelectorAll(".timer-mode-btn");
    buttons.forEach(function(btn) {
        btn.classList.remove("active");
        if (btn.getAttribute("data-mode") === mode) {
            btn.classList.add("active");
        }
    });

    var labelEl = document.getElementById("timerModeLabel");

    if (mode === "focus") {
        timerTotalSeconds = 25 * 60;
        if (labelEl) labelEl.textContent = "Focus";
    } else if (mode === "short") {
        timerTotalSeconds = 5 * 60;
        if (labelEl) labelEl.textContent = "Short Break";
    } else if (mode === "long") {
        timerTotalSeconds = 15 * 60;
        if (labelEl) labelEl.textContent = "Long Break";
    }

    timerRemainingSeconds = timerTotalSeconds;
    updateTimerDisplay();
}

function toggleTimer() {
    if (timerRunning) {
        pauseTimer();
    } else {
        startTimer();
    }
}

function startTimer() {
    if (timerRunning) return;
    timerRunning = true;
    var btn = document.getElementById("timerToggleBtn");
    if (btn) btn.textContent = "Pause";

    timerInterval = setInterval(function() {
        if (timerRemainingSeconds > 0) {
            timerRemainingSeconds--;
            updateTimerDisplay();
        } else {
            clearInterval(timerInterval);
            timerRunning = false;
            if (btn) btn.textContent = "Start";
            
            // Persist completed focus session to database!
            var durationMinutes = Math.round(timerTotalSeconds / 60);
            sessionService.recordSession(durationMinutes, "Focus Pomodoro Session", timerMode)
                .then(function() {
                    loadDashboardStats();
                })
                .catch(function(e) {
                    console.warn("Could not save session:", e);
                });

            alert("Timer completed! 25-minute focus session saved to your study log.");
            resetTimer();
        }
    }, 1000);
}

function pauseTimer() {
    clearInterval(timerInterval);
    timerRunning = false;
    var btn = document.getElementById("timerToggleBtn");
    if (btn) btn.textContent = "Start";
}

function resetTimer() {
    pauseTimer();
    timerRemainingSeconds = timerTotalSeconds;
    updateTimerDisplay();
}

function updateTimerDisplay() {
    var displayEl = document.getElementById("timerDisplayTime");
    var circleEl = document.getElementById("timerCircleProgress");

    var minutes = Math.floor(timerRemainingSeconds / 60);
    var seconds = timerRemainingSeconds % 60;
    var formatted = (minutes < 10 ? "0" : "") + minutes + ":" + (seconds < 10 ? "0" : "") + seconds;

    if (displayEl) displayEl.textContent = formatted;

    if (circleEl) {
        var fraction = (timerTotalSeconds - timerRemainingSeconds) / timerTotalSeconds;
        var offset = CIRCLE_CIRCUMFERENCE - (fraction * CIRCLE_CIRCUMFERENCE);
        circleEl.style.strokeDashoffset = offset;
    }
}


// ========================================================
// 5. REAL DASHBOARD STATS COMPUTED FROM DATABASE
// ========================================================
async function loadDashboardStats() {
    try {
        var stats = await dashboardService.getStats();
        if (!stats) return;

        // 1. Tasks Completed Stat
        var statCompletedDisplay = document.getElementById("statCompletedCount");
        if (statCompletedDisplay) {
            statCompletedDisplay.textContent = stats.tasks.completed + " / " + stats.tasks.total;
        }
        var dashCounter = document.getElementById("dashTaskCounter");
        if (dashCounter) {
            dashCounter.textContent = stats.tasks.completed + " of " + stats.tasks.total + " done";
        }
        var progressFill = document.getElementById("statCompletedProgress");
        if (progressFill) {
            progressFill.style.width = stats.tasks.percent + "%";
        }

        // 2. Study Time Stat
        var studyTimeBlock = document.querySelectorAll(".overview-grid .stat-block")[1];
        if (studyTimeBlock) {
            var valEl = studyTimeBlock.querySelector(".stat-value");
            if (valEl) valEl.textContent = stats.studyTime.formatted;
            var metaSpan = studyTimeBlock.querySelector(".stat-meta span:first-child");
            if (metaSpan) metaSpan.textContent = "Goal: " + stats.studyTime.targetFormatted;
            var fill = studyTimeBlock.querySelector(".micro-progress-fill");
            if (fill) fill.style.width = stats.studyTime.percent + "%";
        }

        // 3. Subjects Studied Stat
        var subjectsBlock = document.querySelectorAll(".overview-grid .stat-block")[2];
        if (subjectsBlock) {
            var sValEl = subjectsBlock.querySelector(".stat-value");
            if (sValEl) sValEl.textContent = stats.subjects.count;
            var sMeta = subjectsBlock.querySelector(".stat-meta span");
            if (sMeta) sMeta.textContent = stats.subjects.summary || "No subjects yet";
        }

        // 4. Weekly Progress Stat
        var weeklyBlock = document.querySelectorAll(".overview-grid .stat-block")[3];
        if (weeklyBlock) {
            var wValEl = weeklyBlock.querySelector(".stat-value");
            if (wValEl) wValEl.textContent = stats.weeklyProgress.percent + "%";
        }

        // 5. Subject Progress List
        var subProgressContainer = document.querySelector(".subject-progress-list");
        if (subProgressContainer) {
            if (stats.subjects.items && stats.subjects.items.length > 0) {
                var colors = ["lavender", "blue", "sage", "amber", "pink"];
                var spHtml = "";
                for (var i = 0; i < stats.subjects.items.length; i++) {
                    var s = stats.subjects.items[i];
                    var colorClass = colors[i % colors.length];
                    spHtml += 
                        '<div class="subject-progress-item">' +
                            '<div class="subject-progress-head">' +
                                '<span class="subject-name">' + escapeHtml(s.name) + '</span>' +
                                '<span class="subject-percent">' + s.progress + '%</span>' +
                            '</div>' +
                            '<div class="progress-track-thin">' +
                                '<div class="progress-bar-thin ' + colorClass + '" style="width: ' + s.progress + '%;"></div>' +
                            '</div>' +
                        '</div>';
                }
                subProgressContainer.innerHTML = spHtml;
            } else {
                subProgressContainer.innerHTML = '<div style="color: var(--text-muted); font-size: 13px; padding: 16px; text-align: center;">No subjects added yet. Add your subjects to track progress.</div>';
            }
        }

        // 6. Upcoming Deadlines List
        var deadlineContainer = document.querySelector(".deadline-list");
        if (deadlineContainer) {
            if (stats.deadlines && stats.deadlines.length > 0) {
                var dHtml = "";
                for (var d = 0; d < stats.deadlines.length; d++) {
                    var dl = stats.deadlines[d];
                    dHtml += 
                        '<div class="deadline-row">' +
                            '<div class="deadline-info">' +
                                '<span class="deadline-title">' + escapeHtml(dl.title) + '</span>' +
                                '<span class="deadline-date">' + escapeHtml(dl.date) + ' • ' + escapeHtml(dl.subtext) + '</span>' +
                            '</div>' +
                            '<span class="deadline-chip normal">Active</span>' +
                        '</div>';
                }
                deadlineContainer.innerHTML = dHtml;
            } else {
                deadlineContainer.innerHTML = '<div style="color: var(--text-muted); font-size: 13px; padding: 16px; text-align: center;">No upcoming deadlines yet. Add tasks or goals with due dates.</div>';
            }
        }
    } catch (e) {
        console.warn("Could not load dashboard stats:", e);
    }
}


// ========================================================
// 6. WEEKLY STUDY PLAN & CALENDAR
// ========================================================
function selectDayTab(element, dayKey) {
    var tabs = document.querySelectorAll(".day-tab");
    tabs.forEach(function(tab) {
        tab.classList.remove("active");
    });
    element.classList.add("active");

    renderScheduleSlots(dayKey);
}

async function renderScheduleSlots(dayKey) {
    var container = document.getElementById("scheduleSlotsContainer");
    if (!container) return;

    var slots = [];
    try {
        slots = await studyPlanService.getStudyPlans(dayKey);
    } catch (e) {
        console.warn("Could not fetch study plans:", e);
    }

    if (slots.length === 0) {
        container.innerHTML = "<div style='color: var(--text-muted); font-size: 13px; padding: 16px; text-align: center;'>No scheduled slots for this day. Free study or rest.</div>";
        return;
    }

    var html = "";
    for (var i = 0; i < slots.length; i++) {
        var s = slots[i];
        html += 
            '<div class="schedule-row">' +
                '<div class="schedule-time">' +
                    '<span class="cat-dot ' + (s.category || 'dsa') + '"></span>' +
                    escapeHtml(s.timeRange || (s.startTime + ' – ' + s.endTime)) +
                '</div>' +
                '<div class="schedule-subject">' + escapeHtml(s.title) + '</div>' +
                '<div class="schedule-tag">' + escapeHtml(s.tag || 'Study Slot') + '</div>' +
            '</div>';
    }
    container.innerHTML = html;
}


// ========================================================
// 7. GLOBAL SEARCH & MOBILE SIDEBAR
// ========================================================
function handleGlobalSearch(query) {
    var q = query.toLowerCase().trim();
    var taskRows = document.querySelectorAll("#dashTaskList .task-row, #taskList .task-item");
    taskRows.forEach(function(row) {
        var text = row.textContent.toLowerCase();
        if (q === "" || text.indexOf(q) !== -1) {
            row.style.display = "flex";
        } else {
            row.style.display = "none";
        }
    });
}

function toggleMobileSidebar() {
    var sidebar = document.getElementById("appSidebar");
    var overlay = document.getElementById("sidebarOverlay");
    if (sidebar && overlay) {
        sidebar.classList.toggle("mobile-open");
        overlay.classList.toggle("active");
    }
}

function closeMobileSidebar() {
    var sidebar = document.getElementById("appSidebar");
    var overlay = document.getElementById("sidebarOverlay");
    if (sidebar && overlay) {
        sidebar.classList.remove("mobile-open");
        overlay.classList.remove("active");
    }
}

// ========================================================
// 8. HELPERS & STARTUP
// ========================================================
function escapeHtml(string) {
    if (string === null || string === undefined) return "";
    return String(string)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

document.addEventListener("DOMContentLoaded", function() {
    initAppState();
});
