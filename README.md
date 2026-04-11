# Online Assessment Platform
A full-stack Online Assessment Platform developed as part of the iBOS Limited Frontend Engineer evaluation task. The platform supports two distinct user panels  Employer and Candidate  with complete exam creation, management, and participation workflows.

---

## Live Links
- Live Demo: [online-assessment-ibos.vercel.app](https://online-assessment-ibos.vercel.app/)
- GitHub Repository: [github.com/aliakbermehedi1/online-assessment-platform](https://github.com/aliakbermehedi1/online-assessment-platform)
- Video Recording: [your-video-link-here]

---

## Tech Stack
**Framework:** Next.js 16 with App Router
**State Management:** Redux Toolkit
**Forms:** Formik with Yup validation
**Styling:** Tailwind CSS
**API Handling:** Axios with interceptors
**Database:** Neon PostgreSQL (Serverless)
**Authentication:** JWT with bcryptjs password hashing
**Middleware:** Edge-compatible route protection using jose
**Deployment:** Vercel

---

## Features
### Employer Panel
Employers can log in securely and access a full exam management interface.

The dashboard displays all created exams in a clean card layout, with search and pagination support. Each card shows the exam title, total candidates, question sets, and exam slots.

Creating a new test follows a two-step process. In the first step, the employer fills in basic information including the title, candidate count, slots, question sets, question type, start and end time, and duration. In the second step, questions are added through a modal interface. Each question supports three types  Radio (MCQ), Checkbox (multiple correct), and Text (open answer). Questions can be added, edited, and deleted at any time.

### Candidate Panel
Candidates log in through a separate login page and see all available exams on their dashboard. Each card shows the exam duration, number of questions, and negative marking value.

Starting an exam brings the candidate to a focused exam screen. A countdown timer runs at the top of the page. Questions appear one at a time. The candidate can answer and proceed, or skip a question. Answers are saved to localStorage on every interaction, so if the internet drops or the page reloads, no answers are lost.

The exam auto-submits when the timer reaches zero. The candidate can also submit manually after the last question. Tab switching triggers a warning alert, and exiting fullscreen mode also produces a warning  both behaviors are tracked as part of behavioral monitoring.

After submission, a completion screen confirms the exam has been received.

---

## Setup Instructions
### Prerequisites
- Node.js 18 or higher
- A Neon database account (free tier available at neon.tech)

### Installation
Clone the repository and install dependencies:
git clone https://github.com/aliakbermehedi1/online-assessment-platform.git
cd online-assessment-platform
npm install

Create a [.env.local] file in the project root with the following variables:
DATABASE_URL=postgresql://neondb_owner:npg_JStK2OY3uNoH@ep-fragrant-bird-a1yfornm.ap-southeast-1.aws.neon.tech/neondb?sslmode=require
JWT_SECRET=akij-assessment-super-secret-key-2026
JWT_EXPIRES_IN=7d



Initialize the database by visiting this URL once after starting the dev server:
http://localhost:3000/api/init


Seed the test users:
http://localhost:3000/api/seed




Start the development server:
npm run dev

The app will be available at http://localhost:3000.

### Test Credentials
Employer  employer@ibos.com  password: employer123
Candidate  candidate@ibos.com  password: candidate123

---
## Project Structure
src/
├── app/
│   ├── (employer)/employer/        Employer pages (login, dashboard, create test)
│   ├── (candidate)/candidate/      Candidate pages (login, dashboard, exam, completed)
│   └── api/                        Backend API routes (auth, exams, questions, submissions)
├── components/
│   ├── ui/                         Shared components (Button, Input, Modal, Navbar, Footer)
│   ├── employer/                   Employer components
│   └── candidate/                  Candidate components
├── store/
│   └── slices/                     Redux slices for auth, exam, and question state
├── hooks/                          Custom hooks (useAuth, useExam, useTimer)
├── lib/                            axios instance
└── middleware.js                   




## Additional Questions

# MCP Integration
I have not worked with MCP professionally, but I understand its purpose and can describe how it would apply to this project.

MCP, or Model Context Protocol, is an open standard developed by Anthropic that allows AI models like Claude to connect with external tools and data sources in a structured way. Rather than copying and pasting context manually into an AI chat, MCP enables direct, live connections between the AI and the systems it needs to reason about.

In the context of this project, three MCP integrations would be particularly valuable.

The Figma MCP would allow Claude to read the design frames directly from Figma without any manual screenshots or descriptions. Claude could inspect component layouts, extract spacing values, color tokens, and typography, and generate matching React components automatically. This would have saved several hours of UI implementation work during this project.

The Supabase MCP would give Claude live access to the database schema and data. During development, Claude could help write and test SQL queries, identify missing indexes, or suggest schema improvements  all without the developer needing to copy schema definitions manually.

The Chrome DevTools MCP would allow Claude to inspect the running application directly  reading network requests, performance timelines, and console errors  and provide contextual debugging suggestions without the developer needing to describe what they are seeing.


# AI Tools for Development
I used Claude throughout this project as the primary development assistant. Claude was particularly useful for architectural decisions at the start of the project, for debugging the Edge Runtime incompatibility with jsonwebtoken that was blocking the middleware from working correctly, and for writing structured boilerplate code quickly under time pressure.

I also use GitHub Copilot regularly for inline autocompletion during repetitive tasks such as writing form fields, API route handlers, and Redux slice reducers.

For quick reference and syntax lookups, ChatGPT is useful as a secondary tool.

The most effective workflow I have found is to use Claude for planning and problem-solving, and Copilot for implementation speed. AI tools do not replace engineering judgment, but they significantly reduce the time spent on tasks that have clear, known solutions  freeing up focus for the parts of a project that require genuine design thinking.

### Offline Mode
If a candidate loses internet connection during an exam, the platform handles it in the following way.

Every answer selection is immediately saved to localStorage. The key stores a JSON object mapping question IDs to the selected answer values. If the page reloads for any reason, the answers can be read back from localStorage and restored to the UI state.

The exam timer is also persisted in localStorage as an absolute end timestamp rather than a countdown value. When the page loads, the remaining time is calculated from the difference between the saved end time and the current time. This means the timer continues accurately even if the browser is refreshed or the tab is closed and reopened.

When internet connectivity returns, the browser fires the online event. A listener can catch this event and automatically submit the saved answers to the server:

For a production-grade implementation, I would extend this with IndexedDB for more reliable storage of larger datasets, Service Workers to cache the exam page and API responses so the exam remains usable with no connection at all, and the Background Sync API to queue the submission and fire it reliably the moment connectivity returns, even if the user has closed the tab by then.

---

## Submission
Submitted by Ali Akber Mehedi
GitHub: https://github.com/aliakbermehedi1
Email: aliakbermehedi@gmail.com
Phone: 01854430058