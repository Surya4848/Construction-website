# JV CONSTRUCTION: website, API and admin dashboard

Frontend: React + Vite + Tailwind + React Router + Axios + Framer Motion + Lucide.
Backend: FastAPI + MongoDB (PyMongo) + JWT + Argon2 password hashing + Cloudinary.

## 1. MongoDB
Either install MongoDB Community locally (default `mongodb://localhost:27017`) or create a free MongoDB Atlas cluster and copy its connection string. Collections (`admins, services, projects, gallery, enquiries, testimonials, website_settings`) and indexes are created automatically on first start.

## 2. Backend (Python 3.11+)
```
cd backend
python -m venv .venv
source .venv/bin/activate          # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env               # then edit .env
uvicorn app.main:app --reload --port 8000
```
In `.env` set `MONGODB_URI`, a `JWT_SECRET` (the app refuses to start without a 32+ char secret; generate with `python -c "import secrets; print(secrets.token_urlsafe(48))"`), `CORS_ORIGINS` (your frontend URL(s)) and the three `CLOUDINARY_*` values from your Cloudinary dashboard.

- Swagger API docs: http://localhost:8000/docs
- Health check: http://localhost:8000/api/health

## 3. Create the first admin (no password is stored in code)
```
cd backend
python create_admin.py --email you@example.com --name "Your Name"
```
You are prompted for the password (min 12 characters). Run it again to reset a password. Public sign-up does not exist.

## 4. Frontend
```
cd frontend
cp .env.example .env               # VITE_API_URL=http://localhost:8000/api
npm install
npm run dev                        # http://localhost:5173
```
Admin dashboard: http://localhost:5173/admin (login at /admin/login).

In VS Code, use **Terminal > Run Task** to start **Frontend: Vite** and **Backend: FastAPI** in separate terminals. **Run Frontend and Backend** starts both tasks together. The backend task requires a running MongoDB instance.

## How content flows
Services, projects, gallery, published testimonials and website settings are loaded from the API. If the API is unreachable, or a list is empty, the site shows the built-in placeholder content from `frontend/src/data/site.js`, so it never appears broken. Testimonials are the exception: with the API online and none published, the section is hidden. Contact-form submissions are saved as enquiries (status New) and appear in the admin.

## Security notes
- All `/api/admin/*` routes require a valid JWT (`Authorization: Bearer`); login and public enquiry submission are rate limited per IP (in-memory, per process; use a shared store such as Redis if you run several workers).
- Uploads: JPG/PNG/WebP only, signature-checked, 5 MB max (`MAX_UPLOAD_MB`), stored on Cloudinary; MongoDB keeps only URLs.
- The admin token is kept in `localStorage`; serve the site over HTTPS in production and set `CORS_ORIGINS` to your real domain only.
- Deleting a record does not delete its image from Cloudinary.

## Structure
```
frontend/  React/Vite website, admin dashboard and frontend dependencies
backend/app/{core,database,models,schemas,services,routes}  FastAPI API
backend/create_admin.py  initial-admin utility
```
