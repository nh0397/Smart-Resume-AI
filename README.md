# Smart Resume AI - Complete Project

A comprehensive AI-powered resume analysis platform that helps job seekers identify skill gaps and improve their resumes by comparing them against job descriptions.

## 🚀 Project Overview

Smart Resume AI combines a React Native frontend with a Flask backend to provide intelligent resume analysis using Google's Gemini AI. The platform extracts skills from resumes, compares them with job requirements, and provides actionable insights for career development.

## 📁 Project Structure

```
Smart Resume AI/
├── frontend/                 # React Native (Expo) application
│   ├── src/                 # Source code
│   ├── assets/              # Static assets
│   ├── App.js               # Main app component
│   └── package.json         # Frontend dependencies
├── backend/                 # Flask API server
│   ├── app.py               # Main Flask application
│   ├── requirements.txt     # Python dependencies
│   └── vercel.json          # Deployment configuration
├── .gitignore               # Combined gitignore
└── README.md                # This file
```

## 🛠️ Tech Stack

### Frontend
- **React Native** with Expo
- **Redux Toolkit** for state management
- **Expo Document Picker** for file uploads
- **React Navigation** for navigation

### Backend
- **Flask** (Python) web framework
- **Google Gemini API** for AI-powered analysis
- **Python libraries** for text extraction (PDF/Word)
- **Vercel** deployment ready

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm
- Python 3.8+ and pip
- Expo CLI (`npm install -g expo-cli`)
- Google Gemini API key

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Create environment file:
   ```bash
   # Create .env file with:
   FLASK_ENV=development
   GEMINI_API_KEY=your-gemini-api-key-here
   ```

5. Run the backend server:
   ```bash
   python app.py
   ```
   The API will be available at `http://127.0.0.1:5000/`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Update configuration:
   ```bash
   # Edit src/config.js with your backend URL:
   const CONFIG = {
       API_BASE_URL: "http://YOUR_IP:5000",
       TIMEOUT: 5000,
   };
   ```

4. Run the frontend:
   ```bash
   npx expo start --tunnel
   ```

## 📱 Features

### Resume Analysis
- **Text Extraction**: Supports PDF and Word document uploads
- **Skill Identification**: AI-powered extraction of skills from resumes
- **Gap Analysis**: Compares resume skills against job requirements
- **Improvement Suggestions**: Personalized recommendations for skill development

### User Experience
- **Mobile-First Design**: Optimized for mobile devices
- **File Upload**: Easy document selection and upload
- **Real-time Analysis**: Instant feedback on resume gaps
- **Actionable Insights**: Clear recommendations for improvement

## 🔧 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/extract-text` | POST | Extracts text from uploaded resumes |
| `/resume-gap-analysis` | POST | Analyzes resume gaps based on job descriptions |

## 🚀 Deployment

### Backend (Vercel)
The backend is configured for Vercel deployment with `vercel.json`. Simply connect your GitHub repository to Vercel for automatic deployments.

### Frontend (Expo)
The frontend can be built and deployed through Expo's build service:
```bash
npx expo build:android
npx expo build:ios
```

## 🔐 Environment Variables

### Backend (.env)
```
FLASK_ENV=development
GEMINI_API_KEY=your-gemini-api-key
```

### Frontend (config.js)
```javascript
const CONFIG = {
    API_BASE_URL: "http://your-backend-url",
    TIMEOUT: 5000,
};
```

## 📊 Development Workflow

1. **Backend Development**: Make changes in the `backend/` directory
2. **Frontend Development**: Make changes in the `frontend/` directory
3. **Testing**: Use Expo tunnel mode for testing on real devices
4. **Deployment**: Backend auto-deploys via Vercel, frontend via Expo

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the Apache-2.0 License - see the [LICENSE](LICENSE) file for details.

## Repository Structure

This is a unified repository containing both the frontend and backend components of Smart Resume AI. The project was originally developed as separate repositories but has been combined into a single, comprehensive codebase for easier development and deployment.

### Original Development
- **Frontend**: Originally developed as [Resume-Gap-Analysis](https://github.com/nh0397/Resume-Gap-Analysis)
- **Backend**: Originally developed as [Resume-Gap-Analysis-Backend](https://github.com/nh0397/Resume-Gap-Analysis-Backend)

## Support

For questions or support, please open an issue on GitHub or contact the development team.

---

**Note**: This is a unified repository containing all components of the Smart Resume AI project. Both frontend and backend are integrated as regular folders within this single repository, making it easier to develop, deploy, and maintain the complete application.
