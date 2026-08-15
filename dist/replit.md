# Logic Smart House

## Project Overview
A professional landing page for "Logic Smart House" — an intelligent home automation company specializing in Loxone-based smart home ecosystems. Targets private homes, hotels, and commercial buildings.

## Tech Stack
- **Backend**: Python 3.11 + Flask (serves static files and handles API)
- **Frontend**: Plain HTML5, CSS3, Vanilla JavaScript (no frameworks)
- **Package Manager**: pip / Replit Python package management
- **Key Libraries**: Flask, Gunicorn, Requests

## Project Structure
```
.
├── index.html              # Main landing page (entry point)
├── logic-smart-house.html  # Full landing page content
├── server.py               # Flask backend (serves files + /api/submit endpoint)
├── main.py                 # Basic Python entry point (unused in production)
├── js/main.js              # Frontend logic (animations, form, UI)
├── css/style.css           # Styles
├── assets/                 # Images and brand assets
├── pyproject.toml          # Python dependencies
├── requirements.txt        # Python dependencies for pip-based installs
└── .replit                 # Replit workflow and deployment configuration
```

## Features
- Interactive smart home dashboard (hero section)
- Lead generation modal form
- Telegram Bot integration: POST /api/submit sends lead data to Telegram chat
- Responsive design (mobile/tablet/desktop) with dark/neon aesthetic

## Running the App
- **Workflow**: "Start application" runs `python server.py`
- **Port**: 5000
- Flask serves static files from the project root
- Development server binds to `0.0.0.0:5000` so it works in Replit's proxied preview

## Deployment
- **Target**: Autoscale
- **Run Command**: `gunicorn --bind=0.0.0.0:5000 --reuse-port server:app`

## Environment Variables
- `TELEGRAM_BOT_TOKEN`: Required for lead form to send messages to Telegram
- `TELEGRAM_CHAT_ID`: Hardcoded to `-5107261708` in server.py
