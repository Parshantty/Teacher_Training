# Adding Dimension Teacher Training

A React and TypeScript teacher training portal built with Material UI and Zustand. It provides self registration, login, logout, password reset, a teacher dashboard, and an ERNET / sponsor dashboard using synthetic demonstration data.

Repository: [Parshantty/Teacher_Training](https://github.com/Parshantty/Teacher_Training)

Public demo address: [Teacher Training](https://adding-dimension-teacher-training.schoolnetind-2732.chatgpt.site). Publication is checked before the final handoff.

GitHub Pages target: `https://parshantty.github.io/Teacher_Training/`. Source push and Pages publication are pending GitHub authentication; do not treat that target as live.

## Run locally

Use Node.js 22.22.2 or newer in the 22.x release line, or Node.js 24.15+ and npm. Run these commands from the project folder:

```sh
npm ci --cache .npm-cache
npm run dev
```

Open the URL printed by Vite. Relative asset paths support GitHub Pages at `/Teacher_Training/` and the public Sites demo at the domain root.

```sh
npm run typecheck
npm test
npm run build
npm run preview
```

## Scope and demonstration behavior

The interface uses Material UI components and Zustand for application state. Vite supplies the development server and build tooling; Vitest and React Testing Library support verification. Hash navigation allows direct links and reloads on GitHub Pages.

Authentication, registration, and password reset demonstrate local interface behavior. They do not contact a server, deliver email, verify identity, or enforce a production security boundary. Use synthetic data only. API integration and backend API implementation work are excluded from this delivery.

See [task mapping and acceptance criteria](docs/TASKS.md), [deployment and rollback](docs/DEPLOYMENT.md), and [Session chats](Session%20chats.md).
