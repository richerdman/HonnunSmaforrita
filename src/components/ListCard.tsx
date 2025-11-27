import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { COLORS, FONT_SIZES, SPACING } from "../constants/theme";
import { List } from "../types/types";

type Props = {
  list: List;
  onPress?: () => void;
  onDelete?: () => void;
  onEdit?: () => void;
};

export default function ListCard({ list, onPress, onDelete, onEdit }: Props) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.left}>
        <View style={[styles.colorBox, { backgroundColor: list.color }]} />
        <Text style={styles.name}>{list.name}</Text>
      </View>

      <View style={styles.right}>
        {onEdit ? (
          <TouchableOpacity onPress={(e) => { e.stopPropagation?.(); onEdit(); }}>
            <Text style={styles.edit}>Edit</Text>
          </TouchableOpacity>
        ) : null}

        {onDelete ? (
          <TouchableOpacity onPress={(e) => { e.stopPropagation?.(); onDelete(); }}>
            <Text style={styles.delete}>Delete</Text>
          </TouchableOpacity>
        ) : null}
      </View>
    </TouchableOpacity>
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
    borderLeftColor: COLORS.primary,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 1,
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
  },
  right: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm, 
  },
  colorBox: {
    width: 16,
    height: 16,
    borderRadius: 4,
    marginRight: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  name: {
    fontSize: FONT_SIZES.medium,
    color: COLORS.textPrimary,
  },
  edit: {
    color: COLORS.primary,
    marginRight: SPACING.sm,
    fontWeight: "600",
  },
  delete: {
    color: "red",
  },
});
