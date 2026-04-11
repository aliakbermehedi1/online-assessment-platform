# Online Assessment Platform
A full-stack Online Assessment Platform built as part of the iBOS Limited Frontend Engineer evaluation task. The platform supports two distinct panels **Employer** and **Candidate** with complete exam creation, management, and participation workflows backed by a real PostgreSQL database and REST API.


## Live Links
Live Demo: https://online-assessment-ibos.vercel.app/
GitHub: https://github.com/aliakbermehedi1/online-assessment-platform
Video Recording: 


## Tech Stack
Framework: Next.js 16 
State Management: Redux Toolkit
Forms: Formik
UI/Styling: Tailwind CSS
Database: Neon PostgreSQL (Serverless, free tier)
Deployment: Vercel


## Features Implemented
### Employer Panel
- Login: JWT authentication with bcrypt password verification
- Dashboard: Paginated exam card list with live search
- Create Test (2-step): Basic info form (title, candidates, slots, question sets, type, start/end time, duration) & Questions
- Edit Test: Pre-filled form with existing data
- Delete Test: Confirmation modal before deletion
- Question Management: Add, edit, delete questions via modal, supports MCQ (Radio), Checkbox (multi-correct), and Text types
- View Candidates: Table of all submissions with score, correct/wrong/skipped breakdown, timeout flag, and submission timestamp

### Candidate Panel
- Login:  Separate auth flow, redirects to candidate dashboard on success
- Dashboard: Shows available exams with duration, question count, negative marking, and submission status per exam
- Exam Screen: One question at a time, countdown timer
- Auto-submit on timeout: Timer fires submission automatically when countdown reaches zero
- Manual submit: Candidate can submit after the last question
- Tab switch detection: and event triggers a warning alert (Not Submitting, As a warning i show alert message)
- Offline resilience: Answers saved to localStorage on every interaction, timer stored as absolute end timestamp so it survives refreshes, an event triggers re-submission attempt
- Duplicate submission prevention: API checks existing submission on exam load and redirects if already submitted



## Architecture Decisions
**Why two separate auth routes (`/api/auth/employer` and `/api/auth/candidate`)?**  
Employers and candidates have different roles and different database tables. Keeping the routes separate avoids role-confusion bugs and makes the auth logic easier to reason about.

**Why jose instead of jsonwebtoken in middleware?**  
Next.js Edge Middleware runs in a restricted runtime that does not support Node.js built-ins. `jsonwebtoken` depends on the `crypto` module, which is not available at the edge. `jose` is a pure-JS alternative that works in both Edge and Node environments.

**Why Redux Toolkit instead of Zustand?**  
Redux Toolkit was listed as a preferred option in the task requirements. The project uses three slices `auth`, `exam`, and `question` each with focused reducers. The `useAuth` and `useExam` custom hooks wrap all dispatch and selector logic so components never import Redux directly.

**Why localStorage for timer and answers?**  
The exam must survive browser refreshes and network drops. localStorage gives immediate, synchronous reads on page load with no server round-trip. The timer is stored as an absolute Unix timestamp (not a countdown), so it continues correctly even if the tab is closed and reopened minutes later.


## Project Structure
src/
├── app/
│   ├── (employer)/employer/
│   │   ├── login/              Employer login page
│   │   ├── dashboard/          Exam list with search and pagination
│   │   └── tests/
│   │       ├── create/         Two-step exam creation flow
│   │       └── [id]/
│   │           ├── page.js     Candidate submissions table + detail view
│   │           └── edit/       Pre-filled exam edit form
│   ├── (candidate)/candidate/
│   │   ├── login/              Candidate login page
│   │   ├── dashboard/          Available exams list
│   │   └── exam/
│   │       ├── [id]/           Active exam screen with timer
│   │       └── completed/      Post-submission confirmation
│   └── api/
│       ├── auth/employer/      POST login, DELETE logout
│       ├── auth/candidate/     POST login, DELETE logout
│       ├── auth/me/            GET current user from token
│       ├── exams/              GET list, POST create, DELETE by id
│       ├── exams/[id]/         GET single, PUT update
│       ├── questions/          GET, POST, PUT, DELETE
│       ├── submissions/        POST submit exam
│       ├── submissions/check/  GET has this candidate already submitted?
│       ├── submissions/results/ GET all submissions for an exam (employer only)
│       ├── init/               GET create all tables (run once)
│       └── seed/               GET insert test users
├── components/
│   ├── ui/                     Button, Input, Modal, ConfirmModal, Navbar, Footer, DropdownField
│   ├── employer/               ExamCard, CreateTestForm, EditTestForm, QuestionModal, QuestionSetsPage
│   └── candidate/              ExamCard
├── hooks/
│   ├── useAuth.js              Login, logout, Redux auth state
│   └── useExam.js              Fetch, create, edit, delete exams and questions; submit exam
├── store/
│   └── slices/
│       ├── authSlice.js
│       ├── examSlice.js
│       └── questionSlice.js
├── lib/
│   ├── auth.js                 hashPassword, comparePassword, generateToken, verifyToken
│   ├── axios.js                Axios instance with 401 interceptor
│   └── db.js                   Neon SQL client + initDB()
└── middleware.js                Edge-compatible route protection


