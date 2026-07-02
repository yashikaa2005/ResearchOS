# ResearchOS Development Guide (Development Bible)

## 1. Project Vision

ResearchOS is a MERN-based research workflow operating system.

It is **not**: - A PDF chatbot - A NotebookLM clone - A ChatGPT wrapper

It helps users: - Manage research projects - Upload and organize
papers - Take notes - Extract concepts - Build a knowledge graph - Track
idea evolution - Detect contradictions - Detect research gaps

------------------------------------------------------------------------

# 2. Tech Stack

## Frontend

-   React 19
-   Vite
-   Tailwind CSS v4
-   React Router
-   Axios
-   React Flow (later)
-   shadcn/ui (later)

## Backend

-   Node.js
-   Express 4

## Database

-   MongoDB Atlas
-   Mongoose 8

## Authentication

-   JWT
-   bcryptjs

------------------------------------------------------------------------

# 3. Backend Folder Structure

src/ - config/ - constants/ - controllers/ - middleware/ - models/ -
routes/ - services/ - utils/ - validators/

Rules: - Controllers: Receive request, call service, send response. -
Services: Business logic only. - Models: Schema only. - Routes: Endpoint
mapping only. - Utils: Reusable helpers.

------------------------------------------------------------------------

# 4. Frontend Folder Structure

src/ - assets/ - components/ - common/ - layout/ - ui/ - context/ -
hooks/ - layouts/ - pages/ - routes/ - services/ - styles/ - utils/

------------------------------------------------------------------------

# 5. API Response Format

Success

``` json
{
  "success": true,
  "data": {}
}
```

Failure

``` json
{
  "success": false,
  "message": "..."
}
```

------------------------------------------------------------------------

# 6. Naming Conventions

Database: - userId - projectId - documentId - conceptId

Files: - user.model.js - auth.service.js - auth.controller.js -
auth.routes.js - auth.middleware.js

Never expose MongoDB \_id directly to the frontend.

------------------------------------------------------------------------

# 7. Git Strategy

Commit after every completed feature.

Examples: - chore: initialize project foundation - feat:
authentication - feat: project management - feat: pdf upload - feat:
notes system - feat: concept extraction - feat: knowledge graph - fix:
resolve mongodb dns lookup

------------------------------------------------------------------------

# 8. AI Workflow

## ChatGPT

Use for: - Architecture - API design - Database design - Debugging -
Code reviews - Interview preparation

## Claude

Use for: - Large services - Controllers - CRUD modules - Large React
pages

Never ask Claude to generate the whole project.

## v0

Use only for UI: - Landing page - Dashboard - Sidebar - Timeline -
Knowledge graph UI

## Gemini API

Use only inside the application: - Concept extraction - Contradiction
detection - Research gap detection

------------------------------------------------------------------------

# 9. Development Workflow

Requirement → Database Design → API Design → Backend → Postman Testing →
Frontend → Integration → Git Commit → Git Push

------------------------------------------------------------------------

# 10. MVP Scope

-   Authentication
-   Project Management
-   PDF Upload
-   Notes
-   Concept Extraction
-   Knowledge Graph
-   Idea Evolution
-   Contradiction Detection

Everything else is optional after the MVP.

------------------------------------------------------------------------

# 11. Interview Rule

Understand every file you generate.

AI is an assistant, not the author.

Always be able to explain: - Why this folder exists - Why this API
exists - Why this database schema exists - Why this design decision was
made
