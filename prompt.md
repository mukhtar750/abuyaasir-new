**MyTutorPlus LMS — Premium Full Build Blueprint (Laravel + Inertia/React)**

---

Build a world-class, premium Learning Management System called **MyTutorPlus** using Laravel 11, Inertia.js (React), and Tailwind CSS. The platform is specifically tailored for teaching Mathematics, Physics, and Chemistry, with specialized modules for JAMB, WAEC, and Summer Classes.

---

### **1. DESIGN SYSTEM & AESTHETICS**

- **Goal:** A $100k-tier, highly dynamic, and interactive Single Page Application (SPA).
- **Colors:** Primary: `#1A3C5E` (Deep Navy) | Accent: `#F4A623` (Amber), `#2ECC8C` (Teal) | Background: `#0D1B2A` (Dark Mode by default) to `#F7F5F0` (Light Mode).
- **Typography:** *Fraunces* (Serif, for headings/elegance) + *Inter* or *DM Sans* (Body/UI).
- **Components:** Glassmorphism on overlays, smooth page transitions using Framer Motion, skeleton loaders during data fetch, and micro-animations on hover states.

---

### **2. ROLES, AUTH & MAINTENANCE MODE**

Use Laravel Breeze (Inertia React stack) for scaffolding.

**Roles (`role` column on `users` table):**
- `student` — enroll, take CBT mock exams, track progress.
- `tutor` — manage assigned subjects, grade assignments.
- `admin` — full control (assign tutors, manual enrollment, ad campaigns).

**Smart Maintenance Mode:**
- Create a `CheckMaintenanceMode` custom middleware.
- When toggled in the DB or cache, public visitors see a beautiful "We're Updating" UI.
- Admins/Developers can access a secret URL (`/dev-bypass`) which sets an encrypted cookie, allowing them full access to the live site while others are blocked.

---

### **3. DATABASE SCHEMA & RELATIONSHIPS**

Build the following migrations:

```php
users: id, name, email, password, role, avatar, points, streak_days
subjects: id, name (Math, Physics, Chemistry), description, cover_image
courses: id, subject_id, title, type (Standard, JAMB, WAEC, Summer), price, is_published
subject_tutor (pivot): subject_id, tutor_id (Allows Admin to assign Tutors to specific Subjects)
enrollments: id, student_id, course_id, enrolled_by_admin (boolean), progress_percent
lessons: id, course_id, title, video_url, content, order
cbt_exams: id, course_id, title, duration_minutes, total_marks
cbt_questions: id, cbt_exam_id, question_text, options (json), correct_option
cbt_results: id, student_id, cbt_exam_id, score, time_spent
campaigns: id, title, type (Summer, JAMB, General), image_url, link, is_active (For the Ad Engine)
```

---

### **4. CORE MODULES & WORKFLOWS**

#### **Admin Management Workflow:**
- **Subject & Tutor Mapping:** Admins create Subjects (e.g., Physics) and assign specific Tutors to handle them.
- **Manual Enrollment:** Admins can directly enroll a student into a course/subject from the admin panel (setting `enrolled_by_admin = true`).
- **Student Self-Enrollment:** Students can browse the catalog and purchase/enroll themselves.

#### **Dynamic Ad & Announcement Engine:**
- A built-in marketing system. The Admin manages `campaigns`.
- On the Student Dashboard and Homepage, a global React component fetches active campaigns and displays high-converting Banners (e.g., "Register for Summer Classes", "JAMB 2026 Intensive Prep").

#### **CBT (Computer-Based Testing) Engine:**
- Crucial for JAMB & WAEC prep.
- A dedicated React interface that locks the screen, shows a countdown timer, and handles multiple-choice questions with instantaneous grading and performance review after submission.

---

### **5. ROUTES STRUCTURE (Inertia)**

```php
// Public
GET  /                  → Landing Page (with active Ad campaigns)
GET  /courses           → Catalog

// Student
GET  /dashboard         → Welcome, Stats, Active Enrollments, Announcements
GET  /courses/{id}/learn→ React Video Player & Sidebar
GET  /cbt/{id}/take     → CBT Interface (Timer, Questions)

// Tutor
GET  /tutor/dashboard   → Assigned subjects, student performance

// Admin
GET  /admin/dashboard   → Platform metrics
POST /admin/assign-tutor→ Map tutor to subject
POST /admin/enroll      → Manually enroll a student
GET  /admin/campaigns   → Manage Summer/JAMB Ads
POST /admin/maintenance → Toggle maintenance mode
```

---

### **6. STUDENT DASHBOARD UI SPECIFICATION**

The `StudentDashboard.jsx` component must include:
1. **Top Navbar:** Glassmorphic, Logo, Theme Toggle (Dark/Light), Notifications.
2. **Ad Banner Slot:** Renders active campaigns (e.g., Summer Bootcamps) dynamically.
3. **Welcome Section:** "Welcome back, {Name}" with Streak counter (flame icon) and Points display.
4. **My Learning Cards:** Grid of enrolled courses showing beautiful thumbnail, Subject badge (Physics, Math), and a React progress bar.
5. **Upcoming CBTs/Exams:** A list of upcoming JAMB or WAEC mock exams assigned to their courses.

---

### **7. IMPLEMENTATION STEPS**

Use this exact prompt to scaffold the architecture. Proceed in this order:
1. Install Laravel 11, React, Inertia, Tailwind.
2. Generate Migrations & Models based on the schema above.
3. Scaffold Auth (Breeze React) & Middleware (Roles + Maintenance Mode).
4. Build Admin panel logic (Tutor assignment, Manual Enrollment, Campaigns).
5. Build the CBT Engine and Student Dashboard.