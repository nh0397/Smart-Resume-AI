# ResumeAI Backend - Flask API

ResumeAI backend is a **Flask** application that processes resumes, extracts skills, and performs AI-powered resume gap analysis using **Google Gemini API**.

---

## Features
- Extracts text from uploaded **PDF/Word** resumes
- Identifies key skills from job descriptions and resumes
- Compares resume skills with job description requirements
- Provides gap analysis and project recommendations for skill improvement

---

## Tech Stack
- **Backend:** Flask (Python)
- **AI Integration:** Google Gemini API
- **OCR:** Python libraries for text extraction
- **Environment Management:** `.env` file for secure API key storage

---

## Folder Structure
```
ResumeAI-Backend/
│-- app.py                 # Main Flask application
│-- requirements.txt       # Dependencies
│-- .env                   # Environment variables (API keys, config)
│-- static/                # Static assets (if needed)
│-- templates/             # Optional frontend templates
│-- utils/                 # Utility functions for text extraction and AI integration
```

---

## Installation & Setup

### Prerequisites
Ensure you have **Python 3.8+** and **pip** installed:
```sh
python --version
pip --version
```

### Clone the Repository
```sh
git clone <your-repo-url>
cd ResumeAI-Backend
```

### Create a Virtual Environment
```sh
python -m venv venv

# Activate the virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate
```

### Install Dependencies
```sh
pip install -r requirements.txt
```

---

## Configuration
Before running the backend, **create a `.env` file** in the root directory and add the following:
```sh
FLASK_ENV=development
GEMINI_API_KEY=your-api-key-here
```

This ensures the Flask app runs in development mode and securely stores the Google Gemini API key.

---

## Running the Backend
```sh
python app.py
```
This starts the Flask server on `http://127.0.0.1:5000/`.

If running on a different machine, replace `127.0.0.1` with your machine's IP.

---

## API Endpoints
| Endpoint            | Method | Description |
|---------------------|--------|-------------|
| `/extract-text`    | POST   | Extracts text from uploaded resumes |
| `/resume-gap-analysis` | POST   | Analyzes resume gaps based on job descriptions |

---

## Connecting to Frontend
If the frontend runs on **Expo**, ensure the backend IP is accessible by using **tunnel mode**:
```sh
npx expo start --tunnel
```

In the frontend **config file (`config.js`)**, set:
```javascript
const CONFIG = {
    API_BASE_URL: "http://<your-machine-ip>:5000", 
    TIMEOUT: 5000,
};
```

---

## License
MIT License. See `LICENSE` for details.

---

## Contact
For questions or collaborations, open an issue on GitHub.

