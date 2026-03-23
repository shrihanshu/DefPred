Deployment guide — Vercel (frontend) + Render (backend)
===============================================

1) Prepare repository
- Ensure code is pushed to GitHub: `shrihanshu/DefPred` on `master` branch.

2) Backend (Render)
- Go to https://dashboard.render.com and "New +" → "Connect a repository" → choose `shrihanshu/DefPred`.
- Create a new Web Service:
  - Name: `defpred-backend`
  - Environment: `Python 3`
  - Branch: `master`
  - Build command: `pip install -r backend/requirements.txt`
  - Start command: `gunicorn -w 4 -b 0.0.0.0:$PORT app:app`
  - Plan: Free/Starter
- Add environment variables in Render's Service settings:
  - `DATABASE_URL` (set to the managed DB connection string once created)
  - `SECRET_KEY`
  - any other keys from `backend/config.py`

- Create a managed Postgres on Render (Services → Databases → New Database). Use the generated connection string to set `DATABASE_URL` on the web service.

3) Frontend (Vercel)
- Go to https://vercel.com and import the same GitHub repo.
- Setup project:
  - Framework Preset: Create React App (should be auto-detected)
  - Build Command: `npm run build`
  - Output Directory: `build`
- Set environment variables in Vercel for production:
  - `REACT_APP_API_URL` or the var your app reads (point to `https://<your-render-service>.onrender.com/api`)

4) Update `vercel.json`
- Replace `RENDER_BACKEND_URL` in `vercel.json` with your Render backend URL.

5) CI
- GitHub Actions `ci.yml` is added to build and run checks on PRs and pushes to `master`.

6) After deploy
- Frontend will be served from Vercel domain; backend from Render domain.
- Test end-to-end and adjust CORS/backend CORS settings as needed (check `backend/app.py`).

If you want, I can:
- Automatically set the Render `DATABASE_URL` env in `render.yaml` (requires Render API key).
- Add a GitHub Action to call Render's Deploy API and Vercel deployment action (requires secrets).
