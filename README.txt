============================================================
STUDY PLANNER — MODERN STUDENT PRODUCTIVITY APPLICATION
============================================================

Overview:
The Study Planner is an academic planning application crafted for 
university students (B.Tech Computer Science & Engineering) to 
organize daily coursework, maintain realistic revision schedules, 
track focus sessions via Pomodoro, and utilize academic analytical 
tools.

------------------------------------------------------------
DESIGN IDENTITY & AESTHETIC
------------------------------------------------------------
- Visual Style: Soft Pastel + Editorial student productivity aesthetic.
- Color Palette: Warm Ivory (#FAF8F5), Soft Lavender (#EFEBF9), 
  Dusty Pink (#F9EBF0), Sage Green (#E8F1EA), Muted Blue (#E9F1F8), 
  Warm Amber (#FCF2E7), Dark Charcoal/Plum typography (#272230).
- Typography: Plus Jakarta Sans with refined weight hierarchies.
- Architecture: Left sidebar navigation + sticky quiet topbar + 
  dynamic 2-column dashboard workspace + mobile drawer navigation.

------------------------------------------------------------
PROJECT STRUCTURE & PAGES
------------------------------------------------------------
- index.html            : Main Home Dashboard with Greeting, Overview Stats,
                          Today's Tasks, Weekly Calendar, Focus Pomodoro Timer,
                          Subject Progress, Deadlines, and Quick Notes.
- tasks.html            : Dedicated Study Task Manager (Add, complete, delete,
                          filter, dynamic student switcher, shared storage).
- schedule.html         : Weekly Study Timetable & revision slots with study tips.
- register.html         : Student Profile & Semester Preference setup form.
- study-tools.html      : Priority & Marks Sorter for semester exams.
- style.css             : Comprehensive design system & responsive styling.
- script.js             : Client-side JavaScript logic for tasks, timer,
                          calendar tabs, quick notes, and marks sorter.
- welcome.php           : Dynamic student profile rendered via PHP variables.
- welcome_output.html   : Static preview of the profile dashboard & goals.
- loops-arrays.php      : Dynamic subjects, goals & target marks via PHP.
- loops_arrays_output.html : Static preview of subjects & target marks.
- images/study-desk.jpg : Editorial study desk visual asset.

------------------------------------------------------------
HOW TO OPEN THE APPLICATION
------------------------------------------------------------
1. Frontend Pages (HTML / CSS / JavaScript):
   - Simply open 'index.html' in your browser (Chrome, Edge, Firefox).
   - Use the sidebar to seamlessly navigate between Dashboard, Tasks,
     Calendar, Subjects, Study Plan, and Setup.

2. Dynamic PHP Pages (welcome.php, loops-arrays.php):
   - Place the 'Study-Planner' folder inside your local web server root
     (e.g., 'htdocs' in XAMPP or 'www' in WampServer).
   - Start Apache and open http://localhost/Study-Planner/index.html
============================================================
