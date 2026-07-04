# PrepFlow

Stop Searching. Start Studying.

PrepFlow is a student-first preparation operating system. Sprint 1 establishes the production-ready project foundation without business features.

## Tech Stack

Frontend:
- React
- Vite
- Tailwind CSS
- React Router
- Axios

Backend:
- Node.js
- Express.js
- MongoDB Atlas
- Supabase Storage
- JWT-ready environment configuration

## Folder Structure

```text
PrepFlow/
├── frontend/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── constants/
│   │   ├── contexts/
│   │   ├── hooks/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── styles/
│   │   └── utils/
│   └── package.json
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── constants/
│   │   ├── controllers/
│   │   ├── middlewares/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── storage/
│   │   ├── utils/
│   │   └── validators/
│   └── package.json
└── package.json
```

## Getting Started

Install dependencies from the project root:

```bash
npm install
```

Create environment files from the examples:

```bash
cp frontend/.env.example frontend/.env
cp backend/.env.example backend/.env
```

## Environment Variables

Frontend:

```env
VITE_API_BASE_URL=http://localhost:5000
```

Backend:

```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-url>/<database-name>
JWT_SECRET=<replace-with-secure-secret>
SUPABASE_URL=https://<project-ref>.supabase.co
SUPABASE_ANON_KEY=<replace-with-supabase-anon-key>
```

## Run Instructions

Run frontend and backend together:

```bash
npm run dev
```

Run frontend only:

```bash
npm run dev:frontend
```

Run backend only:

```bash
npm run dev:backend
```

Build the frontend:

```bash
npm run build
```

Start the backend:

```bash
npm start
```

## Sprint 1 API Routes

```text
GET /       -> { "message": "PrepFlow API Running" }
GET /health -> { "status": "OK" }
```
