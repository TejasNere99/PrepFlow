You are a Senior Full Stack Engineer responsible for implementing Sprint 1 of the PrepFlow project.

IMPORTANT:

This is Sprint 1 only.

Do NOT implement any features outside Sprint 1.

Do NOT build authentication.

Do NOT build CRUD.

Do NOT build dashboards.

Do NOT build UI components beyond the basic project structure.

Do NOT make assumptions about future features.

Follow only the requirements below.

====================================================

PROJECT

PrepFlow

Tagline:
Stop Searching. Start Studying.

Tech Stack

Frontend
- React
- Vite
- Tailwind CSS
- React Router
- Axios

Backend
- Node.js
- Express.js

Database
- MongoDB Atlas

Storage
- Supabase Storage

Authentication
- JWT (Not in this sprint)

====================================================

OBJECTIVE

The objective of Sprint 1 is ONLY to create the project foundation.

By the end of Sprint 1 the project should run successfully without any business features.

====================================================

FRONTEND SETUP

Create a React application using Vite.

Install and configure:

- React Router
- Axios
- Tailwind CSS

Create a scalable folder structure.

Recommended folders:

src/

assets/

components/

layouts/

pages/

services/

hooks/

contexts/

routes/

utils/

constants/

styles/

====================================================

Create placeholder pages only.

Dashboard

Login

404

Each page should simply display its page title.

Do NOT build actual UI.

====================================================

BACKEND SETUP

Create an Express application.

Configure:

Express

CORS

dotenv

Morgan

Helmet

Cookie Parser

Express JSON Middleware

Global Error Handler

====================================================

Folder Structure

backend/

src/

config/

controllers/

services/

routes/

middlewares/

models/

validators/

utils/

constants/

storage/

====================================================

Create placeholder routes.

GET /

returns

{
"message":"PrepFlow API Running"
}

GET /health

returns

{
"status":"OK"
}

====================================================

MONGODB

Configure MongoDB connection.

Create

config/database.js

Environment variables:

MONGODB_URI

PORT

====================================================

SUPABASE

Install Supabase SDK.

Configure

config/supabase.js

Load credentials from .env.

Do not implement upload APIs yet.

Only initialize the client.

====================================================

ENVIRONMENT VARIABLES

Frontend

VITE_API_BASE_URL

Backend

PORT

MONGODB_URI

JWT_SECRET

SUPABASE_URL

SUPABASE_ANON_KEY

====================================================

CODE QUALITY

Use ES Modules.

Use async/await.

Use consistent naming.

Keep controllers empty.

Keep services empty.

Keep models empty.

Only create architecture.

====================================================

README

Generate a professional README including:

Project Name

Tech Stack

Folder Structure

Getting Started

Environment Variables

Run Instructions

====================================================

GIT

Create a proper .gitignore.

Ignore:

node_modules

.env

dist

coverage

logs

====================================================

OUTPUT REQUIREMENTS

Provide complete production-ready code.

Follow best practices.

Keep the architecture modular.

Do not add unnecessary comments.

Do not implement future features.

Do not create fake data.

Do not hardcode anything.

====================================================

SPRINT COMPLETION CRITERIA

Sprint 1 is complete only if:

✅ Frontend runs successfully

✅ Backend runs successfully

✅ MongoDB connection is configured

✅ Supabase client is configured

✅ Tailwind works

✅ React Router works

✅ Express server starts

✅ Health API works

✅ README exists

✅ Folder structure is production ready

Do not proceed beyond Sprint 1.