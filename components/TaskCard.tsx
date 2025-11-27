import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { COLORS, FONT_SIZES, SPACING } from "../constants/theme";
import type { Task } from "../services/taskService";

type Props = {
  task: Task;
  listColor?: string;
  onToggle: (id: number) => void;
  onMove: () => void;
  onEdit?: () => void;
  onDelete: () => void;
};

export default function TaskCard({ task, listColor = COLORS.primary, onToggle, onMove, onEdit, onDelete }: Props) {
  return (
    <View style={[styles.card, { borderLeftColor: listColor }]}>      
      <View style={styles.left}>
        <TouchableOpacity
          onPress={() => onToggle(task.id)}
          accessibilityRole="checkbox"
          accessibilityState={{ checked: !!task.isFinished }}
          style={{ marginRight: SPACING.md }}
        >
          <View style={[styles.checkbox, task.isFinished && styles.checkboxChecked]}>
            {task.isFinished ? <Text style={styles.checkmark}>✓</Text> : null}
          </View>
        </TouchableOpacity>

        <View style={{ flex: 1 }}>
          <Text style={[styles.name, task.isFinished && styles.finished]}>{task.name}</Text>
          {task.description ? <Text style={styles.desc}>{task.description}</Text> : null}
        </View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity onPress={onMove} style={{ paddingHorizontal: 8, paddingVertical: 4 }}>
          <Text style={{ color: "#007aff" }}>Move</Text>
        </TouchableOpacity>
        
        {onEdit ? (
          <TouchableOpacity onPress={onEdit} style={{ paddingHorizontal: 8, paddingVertical: 4 }}>
            <Text style={{ color: "#007aff" }}>Edit</Text>
          </TouchableOpacity>
        ) : null}

        <TouchableOpacity onPress={onDelete} style={styles.deleteBtn}>
          <Text style={styles.deleteTxt}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 8,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderLeftWidth: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 1,
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  name: {
    fontSize: FONT_SIZES.medium,
    color: COLORS.textPrimary,
  },
  finished: {
    textDecorationLine: "line-through",
    color: COLORS.textSecondary,
  },
  desc: {
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  actions: { justifyContent: "center", alignItems: "center" },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  checkboxChecked: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  checkmark: {
    color: COLORS.white,
    fontWeight: "700",
  },
  deleteBtn: {
    marginTop: SPACING.sm,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: "#ff3b30",
    borderRadius: 6,
  },
  deleteTxt: { color: "#fff" },
});
