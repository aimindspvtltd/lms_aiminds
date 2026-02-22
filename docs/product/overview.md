# LMS Quiz & Assessment Module — PRD v2.1 (Final)

> **Product:** LMS Quiz & Assessment Module (B2B Training Platform)  
> **Version:** 2.1 — Final, Post-Discovery, Scoped for Solo Dev + AI  
> **Date:** February 2026  
> **Tech Stack:** Java / Spring Boot / React / PostgreSQL / Redis  
> **Personas:** Admin (You) · Faculty (Trainer) · Student (Learner)  
> **Question Types:** Fill in the Blank · Single Correct MCQ · Multi Correct MCQ  
> **Business Model:** B2B — Institutes & Corporates  
> **Content Strategy:** YouTube Embeds + Third-party Links (No Custom Video Hosting)  
> **Monetization Hook:** Poll Feature (Phase 2) — Premium add-on per batch  
> **Status:** Ready for Implementation

---

### What Changed Since v2.0

1. **THREE DISTINCT QUIZ MODES** clearly defined: Classwork (projector-only, no student devices), Practice (self-paced on device), Timed Assessment (graded, timer-enforced on device).
2. **POLL FEATURE** moved entirely to Phase 2 as a premium, monetizable add-on. Classwork in Phase 1 is purely a projector presentation tool — no WebSocket, no real-time sync needed.
3. **ASSESSMENT SCHEDULING** made flexible: three launch modes (scheduled window, module-unlock-based, faculty-triggered).
4. **PHASE 1 DRASTICALLY SIMPLIFIED**: No WebSocket needed for classwork. WebSocket only needed for timed quiz monitoring. This saves ~1 week of development.

---

## 1. Executive Summary & Key Decisions

You are a B2B corporate training company. You send trainers to institutes and corporates to deliver short-duration technical courses (3–15 days). You are building an LMS, starting with the Quiz & Assessment module, to replace the PowerPoint + Google Forms workflow that trainers currently use.

This is being built by a solo backend developer (Java/Spring Boot) with AI assistance. Frontend (React) is the bottleneck. The product must ship fast, look professional, and work on any device including phones on poor networks.

### 1.1 The Three Quiz Interaction Modes

This is the most important conceptual framework in the entire product. Every feature traces back to one of these three modes.

| Mode | Who Interacts? | Student Device? | Graded? | Real-time? | Phase |
|------|---------------|-----------------|---------|------------|-------|
| **Classwork** | Faculty projects, students watch | No | No | No | Phase 1 |
| **Practice Quiz** | Student solves on device | Yes | No (feedback only) | No | Phase 1 |
| **Timed Assessment** | Student solves on device | Yes | Yes (scored) | Timer only | Phase 1 |
| **Classwork + Poll** | Faculty projects, students answer on device, live count shown | Yes | No | Yes (WebSocket) | Phase 2 |

> **Why This Matters for Engineering**
>
> - Phase 1 requires ZERO WebSocket for classwork. Classwork is a simple React page that fetches questions from a REST API and toggles answer visibility on click. No student-side rendering, no real-time sync, no connection management.
> - Phase 1 WebSocket is only needed for timed assessment: syncing timer state and faculty's extend-time/release-results actions.
> - Phase 2 Poll adds WebSocket to classwork: student answers stream to faculty, live count updates, response distribution charts. This is the premium layer that clients pay extra for.
> - This phasing saves approximately 1 week of development in Phase 1.

### 1.2 All Decisions Made During Discovery

| Decision | Choice Made | Rationale |
|----------|-------------|-----------|
| Who creates content? | Admin only. Faculty just delivers. | Keeps trainer UX ultra-simple. |
| Trainer flexibility? | Fixed sequence. Admin pre-builds, trainer follows. | Faster to build. Ensures consistency. |
| Student access model? | Admin-configurable per course (sequential or open). | Flexibility for different clients. |
| Student onboarding? | Both: join-link/code AND pre-enrollment. | Handles ad-hoc Day 1 AND planned batches. |
| Device support? | Any device. Mobile-first for students. | Phones, tablets, desktops — all must work. |
| Content delivery? | YouTube embeds + third-party links. | Don't build what YouTube does. |
| Classwork mode? | Projector-only (Phase 1). Poll adds device interaction (Phase 2). | Ship fast. Monetize the upgrade. |
| Poll feature? | Phase 2 premium add-on. Configurable per batch. | Revenue driver, not MVP essential. |
| Assessment scheduling? | Flexible: scheduled window / module-unlock / faculty-triggered. | Covers all client scenarios. |
| Certificates? | Deferred to Phase 3. | Not needed for first pilots. |
| White-labeling? | Deferred to Phase 3. Subdomain per client. | Nice-to-have, not PMF-critical. |
| Admin panel? | You are admin for Phase 1. API/DB seeding. | Ship student + faculty apps first. |
| Reports? | Professional Excel export in MVP. PDF in Phase 2. | Excel is fast to build, sufficient for pilots. |
| Partial marking (MCQ)? | Both modes. Default all-or-nothing. Toggle per quiz. | Standard in competitive exams. |
| Result release? | Faculty-controlled. | Prevents answer-sharing during live quiz. |
| Tech stack? | Java / Spring Boot / React / PostgreSQL / Redis. | Play to backend strength. |

---

## 2. Personas & Responsibility Matrix