## Setup Instructions
### Prerequisites
- Node.js 18 or higher
- A [Neon](https://neon.tech) database account (free tier is sufficient)

### 1. Clone and Install
git clone https://github.com/aliakbermehedi1/online-assessment-platform.git
cd online-assessment-platform
npm install


### 2. Environment Variables
Create a `.env.local` file in the project root:

DATABASE_URL= (add yours or use my db) ---->  postgresql://neondb_owner:npg_JStK2OY3uNoH@ep-fragrant-bird-a1yfornm.ap-southeast-1.aws.neon.tech/neondb?sslmode=require
JWT_SECRET=akij-assessment-super-secret-key-2026
JWT_EXPIRES_IN=7d

### 3. Initialize the Database (If You use your Database)
http://localhost:3000/api/init


### 4. Seed Test Users (If You use your Database)
http://localhost:3000/api/seed

### 5. Run
npm run dev

The app is available at `http://localhost:3000`.



## Test Credentials / Login Credentials
Employer: 
Email: employer@ibos.com  
Password: employer123 


Candidate: 
Email: candidate@ibos.com 
Password: candidate123 |



## Additional Questions

### MCP Integration
I have not used MCP professionally, but I have a clear picture of how it would apply here.

MCP (Model Context Protocol) is an open standard by Anthropic that lets AI models like Claude connect directly to external tools and data sources databases, design files, browser sessions without the developer needing to copy-paste context manually.

Three integrations would be genuinely useful in this project:

**Figma MCP** Claude could read the design frames directly without screenshots, extract spacing, color tokens, and component structure, and generate matching React components. This would have saved several hours during the UI phase.

**Supabase or Neon MCP** Claude would have live access to the database schema and could help write and test SQL queries, suggest missing indexes, or flag schema design issues all without me copying schema definitions by hand.

**Chrome DevTools MCP** Claude could inspect the running application directly, read network requests and console errors, and provide debugging suggestions based on what is actually happening rather than what I describe.

### AI Tools Used
**Claude** was my primary tool throughout this project. Most useful for: architectural decisions early on, debugging the Edge Runtime incompatibility with `jsonwebtoken` in Next.js middleware, writing structured boilerplate quickly, and reviewing component logic for edge cases.

**GitHub Copilot** for inline autocompletion on repetitive patterns form fields, API route handlers

**ChatGPT**  For quick syntax lookups.

The most effective workflow: use Claude for planning and problem-solving, Copilot for implementation speed. AI tools reduce time spent on tasks with known solutions, freeing focus for decisions that require real engineering judgment.


### Offline Mode
Every answer selection is saved to `localStorage` immediately, mapping question IDs to selected values. If the page reloads, answers are read back and restored to state before the first render.

The exam timer is stored as an absolute end timestamp (`Date.now() + duration`), not a countdown. On any page load, the remaining time is calculated from `endTime - Date.now()`. This means the timer is accurate even after a browser refresh, a tab close, or a short network drop.

When the `online` event fires after connectivity is restored, the platform can automatically attempt to submit any locally-saved answers:

```js
window.addEventListener('online', () => {
  const saved = localStorage.getItem(`exam_answers_${examId}`);
  if (saved) submitExam(examId, JSON.parse(saved));
});
```

## Submitted By
**Ali Akber Mehedi**  
GitHub: [github.com/aliakbermehedi1](https://github.com/aliakbermehedi1)  
Email: aliakbermehedi@gmail.com  
Phone: 01854430058
