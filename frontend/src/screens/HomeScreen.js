import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  Image,
} from "react-native";
import { RadioButton, Button, Appbar, Card } from "react-native-paper";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import logo from "../../assets/cv.png";
import CONFIG from "../config";

export default function HomeScreen() {
  const [jobDescription, setJobDescription] = useState("");
  const [resumeType, setResumeType] = useState("upload");
  const [selectedFile, setSelectedFile] = useState(null);
  const [resumeText, setResumeText] = useState("");
  const [extractionMessage, setExtractionMessage] = useState("");

  // Handle File Upload
  const handleFileUpload = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: [
          "application/pdf",
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ],
      });

      if (result.canceled || !result.assets || result.assets.length === 0)
        return;

      const fileUri = result.assets[0].uri;
      setSelectedFile(result.assets[0].name);

      // Read file as Base64 using Expo FileSystem
      const fileBase64 = await FileSystem.readAsStringAsync(fileUri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      await sendFileToBackend(fileBase64, result.assets[0].name);
    } catch (error) {
      console.error("File upload error:", error);
    }
  };

  const sendFileToBackend = async (fileBase64, filename) => {
    try {
      const response = await fetch(`${CONFIG.API_BASE_URL}/extract-text`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ file_name: filename, file_data: fileBase64 }),
      });

      const data = await response.json();
      console.log("Extracted Resume Text:", data.text);
      setResumeText(data.text); // Populate text area with extracted text

      // Show success message
      setExtractionMessage("📄 PDF/Word Data Extracted!");
      setTimeout(() => setExtractionMessage(""), 3000); // Hide after 3 seconds
    } catch (error) {
      console.error("Error sending file:", error);
    }
  };

  const analyzeResumeGap = async () => {
    if (!jobDescription.trim() || !resumeText.trim()) {
      alert("Please enter both job description and resume.");
      return;
    }
  
    try {
      const response = await fetch(`${CONFIG.API_BASE_URL}/resume-gap-analysis`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          job_description: jobDescription,
          resume_text: resumeText,
        }),
      });
  
      const data = await response.json();
      console.log("Resume Gap Analysis:", data);
      alert(`📝 Missing Skills:\n${data.missing_skills}`);
    } catch (error) {
      console.error("Error analyzing resume gap:", error);
      alert("Failed to analyze resume gap. Please try again.");
    }
  };
  


  return (
    <View style={styles.container}>
      {/* Sticky Navbar */}
      <Appbar.Header style={styles.navbar}>
        <Image source={logo} style={styles.logo} />
        <Appbar.Content title="ResumeAI" titleStyle={styles.navbarTitle} />
      </Appbar.Header>

      <View style={styles.content}>
        {/* Job Description Input */}
        <Card style={[styles.card, styles.jobDescription]}>
          <Text style={styles.label}>📄 Paste Job Description</Text>
          <ScrollView style={styles.scrollContainer} nestedScrollEnabled>
            <TextInput
              style={styles.jobInput}
              placeholder="Paste the job description here..."
              value={jobDescription}
              onChangeText={setJobDescription}
              multiline
            />
          </ScrollView>
        </Card>

        {/* Resume Input Selection */}
        <Card style={[styles.card, styles.selection]}>
          <Text style={styles.label}>📌 Select Resume Input Method</Text>
          <RadioButton.Group onValueChange={setResumeType} value={resumeType}>
            <View style={styles.radioRow}>
              <RadioButton value="upload" />
              <Text>Upload Resume (PDF/Word)</Text>
            </View>
            <View style={styles.radioRow}>
              <RadioButton value="paste" />
              <Text>Paste Resume Details</Text>
            </View>
          </RadioButton.Group>
        </Card>

        {/* Conditional Input: File Upload or Resume Text */}
        {resumeType === "upload" ? (
          <Card style={[styles.card, styles.resumeCard]}>
            <Text style={styles.label}>📂 Upload Resume</Text>
            <Button
              mode="contained"
              onPress={handleFileUpload}
              style={styles.uploadButton}
            >
              Choose File
            </Button>
            {selectedFile && (
              <Text style={styles.fileText}>📄 {selectedFile}</Text>
            )}
            {extractionMessage ? (
              <Text style={styles.successMessage}>{extractionMessage}</Text>
            ) : null}
          </Card>
        ) : (
          <Card style={[styles.card, styles.inputResumeCard]}>
            <Text style={styles.label}>✍️ Paste Your Resume</Text>
            <ScrollView style={styles.scrollContainer} nestedScrollEnabled>
              <TextInput
                style={styles.inputResume}
                placeholder="Paste your resume details here..."
                value={resumeText}
                onChangeText={setResumeText}
                multiline
              />
            </ScrollView>
          </Card>
        )}

        {/* Button: Find Resume Gap */}
        <Button
          mode="contained"
          style={styles.analyzeButton}
          onPress={analyzeResumeGap}
        >
          Find Resume Gap
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  navbar: { backgroundColor: "#6200EE", elevation: 4 },
  navbarTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    textAlign: "left",
    marginLeft: 10,
  },
  content: { padding: 20, flex: 1 },
  card: {
    padding: 15,
    marginBottom: 15,
    backgroundColor: "white",
    borderRadius: 10,
    elevation: 2,
  },
  label: { fontSize: 16, fontWeight: "bold", marginBottom: 10 },
  scrollContainer: {
    maxHeight: 150, // Ensures text does not expand indefinitely
  },
  jobInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    backgroundColor: "white",
    minHeight: 50,
    maxHeight: 150, // Prevents the input from growing too much
  },
  radioRow: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  uploadButton: { marginTop: 10, backgroundColor: "#6200EE" },
  fileText: { marginTop: 5, fontSize: 14, fontStyle: "italic", color: "#666" },
  analyzeButton: {
    backgroundColor: "#6200EE",
    padding: 10,
    marginTop: 10,
    alignSelf: "center",
  },
  logo: { width: 40, height: 40, resizeMode: "contain" },
  inputResume: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    backgroundColor: "white",
    minHeight: 50,
    maxHeight: 150, // Ensures proper scrolling inside
  },
  successMessage: {
    marginTop: 7,
    color: "green",
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "left",
  },
});
