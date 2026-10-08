<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Study Planner — Enrolled Subjects &amp; Targets</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>

    <!-- Mobile Drawer Overlay -->
    <div class="sidebar-overlay" id="sidebarOverlay" onclick="closeMobileSidebar()"></div>

    <div class="app-container">

        <!-- ========================================================
             LEFT SIDEBAR
             ======================================================== -->
        <aside class="app-sidebar" id="appSidebar">
            <div class="sidebar-header">
                <div class="brand-icon">SP</div>
                <div class="brand-info">
                    <span class="brand-title">Study Planner</span>
                    <span class="brand-subtitle">Student Productivity</span>
                </div>
            </div>

            <nav class="sidebar-nav">
                <div class="nav-section-label">Workspace</div>
                
                <a href="index.html" class="nav-item">
                    <svg viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
                    <span>Dashboard</span>
                </a>

                <a href="tasks.html" class="nav-item">
                    <svg viewBox="0 0 24 24"><path d="M9 11l3 3L22 4"></path><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg>
                    <span>Tasks</span>
                    <span class="nav-badge" id="sidebarTaskBadge">3</span>
                </a>

                <a href="schedule.html" class="nav-item">
                    <svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                    <span>Calendar</span>
                </a>

                <a href="loops-arrays.php" class="nav-item active">
                    <svg viewBox="0 0 24 24"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
                    <span>Subjects</span>
                </a>

                <a href="schedule.html" class="nav-item">
                    <svg viewBox="0 0 24 24"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path></svg>
                    <span>Study Plan</span>
                </a>

                <a href="index.html#quick-notes-section" class="nav-item">
                    <svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                    <span>Notes</span>
                </a>

                <a href="welcome.php" class="nav-item">
                    <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><polygon points="12 8 8 12 12 16 12 8"></polygon></svg>
                    <span>Goals</span>
                </a>

                <div class="nav-section-label" style="margin-top: 12px;">Account &amp; Tools</div>

                <a href="register.html" class="nav-item">
                    <svg viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                    <span>Setup Profile</span>
                </a>

                <a href="feedback.html" class="nav-item">
                    <svg viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                    <span>Feedback</span>
                </a>
            </nav>

            <div class="sidebar-footer">
                <a href="register.html" class="sidebar-user-pill">
                    <div class="user-avatar-sm" id="sidebarAvatar">--</div>
                    <div class="user-pill-text">
                        <div class="user-pill-name" id="sidebarUserName">Student</div>
                        <div class="user-pill-sub" id="sidebarUserSub">Student Profile</div>
                    </div>
                </a>
            </div>
        </aside>

        <!-- ========================================================
             MAIN WORKSPACE
             ======================================================== -->
        <main class="app-main">
            <!-- Topbar -->
            <header class="app-topbar">
                <div class="topbar-left">
                    <button class="sidebar-toggle-btn" onclick="toggleMobileSidebar()" aria-label="Toggle Navigation">
                        <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
                    </button>
                    <div class="topbar-search">
                        <svg viewBox="0 0 24 24" stroke-width="2" fill="none"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                        <input type="text" placeholder="Search subjects...">
                    </div>
                </div>

                <div class="topbar-right">
                    <div class="date-pill">
                        <svg viewBox="0 0 24 24" stroke-width="2" fill="none"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                        <span>Monday, 28 Sep 2026</span>
                    </div>
                    <a href="register.html" class="topbar-profile">
                        <div class="avatar-topbar" id="topbarAvatar">--</div>
                        <span class="topbar-name" id="topbarUserName">Student</span>
                    </a>
                </div>
            </header>

            <div class="page-content">
                <div class="container">
                    <h2>Enrolled Subjects &amp; Target Marks</h2>
                    <p>Overview of enrolled semester subjects, daily study hour goals, and target exam scores.</p>

                    <!-- 1. Registered Subjects -->
                    <div style="background-color: var(--bg-canvas); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 18px; margin-top: 18px; margin-bottom: 16px;">
                        <h3 style="margin-top: 0;">Registered Course Catalog</h3>
                        <?php
                            $subjects = array("Web Technologies", "Database Management Systems", "Computer Networks", "Java Programming", "Operating Systems");
                            $total = count($subjects);

                            echo "<p style='margin-bottom: 10px;'>Total Enrolled Subjects: <b>" . $total . "</b></p>";
                            echo "<div style='display: flex; flex-wrap: wrap; gap: 8px;'>";

                            for ($i = 0; $i < $total; $i++) {
                                echo "<span class='category-badge webtech' style='padding: 5px 12px; font-size: 12px;'>";
                                echo "Course " . ($i + 1) . ": " . $subjects[$i];
                                echo "</span>";
                            }
                            echo "</div>";
                        ?>
                    </div>

                    <!-- 2. Daily Study Milestones -->
                    <div style="background-color: var(--bg-canvas); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 18px; margin-bottom: 16px;">
                        <h3 style="margin-top: 0;">Daily Study Hour Milestones</h3>
                        <div style="display: flex; flex-wrap: wrap; gap: 8px; margin-top: 8px;">
                            <?php
                                $hour = 1;
                                while ($hour <= 5) {
                                    echo "<span class='category-badge project' style='padding: 5px 12px; font-size: 12px;'>Hour " . $hour . " Completed</span>";
                                    $hour++;
                                }
                            ?>
                        </div>
                    </div>

                    <!-- 3. Study Break Reminder -->
                    <div class="note-box" style="margin-bottom: 16px;">
                        <?php
                            $break = 15;
                            do {
                                echo "<b>Break Status:</b> Recommended break duration is " . $break . " minutes after 2 hours of focused study.";
                                $break++;
                            } while ($break < 10);
                        ?>
                    </div>

                    <!-- 4. Subject Target Marks Table -->
                    <div style="background-color: var(--bg-canvas); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 18px;">
                        <h3 style="margin-top: 0;">Subject Target Scores</h3>
                        <?php
                            $studyMarks = array(
                                "Web Technologies"             => 92,
                                "Database Management Systems"  => 88,
                                "Computer Networks"            => 81,
                                "Java Programming"             => 95,
                                "Operating Systems"            => 84
                            );

                            echo "<table class='study-table'>";
                            echo "<thead><tr><th>Subject Name</th><th>Target Marks (out of 100)</th><th>Target Status</th></tr></thead>";
                            echo "<tbody>";

                            foreach ($studyMarks as $subject => $marks) {
                                $badge = ($marks >= 90) ? "<span class='priority-high'>Excellence Target</span>" : "<span class='priority-med'>Good Target</span>";
                                echo "<tr><td><b>" . $subject . "</b></td><td>" . $marks . "</td><td>" . $badge . "</td></tr>";
                            }

                            echo "</tbody></table>";
                        ?>
                    </div>

                    <div style="margin-top: 20px; display: flex; gap: 10px;">
                        <a href="index.html" class="btn btn-secondary">← Back to Dashboard</a>
                        <a href="feedback.html" class="btn">Give Feedback</a>
                    </div>

                </div>
            </div>
        </main>
    </div>

    <script src="script.js"></script>
</body>
</html>
