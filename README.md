# Maize Leaf Disease Diagnosis — Project Scaffold

Companion codebase for the proposal "A Machine Learning-Powered Web Application
for Maize Leaf Disease Detection and Management".

See **COMMANDS_GUIDE.md** for the full, ordered list of commands to set up,
train, run, and deploy this project with Docker.

## Structure

```
maize-app/
  docker-compose.yml       # orchestrates db + backend + frontend
  .env.example             # copy to .env before running
  backend/                 # FastAPI inference + knowledge base API
  frontend/                # React PWA
  ml/                      # training pipeline (run separately, needs your dataset)
```

## One-line summary of the flow

1. Collect + organize your dataset into `ml/data/<class_name>/*.jpg`
2. Train in `ml/` (Docker or local Python) → produces `ml/exported_model/`
3. `docker compose up` — backend picks up the exported model automatically, frontend talks to backend, Postgres holds the bilingual knowledge base

## Local-only assets (not in Git)

Image files are intentionally excluded from this repository (see `.gitignore`).

- **PWA icons:** place `icon-192.png` and `icon-512.png` in `frontend/public/icons/` (see `frontend/vite.config.js`).
- **Training images:** keep raw datasets on your machine or external storage; use `ml/data/<class_name>/` for the organized layout the training scripts expect.
