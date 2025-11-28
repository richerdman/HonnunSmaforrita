import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { COLORS, FONT_SIZES, SPACING } from "../../constants/theme";
import type { Task } from "../../services/taskService";
import OverflowMenu from "../overflowMenu/overflowMenu";
import styles from './styles';

type Props = {
    task: Task;
    listColor?: string;
    onToggle: (id: number) => void;
    onMove: () => void;
    onEdit?: () => void;
    onDelete: () => void;
};

export default function TaskCard({
    task,
    listColor = COLORS.primary,
    onToggle,
    onMove,
    onEdit,
    onDelete,
}: Props) {
    return (
        <View style={[styles.card, { borderLeftColor: listColor }]}>
            <View style={styles.left}>
                <TouchableOpacity
                    onPress={() => onToggle(task.id)}
                    accessibilityRole="checkbox"
                    accessibilityState={{ checked: !!task.isFinished }}
                    style={{ marginRight: SPACING.md }}
                >
                    <View
                        style={[
                            styles.checkbox,
                            task.isFinished && styles.checkboxChecked,
                        ]}
                    >
                        {task.isFinished ? (
                            <Text style={styles.checkmark}>✓</Text>
                        ) : null}
                    </View>
                </TouchableOpacity>

                <View style={{ flex: 1 }}>
                    <Text
                        style={[
                            styles.name,
                            task.isFinished && styles.finished,
                        ]}
                    >
                        {task.name}
                    </Text>
                    {task.description ? (
                        <Text style={styles.desc}>{task.description}</Text>
                    ) : null}
                    {task.dueDate ? (() => {
                        const d = new Date(task.dueDate);
                        if (!isNaN(d.getTime())) {
                            return (
                                <View style={{ marginTop: 4 }}>
                                    <Text style={{ color: COLORS.textSecondary, fontSize: FONT_SIZES.small }}>
                                        Due: {d.toLocaleDateString()}
                                    </Text>
                                </View>
                            );
                        }
                        return null;
                    })() : null}
                </View>
            </View>

            <View style={styles.actions}>
                <OverflowMenu onMove={onMove} onEdit={onEdit} onDelete={onDelete} />
            </View>
        </View>
    );
}