Three distinct personas with zero overlap in responsibilities. This separation is the foundation of the product architecture.

### 2.1 Admin (You, Initially)

> **Who Is This Person?**
> In Phase 1, this is YOU. You seed data via API calls, SQL scripts, or a minimal admin UI. In Phase 2+, this becomes a full web-based Admin Panel for your operations team. The Admin never enters the classroom. They work before and after training sessions.

**Admin Responsibilities:**

- Create and manage Courses (e.g., "Core Java — 5 Days")
- Build Course Structure: Modules → Content Blocks (videos, links, quizzes) in fixed sequence
- Author questions manually or via bulk CSV/Excel upload
- Build quizzes: select questions, set type (classwork/practice/timed), configure settings
- Create Batches: assign a Course, a Trainer, a date range, a join code, and Students
- Manage student enrollment: add/remove students, share join links
- Configure per-course: sequential vs. open access, assessment scheduling
- Configure per-batch: poll enabled/disabled (Phase 2 monetization toggle)
- View results, generate reports, export to Excel

### 2.2 Faculty (Trainer)

> **Who Is This Person?**
> A 28–45 year old technical professional. Strong in subject, not necessarily tech-savvy. Teaches 6–8 hours/day. Zero patience for complex UIs. Uses a projector. DOES NOT create questions, manage students, or configure settings. Just delivers content.

> **The 3-Button Rule**
> The faculty's classroom mode should never show more than 3 primary actions at any time: Previous, Reveal Answer / Next, End Session. If you need a 4th button, you've over-complicated it.

**Faculty Responsibilities (Exhaustive):**

- Log in. See assigned batch(es) and today's course module.
- Open Classroom Mode. Step through the pre-built content: show video → show classwork question → reveal answer → next.
- For timed assessments: launch the quiz when reaching that content block. Monitor. Extend time if needed. Release results.
- View results summary after a timed assessment.
- Export results to Excel.
- THAT'S IT. Nothing else.

### 2.3 Student (Learner)

> **Who Is This Person?**
> Ranges from college freshers to mid-career corporate professionals. Uses ANY device: phone, tablet, lab desktop, personal laptop. Internet quality varies wildly. Institute labs: 30 students on one router. Needs things to just work. No app install. Minimal friction.

**Student Responsibilities:**

- Join a batch via shared link/code OR pre-enrolled account.
- Follow the course content: watch videos, read materials, take practice quizzes.
- Take timed assessments when available (scheduled, unlocked, or faculty-launched).
- View results (when released) and track personal performance.
- Practice independently after class using practice mode.
- NOTE: During classwork, students do NOT interact with the platform. They watch the projector.

### 2.4 Responsibility Matrix

| Action | Admin | Faculty | Student |
|--------|-------|---------|---------|
| Create courses & modules | ✓ | ✗ | ✗ |
| Author/upload questions | ✓ | ✗ | ✗ |
| Build quizzes (classwork/practice/timed) | ✓ | ✗ | ✗ |
| Enroll/remove students | ✓ | ✗ | ✗ |
| Configure course & batch settings | ✓ | ✗ | ✗ |
| Toggle poll on/off per batch (Phase 2) | ✓ | ✗ | ✗ |
| Launch classroom mode | ✗ | ✓ | ✗ |
| Project classwork questions + reveal answers | ✗ | ✓ | ✗ |
| Launch timed assessment | ✗ | ✓ | ✗ |
| Extend assessment time | ✗ | ✓ | ✗ |
| Release results | ✗ | ✓ | ✗ |
| View class analytics & export reports | ✓ | ✓ | ✗ |
| Join batch | ✗ | ✗ | ✓ |
| Take practice quiz (on device) | ✗ | ✗ | ✓ |
| Take timed assessment (on device) | ✗ | ✗ | ✓ |
| View own results | ✗ | ✗ | ✓ |
| Watch course content (videos, links) | ✗ | ✓ (projects) | ✓ (device) |
| Participate in poll (Phase 2) | ✗ | ✓ (enables) | ✓ (answers) |

---

## 3. Core Feature Specifications

### 3.1 Classwork Mode (Projector-Only Presentation)

> **What Is Classwork?**
> Classwork is a projector tool that replaces PowerPoint for classroom Q&A. The faculty projects questions on screen, gives students time to think (silently or discuss), then clicks to reveal the answer. In Phase 1, there is ZERO student device interaction during classwork. Students watch the projector. In Phase 2, the Poll add-on layers student device interaction on top of this experience.

#### Phase 1: Classwork Without Poll

- Faculty opens Classroom Mode for the current module.
- Content blocks play in sequence. When a Classwork quiz is reached, questions display one at a time.
- Screen shows: Question number (large), Question text (large), Options (for MCQ) or Blank (for FIB). Answer is HIDDEN.
- Faculty gives students time to think or discuss. Students look at the projector, discuss with peers, write on paper — but they do NOT interact with the platform.
- Faculty clicks "Reveal Answer." Correct answer highlights in green. Explanation shows below (if provided).
- Faculty discusses the answer with the class.
- Faculty clicks "Next" to move to the next content block (could be another question, a video, etc.).
- Faculty clicks "End Session" to exit classroom mode.

**Projector UI Requirements:**

