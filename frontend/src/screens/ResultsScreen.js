import React, { useState } from "react";
import { View, Text, ScrollView, StyleSheet, ActivityIndicator } from "react-native";
import { Card, Chip, Button } from "react-native-paper";
import { PieChart } from "react-native-chart-kit";
import { useNavigation } from "@react-navigation/native";

export default function ResultsScreen({ route }) {
  const navigation = useNavigation();
  const { matchPercentage, matchingSkills, missingSkills, projectSuggestions } =
    route.params;
  
  const [loading, setLoading] = useState(false);

  return (
    <View style={styles.container}>
      {loading && (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#6200EE" />
          <Text style={styles.loaderText}>Analyzing Resume Gap...</Text>
        </View>
      )}
      
      <View style={styles.cardsContainer}>
        <Card style={styles.pieCard}>
          <Text style={styles.header}>Resume Match</Text>
          <PieChart
            data={[
              {
                name: "Match",
                population: matchPercentage,
                color: "#4CAF50",
              },
              {
                name: "Gap",
                population: 100 - matchPercentage,
                color: "#FF5252",
              },
            ]}
            width={300}
            height={150}
            chartConfig={{
              backgroundGradientFrom: "#fff",
              backgroundGradientTo: "#fff",
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              propsForLabels: { fontSize: 16, fontWeight: "bold" },
            }}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="15"
            absolute
            hasLegend={false}
          />
          <Text style={styles.matchText}>{matchPercentage}% Match</Text>
        </Card>

        <Card style={styles.skillsCard}>
          <Text style={styles.subHeader}>✔ Matching Skills</Text>
          <ScrollView style={styles.scrollableList} nestedScrollEnabled>
            <View style={styles.chipContainer}>
              {matchingSkills.map((skill, index) => (
                <Chip key={index} style={styles.matchChip}>{skill}</Chip>
              ))}
            </View>
          </ScrollView>
        </Card>

        <Card style={styles.skillsCard}>
          <Text style={styles.subHeader}>❌ Missing Skills</Text>
          <ScrollView style={styles.scrollableList} nestedScrollEnabled>
            <View style={styles.chipContainer}>
              {missingSkills.map((skill, index) => (
                <Chip key={index} style={styles.missingChip}>{skill}</Chip>
              ))}
            </View>
          </ScrollView>
        </Card>

        <Card style={styles.projectCard}>
          <Text style={styles.subHeader}>🚀 How to Bridge the Gap</Text>
          <ScrollView style={styles.scrollableList} nestedScrollEnabled>
            {projectSuggestions.map((suggestion, index) => (
              <Text key={index} style={styles.projectText}>- {suggestion.trim()}</Text>
            ))}
          </ScrollView>
        </Card>
      </View>

      <Button mode="contained" style={styles.backButton} onPress={() => navigation.goBack()}>
        Go Back
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f5f5f5" },
  loaderContainer: { position: "absolute", top: "50%", left: "50%", transform: [{ translateX: -50 }, { translateY: -50 }], alignItems: "center" },
  loaderText: { marginTop: 10, fontSize: 16, color: "#6200EE" },
  cardsContainer: { flex: 1, justifyContent: "space-between", height: "90%" },
  pieCard: { display: "flex", flexDirection: "row", justifyContent: "center", marginTop: 40, alignItems: "center", padding: 15, height: "30%" },
  skillsCard: { padding: 10, height: "15%" },
  projectCard: { padding: 15, height: "25%" },
  header: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
  matchText: { fontSize: 18, fontWeight: "bold", color: "#4CAF50", marginTop: 10 },
  subHeader: { fontSize: 18, fontWeight: "bold", marginBottom: 5 },
  chipContainer: { flexDirection: "row", flexWrap: "wrap", gap: 5 },
  matchChip: { backgroundColor: "#C8E6C9" },
  missingChip: { backgroundColor: "#FFCDD2" },
  scrollableList: { maxHeight: "100%" },
  projectText: { fontSize: 14, marginVertical: 2 },
  backButton: { marginTop: 15, backgroundColor: "#6200EE" },
});
