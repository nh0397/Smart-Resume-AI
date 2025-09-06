import os
import base64
import json
import io
import re
import pdfminer.high_level
import pytesseract
from PIL import Image
from pdf2image import convert_from_bytes
from flask import Flask, request, jsonify
from flask_cors import CORS
from docx import Document
import google.generativeai as genai
from dotenv import load_dotenv

#  Load API Key
load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=GEMINI_API_KEY)

app = Flask(__name__)
CORS(app)

###  1. Resume Text Extraction (OCR + PDF/Word Processing)
def extract_text_from_pdf(pdf_bytes):
    """Extract text from a PDF (OCR if necessary)."""
    try:
        text = pdfminer.high_level.extract_text(io.BytesIO(pdf_bytes))
        if text.strip():
            return text  #  Return extracted text if available

        #  If no text found, use OCR
        images = convert_from_bytes(pdf_bytes)
        text = " ".join(pytesseract.image_to_string(img) for img in images)
        return text

    except Exception as e:
        return f"Error extracting text from PDF: {e}"

def extract_text_from_word(docx_bytes):
    """Extract text from a Word document."""
    try:
        with io.BytesIO(docx_bytes) as f:
            doc = Document(f)
            return "\n".join([para.text for para in doc.paragraphs])
    except Exception as e:
        return f"Error extracting text from Word: {e}"

@app.route("/extract-text", methods=["POST"])
def extract_text():
    """Extracts text from uploaded PDF/Word files."""
    try:
        data = request.get_json()
        if not data or "file_data" not in data:
            return jsonify({"error": "Invalid request, missing file_data"}), 400

        file_name = data.get("file_name", "document")
        file_data = base64.b64decode(data["file_data"])

        if file_name.endswith(".pdf"):
            extracted_text = extract_text_from_pdf(file_data)
        elif file_name.endswith(".docx"):
            extracted_text = extract_text_from_word(file_data)
        else:
            return jsonify({"error": "Unsupported file format"}), 400

        return jsonify({"text": extracted_text})

    except Exception as e:
        print(f"Server Error: {e}")
        return jsonify({"error": "Internal Server Error"}), 500


###  2. Skill Extraction Using Gemini (Fixes JSON Issues)
def extract_skills(text, content_type):
    """Extracts key skills from text using Gemini AI."""
    model = genai.GenerativeModel("gemini-1.5-flash")
    response = model.generate_content(f"""
        Extract only the key technical and soft skills mentioned in the following {content_type}.
        Return only valid JSON formatted as:
        {{
          "skills": ["Python", "React", "AWS"]
        }}

        {content_type}:
        {text}
    """)

    raw_response = response.text.strip()
    print("Raw Gemini Response:", repr(raw_response))  #  Debugging Log

    try:
        #  Remove Markdown-style triple backticks if present
        cleaned_json = re.sub(r"```json\n|\n```", "", raw_response).strip()

        #  Ensure response is a valid JSON string
        skills_data = json.loads(cleaned_json)

        #  Extract the list of skills
        return skills_data.get("skills", [])

    except json.JSONDecodeError as e:
        print(f"JSON Parsing Error in extract_skills: {e}")
        print("Cleaned Gemini Response:", repr(cleaned_json))  #  Debugging Log
        return []


###  3. Smart Skill Matching Using Gemini
def compare_skills(job_skills, resume_skills):
    """Uses Gemini to match skills intelligently, handling synonyms."""
    model = genai.GenerativeModel("gemini-1.5-flash")
    response = model.generate_content(f"""
        Given these job skills and resume skills, determine matching and missing skills.
        Be very smart. Match the Acronyms if there are present. Even the shorthands if they are present.
        Make sure you check all possible ways to match the various skills.  
        Ensure the output is a valid JSON formatted as:
        {{
          "matching_skills": ["skill1", "skill2"],
          "missing_skills": ["missing1", "missing2"],
          "match_percentage": 75
        }}

        Job Skills: {", ".join(job_skills)}
        Resume Skills: {", ".join(resume_skills)}
    """)

    raw_response = response.text.strip()
    print("Raw Match Data from Gemini:", repr(raw_response))  #  Debugging Log

    try:
        #  Remove Markdown-style triple backticks if present
        cleaned_json = re.sub(r"```json\n|\n```", "", raw_response).strip()

        #  Parse the cleaned JSON
        match_data = json.loads(cleaned_json)
        return match_data

    except json.JSONDecodeError as e:
        print(f"JSON Parsing Error in compare_skills: {e}")
        print("Cleaned Gemini Response:", repr(cleaned_json))  #  Debugging Log
        return {"matching_skills": [], "missing_skills": [], "match_percentage": 0}
    

###  4. Resume Gap Analysis Endpoint
@app.route("/resume-gap-analysis", methods=["POST"])
def resume_gap_analysis():
    """Analyzes resume gaps by comparing extracted skills from job description & resume."""
    data = request.get_json()
    job_description = data.get("job_description", "")
    resume_text = data.get("resume_text", "")

    if not job_description or not resume_text:
        return jsonify({"error": "Job description and resume text are required"}), 400

    try:
        #  Extract skills from job description & resume
        job_skills = extract_skills(job_description, "job description")
        resume_skills = extract_skills(resume_text, "resume")

        #  Compare skills using Gemini
        match_data = compare_skills(job_skills, resume_skills)

        #  Generate structured project suggestions with **ONLY bullet points**
        model = genai.GenerativeModel("gemini-1.5-flash")
        response = model.generate_content(
            f"""
            Suggest practical projects (2-3 days) to gain experience in these skills:
            {", ".join(match_data.get("missing_skills", []))}

            Return the response in simple bullet points only. No fancy formatting, no bold text, no special characters other than `-` for bullet points.

            Example:
            - Build a REST API: Develop a RESTful API using Flask and deploy it to AWS.
            - Create a Frontend Dashboard: Build a React.js dashboard for displaying analytics.

            {", ".join(match_data.get("missing_skills", []))}
            """
        )

        project_suggestions = response.text.strip().split("\n")

        return jsonify(
            {
                "match_percentage": match_data.get("match_percentage", 0),
                "matching_skills": match_data.get("matching_skills", []),
                "missing_skills": match_data.get("missing_skills", []),
                "project_suggestions": project_suggestions,
            }
        )

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
