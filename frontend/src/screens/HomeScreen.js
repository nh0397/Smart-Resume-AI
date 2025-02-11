import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Image } from "react-native";
import { RadioButton, Button, Appbar, Card } from "react-native-paper";
import * as DocumentPicker from "expo-document-picker";
import logo from "../../assets/cv.png"
import CONFIG from "../config"


export default function HomeScreen() {
  const [jobDescription, setJobDescription] = useState("");  
  const [resumeType, setResumeType] = useState("upload");   
  const [selectedFile, setSelectedFile] = useState(null);   
  const [resumeText, setResumeText] = useState(""); 

  // Handle File Upload
  const handleFileUpload = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
      });

      if (result.canceled) return;
      setSelectedFile(result.assets[0].name);
    } catch (error) {
      console.error("File upload error:", error);
    }
  };

  const handleSubmit = async () => {
    if (!jobDescription.trim()) {
      alert("Please enter a job description.");
      return;
    }
  
    let resumeContent = resumeText;
  
    if (resumeType === "upload" && selectedFile) {
      alert("Resume file processing is not yet implemented."); // Placeholder
      return;
    }
  
    try {
      const response = await fetch(`${CONFIG.API_BASE_URL}/match`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          job_description: jobDescription,
          resume_text: resumeContent,
        }),
      });
  
      const data = await response.json();
      console.log("Match Percentage:", data.match_percentage);
      console.log("Missing Keywords:", data.missing_keywords);
      alert(`Match: ${data.match_percentage}%\nMissing Keywords: ${data.missing_keywords.join(", ")}`);
    } catch (error) {
      console.error("Error analyzing resume:", error);
      alert("Failed to analyze resume. Please try again.");
    }
  };
  

  return (
    <View style={styles.container}>
      {/* Sticky Navbar */}
      <Appbar.Header style={styles.navbar}>        
        <Image source={logo} style={styles.logo}/>
        <Appbar.Content title="ResumeAI" titleStyle={styles.navbarTitle} />
      </Appbar.Header>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Job Description Input */}
        <Card style={[styles.card, styles.jobDescription]}>
          <Text style={styles.label}>📄 Paste Job Description</Text>
          <TextInput
            style={styles.jobInput}
            placeholder="Paste the job description here..."
            value={jobDescription}
            onChangeText={setJobDescription}
            multiline
          />
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
            <Button mode="contained" onPress={handleFileUpload} style={styles.uploadButton}>
              Choose File
            </Button>
            {selectedFile && <Text style={styles.fileText}>📄 {selectedFile}</Text>}
          </Card>
        ) : (
          <Card style={[styles.card, styles.inputResumeCard]}>
            <Text style={styles.label}>✍️ Paste Your Resume</Text>
            <TextInput
              style={styles.inputResume}
              placeholder="Paste your resume details here..."
              value={resumeText}
              onChangeText={setResumeText}
              multiline
            />
          </Card>
        )}

        {/* Button: Find Resume Gap (No functionality yet) */}
        <Button mode="contained" style={styles.analyzeButton} onPress={() => handleSubmit()}>
          Find Resume Gap
        </Button>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  navbar: { backgroundColor: "#6200EE", elevation: 4 },
  navbarTitle: { fontSize: 20, fontWeight: "bold", color: "white", textAlign: "left" , marginLeft:10},
  content: { padding: 20, alignItems: "stretch" },
  card: { padding: 15, marginBottom: 15, backgroundColor: "white", borderRadius: 10, elevation: 2 },
  label: { fontSize: 16, fontWeight: "bold", marginBottom: 10 },
  jobInput: { borderWidth: 1, borderColor: "#ccc", borderRadius: 5, padding: 10, backgroundColor: "white", height: "80%" },
  radioRow: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  uploadButton: { marginTop: 10, backgroundColor: "#6200EE" },
  fileText: { marginTop: 5, fontSize: 14, fontStyle: "italic", color: "#666" },
  analyzeButton: { marginTop: 20, backgroundColor: "#6200EE", padding: 10 },
  logo: { width: 40, height: 40, resizeMode: "contain" },  
  jobDescription: {height:"40%"},
  selection: {height:"30%"},
  resumeCard: {height:"30%"},
  inputResumeCard: {height:"50%"},
  inputResume: {borderWidth: 1, borderColor: "#ccc", borderRadius: 5, padding: 10, backgroundColor: "white", height: "80%"},


});

