# Delivery scope

The requested increment covers the non-API work assigned to the user in Adding Dimension Teacher Training, plus Dashboard. Original board states below come from the conversation and are not a claim that the board was updated. Overlapping user stories and child tasks share implementations.

| ID | Work item | Original state | Delivery scope |
| --- | --- | --- | --- |
| 56281 | Self Registration (Feature) | Active | Registration interface and local demonstration |
| 56282 | Provide Registration Link (User Story) | Active | Registration navigation and shareable hash link |
| 56350 | User Login – Front-end UI Design (User Story) | Active | Login interface, validation, feedback |
| 56351 | User Logout (User Story) | New | Logout control and session clearing |
| 56442 | Reset password – Frontend UI design (User Story) | Active | Reset interface and local confirmation |
| 56458 | UI Design – User Login (Task) | Closed | Covered by login interface |
| 56459 | User Logout (Task) | New | Covered by logout behavior |
| 56460 | UI Design – Reset password (Task) | Closed | Covered by reset interface |
| 56461 | Front-end project setup and architecture (User Story) | Resolved | React, TypeScript, Material UI, Zustand, Vite |
| 56462 | Front-end project setup and architecture (Task) | Closed | Covered by project architecture |
| 57282 | ERNET / Sponsor Dashboard – Front End UI Design (User Story) | New | Sponsor overview using synthetic training metrics |
| 57332 | UI Design – Provide Registration Link (Task) | Closed | Covered by registration navigation |
| 57338 | API Integration – User Login (Task) | New | Excluded: API integration |
| 57339 | User Login – Front-end API Integration (User Story) | New | Excluded: API integration |
| 57343 | Reset password – Frontend API Integration (User Story) | New | Excluded: API integration |
| 57344 | Reset password – Backend API Implementation (User Story) | New | Excluded: backend API implementation |
| 58048 | ERNET / Sponsor Dashboard – Front End API Integration (User Story) | New | Excluded: API integration |
| 58163 | Dashboard (added Task) | New | Teacher dashboard, course progress, upcoming sessions |

Work item links follow `https://dev.azure.com/schoolnetindia/_workitems/edit/<ID>`.

## Agent responsibilities

| Agent | Owned work | Acceptance criteria |
| --- | --- | --- |
| Authentication | Registration, login, logout, reset password | Accessible labels, required input feedback, valid local form submission, session clearing on logout, clear demo messaging |
| Dashboard | Teacher and sponsor dashboards | Synthetic summary metrics, training progress, upcoming sessions, sponsor reporting view, usable layout on narrow screens |
| Platform / integrator | App shell, navigation, Zustand, project setup | TypeScript build, Material UI theme, hash navigation and protected demonstration screens, coherent responsive navigation |
| DevOps / Scrum / QA | CI, deployment docs, work mapping, verification coordination | Reproducible install, type checks and behavior tests before publication, deployment artifact and rollback instructions, reported validation evidence |

## Verification plan

Verify successful login and logout, invalid registration input, reset feedback, navigation between teacher and sponsor views, session behavior after reload, and direct hash links. Inspect narrow and wide layouts and keyboard access. Run `npm run typecheck`, `npm test`, and `npm run build`. The integrator records executed results in the session record; this plan itself does not assert they passed.

Definition of done: requested interfaces are implemented, selected checks pass, excluded APIs remain out of scope, documentation matches behavior, and the deployed site is verified accessible. Production identity management and live training data remain future work.
