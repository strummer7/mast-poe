import React from "react";
import { SafeAreaView, View, Text, TouchableOpacity, StyleSheet } from "react-native";

type Course = "Starters" | "Mains" | "Desserts";
type Props = {
  filter: "All" | Course;
  setFilter: (v: "All" | Course) => void;
  setScreen: (s: "home" | "chef" | "filter") => void;
};

const COURSES: Course[] = ["Starters", "Mains", "Desserts"];

const COLORS = {
  primary: "#15d825ff",
  muted: "#777",
  dark: "#263238",
};

export default function FilterScreen({ filter, setFilter, setScreen }: Props) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerWrap}>
        <View style={styles.headerTop} />
        <View style={[styles.headerCard, styles.shadow]}>
          <View style={styles.chefRow}>
            <View style={styles.avatar}><Text style={styles.avatarInitial}>F</Text></View>
            <View style={styles.chefInfo}>
              <Text style={styles.title}>Filter Meals</Text>
              <Text style={styles.tagline}>Choose course to filter</Text>
              <Text style={{ color: COLORS.muted, marginTop: 6, fontSize: 12 }}>Current: {filter}</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={{ padding: 16 }}>
        <TouchableOpacity style={[styles.filterBtn, filter === "All" && styles.filterBtnActive]} onPress={() => setFilter("All")}>
          <Text style={[styles.filterText, filter === "All" && styles.filterTextActive]}>All</Text>
        </TouchableOpacity>

        {COURSES.map(c => (
          <TouchableOpacity key={c} style={[styles.filterBtn, filter === c && styles.filterBtnActive, { marginTop: 8 }]} onPress={() => setFilter(c)}>
            <Text style={[styles.filterText, filter === c && styles.filterTextActive]}>{c}</Text>
          </TouchableOpacity>
        ))}

        <View style={{ flexDirection: "row", marginTop: 16 }}>
          <TouchableOpacity style={[styles.actionButton, styles.cancelButton, { flex: 1, marginHorizontal: 6 }]} onPress={() => setScreen("home")}>
            <Text style={styles.actionText}>Back</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionButton, styles.saveButton, { flex: 1, marginHorizontal: 6 }]} onPress={() => setScreen("home")}>
            <Text style={[styles.actionText, { color: "#fff" }]}>Apply</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F7F7F8" },
  headerWrap: { marginBottom: 8 },
  headerTop: { height: 92, backgroundColor: COLORS.primary },
  headerCard: { marginHorizontal: 16, marginTop: -44, backgroundColor: "#fff", borderRadius: 14, padding: 14, shadowColor: "#000", shadowOpacity: 0.06, shadowOffset: { width: 0, height: 8 }, shadowRadius: 16, elevation: 3 },

  chefRow: { flexDirection: "row", alignItems: "center" },
  avatar: { width: 64, height: 64, borderRadius: 32, backgroundColor: COLORS.dark, alignItems: "center", justifyContent: "center" },
  avatarInitial: { color: "#fff", fontWeight: "800", fontSize: 22 },
  chefInfo: { marginLeft: 14 },
  title: { fontSize: 20, fontWeight: "900", color: COLORS.dark },
  tagline: { color: COLORS.muted, marginTop: 4 },

  filterBtn: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 20, borderWidth: 1, borderColor: "#eee", backgroundColor: "#fff", marginRight: 8, marginTop: 6 },
  filterBtnActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  filterText: { color: COLORS.dark, fontWeight: "800" },
  filterTextActive: { color: "#fff" },

  actionButton: { flex: 1, paddingVertical: 12, borderRadius: 8, alignItems: "center", marginHorizontal: 6 },
  cancelButton: { borderWidth: 1, borderColor: "#ccc", backgroundColor: "#fff" },
  saveButton: { backgroundColor: COLORS.primary },
  actionText: { fontWeight: "800" },

  shadow: { shadowColor: "#000", shadowOpacity: 0.08, shadowOffset: { width: 0, height: 6 }, shadowRadius: 12, elevation: 4 },
});