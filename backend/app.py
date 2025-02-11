from flask import Flask, request, jsonify
from flask_cors import CORS
import base64
import pdfplumber
from io import BytesIO
from docx import Document

app = Flask(__name__)
CORS(app)  # Allow API requests from React Native

# Extract text from PDF
def extract_text_from_pdf(pdf_data):
    text = ""
    with pdfplumber.open(BytesIO(pdf_data)) as pdf:
        for page in pdf.pages:
            text += page.extract_text() + "\n"
    return text.strip()

# Extract text from Word
def extract_text_from_word(doc_data):
    text = ""
    doc = Document(BytesIO(doc_data))
    for para in doc.paragraphs:
        text += para.text + "\n"
    return text.strip()

# API to extract text from uploaded files
@app.route("/extract-text", methods=["POST"])
def extract_text():
    data = request.get_json()
    file_name = data.get("file_name", "").lower()
    file_data = base64.b64decode(data.get("file_data", ""))

    if file_name.endswith(".pdf"):
        text = extract_text_from_pdf(file_data)
    elif file_name.endswith(".doc") or file_name.endswith(".docx"):
        text = extract_text_from_word(file_data)
    else:
        return jsonify({"error": "Unsupported file format"}), 400
    print('returing text', text)
    return jsonify({"text": text})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