- Question number: 48px bold. Question text: 32px. Options: 28px. Explanation: 24px.
- High contrast: dark text (#1B2631) on pure white. Green (#2D6A4F) for correct. Red (#C0392B) for incorrect.
- NO navigation bars, user menus, logos, or anything unrelated to the current question.
- Code snippets: monospace font (Fira Code / JetBrains Mono), minimum 22px, preserve indentation.
- Must render well on 16:9 and 4:3 projector ratios.
- Keyboard shortcuts: Space = Reveal, Right Arrow = Next, Left Arrow = Previous, Escape = End.

> **Engineering Simplicity: No WebSocket Needed**
>
> Classwork without poll is a simple React page:
> 1. Fetch content blocks for the module (GET /api/faculty/modules/{id}/content-blocks).
> 2. Display each content block in sequence: YouTube iframe for VIDEO, link card for LINK, question card for QUIZ (classwork type).
> 3. Question card has two states: answer-hidden and answer-revealed. A single useState toggle.
> 4. Previous/Next navigates through the content block array.
>
> That's it. No WebSocket. No student connections. No real-time sync. This is a 2-day build.

#### Phase 2: Classwork WITH Poll (Premium Add-on)

When poll is enabled for a batch, classwork gains student device interaction. This is the premium feature clients pay for.

- Admin enables poll for the batch (checkbox when assigning course to batch). This is a billing decision.
- Faculty can choose per-question whether to use poll or just reveal (flexibility to use poll for some questions, not others).
- Faculty can first solve and discuss without poll, then re-open the same question as a poll.
- When poll is active: students see the question on their devices and submit their answer.
- Faculty's control panel shows live answer count ("18 of 30 answered") updating via WebSocket.
- Faculty clicks "Reveal Answer" — projected screen shows correct answer. Optionally shows response distribution (how many picked each option).
- Faculty must explicitly advance to the next question (students can't skip ahead).

> **Poll Configuration Levels**
>
> - **Level 1 — Batch Level:** Admin enables/disables poll when assigning course to batch. This is the "did they pay for it" toggle.
> - **Level 2 — Session Level:** Even if poll is enabled for the batch, faculty can choose to NOT use it for a session (e.g., running through questions quickly without waiting for device answers).
> - **Level 3 — Question Level:** Faculty can toggle poll per-question in the classroom. Some questions are poll-worthy, others are quick reveal.

### 3.2 Practice Quiz Mode (Student Self-Study)

Low-pressure, self-paced learning. The goal is understanding, not scoring. Students interact on their own devices.

**Behavior:**

- No timer. Students work at their own pace.
- After answering each question: immediately show correct/wrong, the correct answer, and the explanation.
- Option to retry wrong questions (configurable by admin per quiz).
- Progress auto-saved to server. If browser closes, resume where left off.
- End summary: total correct, total attempted, breakdown by question type.
- No marks permanently recorded. Student can retake unlimited times.
- Faculty sees aggregate practice data only ("60% of students got Inheritance questions wrong"). Individual attempts are private.

**Mobile UX Requirements:**

- Single-column layout. One question per screen on mobile.
- Large tap targets for options (minimum 48px height, full-width buttons).
- Swipe navigation optional. Previous/Next buttons always visible.
- No horizontal scrolling. Code snippets wrap or scroll in a fixed-width container.
- Auto-save on every answer (not just on "next"). Students lose connectivity unpredictably.

### 3.3 Timed Assessment Mode (Graded)

Formal, graded assessments. Must be credible enough that institutes accept results as valid evaluations.

#### Assessment Availability — Three Flexible Modes

> **How Assessments Become Available to Students**
>
> The admin configures ONE of three availability modes when creating the assessment content block:
>
> **MODE A — Scheduled Window:** Admin sets a start_time and end_time. Assessment is only accessible within that window. Example: "Available Feb 10, 2:00 PM – 3:00 PM." Students can start anytime within the window; timer begins when they start.
>
> **MODE B — Module Unlock:** No scheduled time. Assessment becomes available when the student completes all prior content blocks in the module (respects sequential access mode). If the course is set to OPEN access, the assessment is immediately available.
>
> **MODE C — Faculty-Triggered:** Assessment is hidden until the faculty explicitly launches it during classroom mode. Faculty reaches the assessment content block and clicks "Launch Quiz." Students see it appear on their devices in real-time. This is the live classroom assessment scenario.
>
> All three modes can coexist across different assessments in the same course. The admin picks the right mode for each assessment.

#### Assessment Lifecycle (All Modes)

1. **AVAILABILITY:** Assessment becomes available via one of the three modes above.
2. **START:** Student clicks "Start Assessment." Server records start_time. Personal timer begins (server-side).
3. **IN PROGRESS:** Countdown visible at all times. Questions navigable freely. Flag-for-review available. Answers auto-saved every 10 seconds + on every navigation.
4. **30-SECOND WARNING:** Visual + optional sound alert.
5. **AUTO-SUBMIT:** Timer expires → auto-submit with whatever is answered. If student submits early: confirmation dialog ("Are you sure? 18 minutes remaining. Submission is final.").
6. **RESULTS HOLD:** Student sees "Assessment submitted. Results will be available when your trainer releases them."
7. **RESULTS RELEASE:** Faculty clicks "Release Results." Students can now see: score, correct answers, explanations.

#### Critical Technical Details

- Timer is SERVER-SIDE. Client timer is display-only. On page reload, client syncs with server's remaining time.
- Answers saved to server every 10 seconds AND on every question navigation. IndexedDB as local backup.
- On reconnection after network drop: client sends locally-saved answers, server reconciles (latest timestamp wins).
- Shuffle: question order and option order randomized per student at start. Stored server-side for consistency on reload.
- Early submission is FINAL. No un-submit. Confirmation dialog with remaining time.
- Faculty "Extend Time" adds X minutes to ALL active students. WebSocket notification to students.

#### Edge Cases

| Scenario | Behavior | Technical Notes |
|----------|----------|-----------------|
| Internet drops for 3 min | Timer keeps running server-side. On reconnect, answers sync. Time is lost by design. | IndexedDB stores locally. POST /api/student/quizzes/{id}/sync on reconnect. |
| Browser closed entirely | Same as above. Re-opening URL resumes with server timer. | Session token in cookie. No re-auth mid-quiz. |
| Faculty extends time | All active students get extra minutes. Already-submitted students NOT affected. | WebSocket event. UI updates timer instantly. |
| Student submits early | Final. Cannot re-enter. Score calculated but not shown until released. | StudentQuizResult created. is_auto_submitted = false. |
| Scheduled window passes | Students who haven't started cannot start. Students in progress continue until their timer expires. | Check window at quiz-start, not during. |
| Faculty-triggered: faculty closes laptop | Quiz continues. Timer is server-side. Students can still submit. | QuizSession is server-managed, not tied to faculty connection. |
| Student opens on two devices | Last-active device wins. Other device shows warning. | Track via WebSocket connection or session token. |

---

## 4. Question Types — Detailed Specification

All three question types work across all three modes (classwork, practice, timed). The rendering and interaction differ by mode.

### 4.1 Single Correct MCQ (SCQ)

| Aspect | Detail |
|--------|--------|
| Display | Question text + 4 options (A/B/C/D) with radio buttons (practice/timed) or plain text (classwork) |
| Input | Student selects exactly one option (practice/timed). No input during classwork. |
| Scoring | Binary: full marks if correct, 0 if wrong. |
| Shuffle | Option order randomized per student in timed mode (admin configurable). |
| Classwork Reveal | Correct option highlights green. Others dim. |
| Practice Feedback | Immediate: green/red highlight + explanation shown after answer. |
| Code Support | Question text supports Markdown code blocks with syntax highlighting. |

### 4.2 Multi Correct MCQ (MCQ)

| Aspect | Detail |
|--------|--------|
| Display | Question text + 4–6 options with checkboxes. Labeled: "Select all that apply." |
| Hint | Show count: "Select 3 correct answers." This is a major usability improvement. |
| Input | Student selects one or more options (practice/timed). No input during classwork. |
| Scoring — All-or-Nothing | Full marks only if ALL correct options selected and NO wrong options. Default mode. |
| Scoring — Partial | +1 for each correct, −0.5 for each wrong. Admin toggle per quiz. Min score: 0. |
| Classwork Reveal | All correct options highlight green. Wrong selections highlight red. |

### 4.3 Fill in the Blank (FIB)

| Aspect | Detail |
|--------|--------|
| Display | Question text with a visible blank (underline or input box). Blank at start, middle, or end. |
| Input | Student types text into the blank (practice/timed). No input during classwork. |
| Matching Default | Case-insensitive, whitespace-trimmed. "extends", " Extends ", "EXTENDS" all match. |
| Multiple Answers | Admin can define multiple accepted answers: e.g., "extends" and "extends keyword." |
| Near-Miss | If student's answer has Levenshtein distance ≤ 2 from correct: flag for faculty manual review (timed mode). |
| Classwork Reveal | Correct answer fills the blank with green highlight. |
| Scoring | Binary: match any accepted answer = full marks. |

> **Critical: FIB Matching Will Be the #1 Student Complaint If Done Wrong**
>
> - Default: case-insensitive + trim whitespace. This handles 90% of cases.
> - Admin can add multiple accepted answers for each question. This handles another 9%.
> - Near-miss flagging handles the last 1%: student types "extens" (typo), system flags it, faculty can manually mark correct.
> - For practice mode: just show correct vs. wrong. No need for manual review.
> - For timed mode: near-misses are auto-flagged in the results dashboard for faculty to review before releasing results.

---

## 5. Content Delivery System

Lightweight content delivery. You curate sequences of existing resources alongside your quizzes.

### 5.1 Content Block Types

| Type | What It Is | How It Renders | Phase |
|------|-----------|----------------|-------|
| VIDEO | YouTube video | Responsive iframe embed. 16:9 ratio. Playback controls. | Phase 1 |
| LINK | External URL (article, docs) | Title + description + "Open in new tab" button. | Phase 1 |
| QUIZ_CLASSWORK | Question set for projector delivery | Faculty-only: question + reveal flow. No student rendering. | Phase 1 |
| QUIZ_PRACTICE | Question set for student self-study | Student device: interactive quiz with instant feedback. | Phase 1 |
| QUIZ_TIMED | Graded assessment with timer | Student device: timed quiz with auto-submit. | Phase 1 |
| PDF | Uploaded PDF document | Embedded viewer or download link. | Phase 2 |
| CODE_EXERCISE | Interactive coding challenge | Embedded code editor (Judge0 API). | Phase 3 |

### 5.2 Course Structure Example

> **Example: Core Java — 5 Days**
>
> Module 1: Java Basics
> - VIDEO: "Introduction to Java" (YouTube)
> - LINK: "Java Installation Guide" (docs.oracle.com)
> - QUIZ_CLASSWORK: "Java Basics Review" (8 questions — faculty projects these)
> - QUIZ_PRACTICE: "Java Basics Practice" (15 questions — students self-study)
> - QUIZ_TIMED: "Java Basics Assessment" (20 questions, 30 min — graded)
>
> Module 2: OOP Concepts
> - VIDEO: "Classes and Objects" (YouTube)
> - VIDEO: "Inheritance Deep Dive" (YouTube)
> - QUIZ_CLASSWORK: "OOP Concept Check" (5 questions)
> - QUIZ_PRACTICE: "OOP Practice Set" (20 questions)
> - QUIZ_TIMED: "OOP Assessment" (25 questions, 40 min, scheduled: Day 3, 2 PM–3 PM)

### 5.3 Sequential vs. Open Access

- **SEQUENTIAL:** Students must complete Module 1 before Module 2. Within a module, content blocks accessed in order. "Complete" means: video watched (>80%), link visited, quiz submitted.
- **OPEN:** All modules and content blocks accessible immediately.
- Configured per-course by admin. Default recommendation: SEQUENTIAL for institutes, OPEN for corporates.
- Technical: a progress table tracks each student's completion per content block. Sequential mode checks prerequisites.

---

## 6. Student Onboarding & Access

> **60-Second Rule**
> From "open browser" to "seeing the first content" must take under 60 seconds via join code. No app installs. No email verification. No password requirements. Name + phone + code = you're in.

### 6.1 Path A: Pre-Enrollment

- Admin creates the batch and adds students by email/phone.
- Students receive invite email/SMS with link: "You've been enrolled in Core Java training."
- Student clicks link, creates account (or OTP login for zero friction), sees their course.
- For shared lab desktops: email + OTP login each session (no persistent login needed).

### 6.2 Path B: Join Code

- Admin generates a 6-character join code for the batch (e.g., "JAVA42").
- Trainer projects the code. Students open the URL, enter code + name + phone/email.
- Immediately in the batch. Can see course content.
- Admin can later clean up: merge duplicates, remove unauthorized joins.

---

## 7. Data Model

Designed for MVP speed with full extensibility. Build this right on Day 1 to avoid migrations.

### 7.1 Core Entities

| Entity | Key Fields | Notes |
|--------|-----------|-------|
| Organization | id, name, subdomain (future), logo_url (future), settings_json | Enables multi-tenant from Day 1. |
| User | id, org_id, email, phone, name, role (ADMIN/FACULTY/STUDENT), password_hash, status | Role-based access. OTP students may have null password. |
| Course | id, org_id, title, description, duration_days, access_mode (SEQUENTIAL/OPEN) | Has many Modules. |
| Module | id, course_id, title, sort_order | Has many ContentBlocks. |
| ContentBlock | id, module_id, type, title, sort_order, config_json | type: VIDEO/LINK/QUIZ_CLASSWORK/QUIZ_PRACTICE/QUIZ_TIMED. config_json holds type-specific data. |
| Question | id, org_id, type (SCQ/MCQ/FIB), text (markdown), options_json, correct_answer_json, explanation, topic_tag, difficulty | Reusable across quizzes. |
| Quiz | id, org_id, title, quiz_mode (CLASSWORK/PRACTICE/TIMED), time_limit_min, shuffle_questions, shuffle_options, scoring_mode, settings_json | Quiz definition. Linked to ContentBlock. |
| QuizQuestion | quiz_id, question_id, sort_order, marks | Ordered join table. |
| Batch | id, org_id, course_id, faculty_user_id, title, start_date, end_date, join_code, poll_enabled (Phase 2), status | Connects Course + Faculty + Students. |
| BatchStudent | batch_id, student_user_id, enrolled_at, status | Enrollment join table. |
| QuizSession | id, batch_id, quiz_id, started_by, started_at, ends_at, status (PENDING/LIVE/ENDED), extended_min, availability_mode, scheduled_start, scheduled_end | Instance of a quiz taken by a batch. |
| StudentResponse | id, session_id, student_user_id, question_id, response_json, is_correct, score, answered_at, time_spent_sec | Individual answer. |
| StudentQuizResult | id, session_id, student_user_id, total_score, max_score, pct, submitted_at, is_auto_submitted | Aggregated result. |
| StudentProgress | id, batch_id, student_user_id, content_block_id, status (NOT_STARTED/IN_PROGRESS/COMPLETED), completed_at | Tracks sequential access progress. |

### 7.2 QuizSession Availability Modes

The QuizSession entity supports all three assessment availability modes via the availability_mode field:

| availability_mode | Fields Used | Behavior |
|-------------------|-------------|----------|
| SCHEDULED | scheduled_start, scheduled_end | Accessible only within the time window. Faculty does not need to do anything. |
| MODULE_UNLOCK | (none — checked against StudentProgress) | Accessible when all prior content blocks in the module are completed. |
| FACULTY_TRIGGERED | started_at (set when faculty clicks Launch) | Hidden until faculty launches. Faculty must be in classroom mode. |

For classwork and practice quizzes, availability is always MODULE_UNLOCK (or immediate if course is OPEN access). The three modes above apply specifically to timed assessments.

### 7.3 Question Data Formats

**SCQ — options_json & correct_answer_json:**

| Field | Example |
|-------|---------|
| options_json | `[{"key":"A","text":"extends"},{"key":"B","text":"implements"},{"key":"C","text":"inherits"},{"key":"D","text":"derives"}]` |
| correct_answer_json | `{"key":"A"}` |

**MCQ — options_json & correct_answer_json:**

| Field | Example |
|-------|---------|
| options_json | `[{"key":"A","text":"ArrayList"},{"key":"B","text":"LinkedList"},{"key":"C","text":"HashMap"},{"key":"D","text":"TreeSet"}]` |
| correct_answer_json | `{"keys":["A","B"],"scoring":"ALL_OR_NOTHING"}` |

**FIB — correct_answer_json:**

| Field | Example |
|-------|---------|
| text | The keyword to inherit a class in Java is _____. |
| correct_answer_json | `{"accepted":["extends"],"case_sensitive":false,"trim_whitespace":true}` |

---

## 8. Reporting & Deliverables

The end-of-training report is your sales tool. A polished report that the coordinator forwards to management makes your company look premium and sells the next batch.

### 8.1 Phase 1: Excel Export

One-click export from faculty dashboard. Professional formatting using Apache POI.

**Sheet 1: Summary**
- Batch name, course name, trainer name, dates.
- Total students, total who completed assessments.
- Average score, highest, lowest, pass rate (configurable threshold).
- Score distribution: 0–30%, 30–60%, 60–80%, 80–100% buckets.

**Sheet 2: Detailed Results**
- One row per student: Name, Email/Phone, Assessment 1 Score, Assessment 2 Score, ..., Total, %, Pass/Fail.
- Sortable. Filterable. Ready to forward as-is to institute coordinator.
- Auto-formatted with headers, borders, conditional coloring (green for pass, red for fail).

### 8.2 Phase 2: PDF Report

- Professional PDF with company logo (+ institute logo for white-label).
- Visual charts: score distribution bar chart, topic-wise performance breakdown.
- Per-question analysis: correct rate, most common wrong answer.
- Generated server-side: HTML template → Puppeteer render → PDF. Or iText for Java-native.

---

## 9. Solo Developer Strategy

This section turns the feature list into a realistic execution plan for one backend-strong developer.

### 9.1 Frontend Strategy

> **Your Frontend Is Your Bottleneck — Survive, Don't Thrive**
>
> 1. USE SHADCN/UI + TAILWIND. Every component pre-built. Don't design from scratch.
> 2. USE AI TO GENERATE REACT COMPONENTS. Describe in detail. Review and integrate.
> 3. SIMPLE STATE: React Query for server state. useState for local. No Redux.
> 4. ONE APP, THREE ROUTE GROUPS: /admin/*, /faculty/*, /student/*. Role-based routing.
> 5. MOBILE-FIRST FOR STUDENTS ONLY. Faculty UI = desktop-only. Admin UI = basic (it's you).
> 6. CLASSWORK PROJECTOR VIEW: Literally one React component. Fetch questions, show/hide answer. 2-hour build.

### 9.2 Backend Strategy

- Spring Boot 3 + Spring Security + JWT. Your wheelhouse.
- PostgreSQL for all data. Index: batch_id, student_user_id, quiz_session_id, content_block_id.
- Redis for: quiz timer state, session management. Optional for Phase 1 (can use DB).
- Spring WebSocket (STOMP/SockJS) for timed assessment: timer sync, extend-time notifications, quiz-launch events. NOT needed for classwork in Phase 1.
- REST APIs for everything else. Standard CRUD with DTOs.
- Excel export: Apache POI. 2–3 hours of work.
- Bulk upload: Apache POI to parse Excel. Validate rows. Return error report for invalid rows.

### 9.3 What NOT to Build

> **Time Savers — Non-Negotiable for Solo Dev**
>
> - ✗ No custom video player. YouTube iframe = 3 lines of code.
> - ✗ No email infrastructure. SendGrid free tier (100/day) or SMTP via Spring Mail.
> - ✗ No rich text editor. Markdown + react-markdown preview.
> - ✗ No admin panel UI in Phase 1. You = admin. Postman + SQL scripts.
> - ✗ No user profile pages. No settings pages. No notification preferences.
> - ✗ No password reset for students. OTP-only = no passwords = no resets.
> - ✗ No analytics dashboards with charts in Phase 1. Excel export covers it.
> - ✗ No WebSocket for classwork. Phase 1 classwork is a static React page.
> - ✗ No tab-switch detection in Phase 1. Phase 2 feature.
> - ✗ No certificates. Phase 3.

---

## 10. Week-by-Week Sprint Plan

Scoped for a solo backend developer, 8–10 hours/day, AI assistance for React. Total Phase 1: 5 weeks (simplified from 6 weeks due to classwork simplification).

### Week 1: Foundation + Core Backend

| Day | Task | Output |
|-----|------|--------|
| D1 | Spring Boot project setup. PostgreSQL schema. Flyway migrations. React (Vite + Tailwind + Shadcn/UI) scaffolding. | Both apps running locally. |
| D2–D3 | Auth: JWT + role-based access. OTP for students (Spring Mail / SMS API). Email+password for faculty/admin. | Login/register APIs working. |
| D4–D5 | Question CRUD APIs: create/read/update/delete. All 3 types. Bulk upload from Excel (Apache POI). | Questions importable via API + Excel. |
| D6–D7 | Quiz + ContentBlock + Module + Course CRUD. Batch CRUD with join-code generation. Student enrollment. | Full admin API surface ready. |

### Week 2: Student App (Mobile-First)

| Day | Task | Output |
|-----|------|--------|
| D8–D9 | React: Student join page (join code flow). OTP login page. Mobile-first layout. | Students can join via code on phone. |
| D10–D11 | React: Course content viewer. YouTube embed. Link display. Sequential content navigation. | Students browse course content. |
| D12–D14 | React: Practice quiz UI. All 3 question types. Submit answer → instant feedback → explanation. Auto-save. Resume. | Practice quiz fully working on mobile + desktop. |

### Week 3: Timed Assessment + Faculty Basics

| Day | Task | Output |
|-----|------|--------|
| D15–D17 | React: Timed quiz UI. Countdown timer (server-synced). Question navigation. Flag for review. Auto-submit. Submit confirmation. | Timed assessment complete on student side. |
| D18 | Backend: QuizSession management. Timer state. Auto-submit logic. Server-side answer reconciliation. | Assessment backend solid. |
| D19–D20 | React: Faculty login. Batch dashboard. See modules + content blocks. | Faculty can log in and see their batch. |
| D21 | Backend: WebSocket setup for timed quizzes only. Faculty launch, extend time, release results. | Real-time quiz control working. |

### Week 4: Classwork + Results

| Day | Task | Output |
|-----|------|--------|
| D22–D23 | React: Classwork projector view. Question display, reveal answer, navigation. Keyboard shortcuts. Projector-optimized CSS. | Classwork mode ready. ~2 day build, no WebSocket. |
| D24–D25 | React: Faculty results dashboard. Score table. Per-student breakdown. Release results button. | Faculty sees results after assessment. |
| D26–D27 | Backend: Excel export (Apache POI). Summary sheet + detailed sheet. Professional formatting. | One-click Excel download. |
| D28 | React: Student results view. Score, correct answers, explanations (when released). | Students review assessment performance. |

### Week 5: Integration, Polish & Deploy

| Day | Task | Output |
|-----|------|--------|
| D29–D30 | End-to-end testing: full flow from course setup → student join → practice → assessment → results. | All flows working end-to-end. |
| D31–D32 | Network resilience: test on slow connections. Fix auto-save edge cases. Test mobile on real devices. | Product works on bad networks + phones. |
| D33–D34 | Deploy to staging (Docker + any cloud). Domain setup. SSL. Test with real test batch. | Staging environment live. |
| D35 | Final bug fixes. Seed first real course data via Postman/SQL. Prepare for pilot. | Ready for first pilot batch. |

> **Week 5 Exit Criteria: Definition of Done**
>
> - ✓ Faculty logs in, opens classroom mode, projects questions, reveals answers (no WebSocket needed).
> - ✓ Student joins via code on phone, watches videos, takes practice quiz with instant feedback.
> - ✓ Faculty launches timed assessment. Student takes it with countdown timer. Auto-submit works.
> - ✓ Faculty releases results. Student sees score + correct answers. Faculty exports to Excel.
> - ✓ Sequential access works: Module 2 locked until Module 1 complete.
> - ✓ All 3 question types work across all modes. FIB matching is case-insensitive + trim.
> - ✓ Works on phone, tablet, and desktop.
> - ✗ No admin UI. You use Postman/SQL.
> - ✗ No poll feature. Phase 2.
> - ✗ No PDF reports. Excel only.
> - ✗ No certificates. No white-labeling.

---

## 11. Future Phases

### Phase 2: Admin Panel + Poll + Analytics (Weeks 6–9)

- Admin web UI: course builder, question bank manager, batch management, student enrollment
- Poll feature: WebSocket for classwork, live answer counts, response distribution, per-batch toggle
- Poll monetization: admin enables poll per batch (tied to pricing tier)
- Faculty can switch between non-poll and poll mode per question in classroom
- Tab-switch detection during timed assessments
- Question-level analytics: correct rate, average time, common wrong answer
- PDF report generation with company branding
- Student performance history dashboard

### Phase 3: Scale & Differentiation (Weeks 10–14)

- Certificates: attendance + score-based, configurable templates per organization
- White-label subdomains: client.yourplatform.com with custom logo and colors
- Batch-over-batch comparative analytics
- Student weak-topic identification and personalized practice recommendations
- Institute coordinator role: read-only access to results and reports
- Near-miss FIB review workflow in faculty results dashboard

### Phase 4: Platform Expansion (Weeks 15+)

- Interactive coding exercises (Judge0 API)
- Assignment/project submission module
- Discussion forum per batch
- Attendance tracking (QR code check-in)
- Mobile app (React Native)
- LTI integration for institutes with existing LMS

---

## 12. API Reference (Phase 1)

All REST except WebSocket events. Organized by persona.

### 12.1 Auth APIs

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register new user (admin-initiated) |
| POST | /api/auth/login | Email + password login (faculty/admin) |
| POST | /api/auth/otp/send | Send OTP to phone/email (students) |
| POST | /api/auth/otp/verify | Verify OTP, return JWT |
| POST | /api/auth/join | Join batch via code + name + phone/email |

### 12.2 Admin APIs (You via Postman)

| Method | Endpoint | Description |
|--------|----------|-------------|
| CRUD | /api/admin/courses | Course management |
| CRUD | /api/admin/courses/{id}/modules | Module management with ordering |
| CRUD | /api/admin/modules/{id}/content-blocks | Content block management (video/link/quiz) |
| CRUD | /api/admin/questions | Question CRUD (all 3 types) |
| POST | /api/admin/questions/bulk-upload | Excel upload with validation + error report |
| CRUD | /api/admin/quizzes | Quiz management (classwork/practice/timed) |
| POST | /api/admin/quizzes/{id}/questions | Attach questions to quiz with ordering |
| CRUD | /api/admin/batches | Batch management (course + faculty + join code) |
| POST | /api/admin/batches/{id}/students | Enroll students |
| DELETE | /api/admin/batches/{id}/students/{sid} | Remove student |

### 12.3 Faculty APIs

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/faculty/batches | My assigned batches |
| GET | /api/faculty/batches/{id}/modules | Course content sequence for classroom mode |
| GET | /api/faculty/modules/{id}/content-blocks | Content blocks in a module (classwork questions, videos, etc.) |
| GET | /api/faculty/quizzes/{id}/questions | Get classwork quiz questions (for projector view) |
| POST | /api/faculty/quiz-sessions | Launch a timed assessment for the batch |
| PATCH | /api/faculty/quiz-sessions/{id}/extend | Extend time for active assessment |
| PATCH | /api/faculty/quiz-sessions/{id}/release | Release results to students |
| GET | /api/faculty/quiz-sessions/{id}/results | Results summary |
| GET | /api/faculty/quiz-sessions/{id}/export | Download Excel report |

### 12.4 Student APIs

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/student/batches | My enrolled batches |
| GET | /api/student/batches/{id}/content | Course content (respects sequential/open) |
| GET | /api/student/content-blocks/{id}/progress | My progress on a content block |
| POST | /api/student/content-blocks/{id}/complete | Mark content block complete (video watched, link visited) |
| GET | /api/student/quizzes/{id}/start | Start practice or timed quiz |
| POST | /api/student/quizzes/{id}/answer | Submit answer for a question |
| POST | /api/student/quizzes/{id}/sync | Sync locally-saved answers after reconnect |
| POST | /api/student/quizzes/{id}/submit | Final submission (timed assessment) |
| GET | /api/student/quiz-sessions/{id}/results | My results (if released) |

### 12.5 WebSocket Events (Timed Assessment Only in Phase 1)

| Direction | Event | Payload |
|-----------|-------|---------|
| Faculty → Server | quiz.launch | {batchId, quizId} |
| Server → Students | quiz.available | {sessionId, quizId, timeLimit} |
| Student → Server | quiz.started | {sessionId, studentId} |
| Server → Faculty | student.started | {studentId, name} (for monitoring) |
| Faculty → Server | quiz.extend | {sessionId, extraMinutes} |
| Server → Students | time.extended | {extraMinutes, newEndTime} |
| Server → Student | quiz.autosubmit | {sessionId} (timer expired) |
| Faculty → Server | results.release | {sessionId} |
| Server → Students | results.available | {sessionId} |

Phase 2 adds WebSocket events for Poll: student.answered, answer.count.update, question.reveal, response.distribution.

---

## 13. Success Metrics

| Metric | Target | Measurement | When |
|--------|--------|-------------|------|
| First pilot batch succeeds | 1 batch, zero critical bugs | Manual observation | Week 6 |
| Join-to-first-content time | < 60 seconds via code | Timestamp logs | Week 5 |
| Assessment completion rate | > 95% of starters finish | QuizResult count / BatchStudent count | Week 7 |
| Faculty classwork adoption | No PowerPoint fallback used | Trainer feedback | Week 7 |
| Excel report generation | < 5 seconds for 50 students | API response time | Week 5 |
| Mobile usability | Quiz completable on phone without frustration | Test with 3–5 students | Week 5 |
| Repeat client | First client requests platform for next batch | Sales feedback | Month 3 |

---

## 14. Poll Feature — Monetization Strategy (Phase 2)

The poll feature is not just a product feature — it's a pricing lever. Here's how to position it.

### 14.1 Pricing Model

- **Base tier:** Classwork (projector-only) + Practice + Timed Assessments. Included in all packages.
- **Premium tier:** Everything in Base + Live Poll with real-time response tracking. Higher price per batch.
- The poll toggle lives on the Batch entity (poll_enabled boolean). Admin sets it during batch creation based on what the client paid for.
- Faculty experience automatically adapts: if poll_enabled = true, the classroom mode shows poll controls. If false, just the reveal flow.

### 14.2 Sales Pitch for Poll

- **To institutes:** "See which students are actually understanding vs. just nodding along. Live participation tracking gives you data on every student."
- **To corporates:** "Real-time engagement metrics. Know exactly which topics your employees struggled with. Compliance-ready participation logs."
- **Upsell trigger:** After a base-tier pilot, show the trainer what the poll dashboard COULD look like with sample data. Let them experience the value gap.

---

**End of PRD v2.1 — Ready for Implementation**

Three modes. Three personas. One solo dev. Let's ship it.
