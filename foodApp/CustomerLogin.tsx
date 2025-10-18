import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";

type Props = {
  onLogin: (name: string) => void;
  onBack?: () => void;
};

export default function CustomerLogin({ onLogin, onBack }: Props) {
  const [name, setName] = useState("");

  const submit = () => {
    if (!name.trim()) {
      Alert.alert("Validation", "Please enter your name.");
      return;
    }
    onLogin(name.trim());
  };

  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>Welcome — Guest</Text>
      <Text style={styles.subtitle}>Enter your name to view the latest menu</Text>

      <TextInput
        placeholder="Your name"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />

      <View style={styles.row}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.loginBtn} onPress={submit}>
          <Text style={styles.loginText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, padding: 24, justifyContent: "center", backgroundColor: "#F7F7F8" },
  title: { fontSize: 22, fontWeight: "800", marginBottom: 6 },
  subtitle: { color: "#666", marginBottom: 18 },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    backgroundColor: "#fff",
    marginBottom: 18,
  },
  row: { flexDirection: "row", justifyContent: "space-between" },
  backBtn: { padding: 12, borderRadius: 8, backgroundColor: "#fff", borderWidth: 1, borderColor: "#ddd", flex: 1, marginRight: 8, alignItems: "center" },
  backText: { color: "#333", fontWeight: "700" },
  loginBtn: { padding: 12, borderRadius: 8, backgroundColor: "#1e90ff", flex: 1, marginLeft: 8, alignItems: "center" },
  loginText: { color: "#fff", fontWeight: "800" },
});