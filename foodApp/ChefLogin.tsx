import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";

type Props = {
  onLogin: () => void;
  onBack?: () => void;
};

// NOTE: replace CHEF_PASS with a secure method in production
const CHEF_PASS = "chef123";

export default function ChefLogin({ onLogin, onBack }: Props) {
  const [pass, setPass] = useState("");

  const submit = () => {
    if (pass === CHEF_PASS) {
      onLogin();
      return;
    }
    Alert.alert("Access denied", "Incorrect passcode.");
  };

  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>Chef Login</Text>
      <Text style={styles.subtitle}>Chef-only access to manage the menu</Text>

      <TextInput
        placeholder="Enter chef passcode"
        secureTextEntry
        value={pass}
        onChangeText={setPass}
        style={styles.input}
      />

      <View style={styles.row}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.loginBtn} onPress={submit}>
          <Text style={styles.loginText}>Enter</Text>
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
  loginBtn: { padding: 12, borderRadius: 8, backgroundColor: "#28a745", flex: 1, marginLeft: 8, alignItems: "center" },
  loginText: { color: "#fff", fontWeight: "800" },
});