import React, { useRef, useState } from "react";
import {
	Modal,
	Text,
	TouchableOpacity,
	TouchableWithoutFeedback,
	View,
} from "react-native";
import styles from "./styles";

type Props = {
    onMove: () => void;
    onEdit?: () => void;
    onDelete: () => void;
};

export default function OverflowMenu({ onMove, onEdit, onDelete }: Props) {
    const [open, setOpen] = useState(false);
    const [pos, setPos] = useState<{
        x: number;
        y: number;
        w: number;
        h: number;
    } | null>(null);
    const btnRef = useRef<any>(null);

    const openMenu = () => {
        if (btnRef.current?.measureInWindow) {
            btnRef.current.measureInWindow(
                (x: number, y: number, w: number, h: number) => {
                    setPos({ x, y, w, h });
                    setOpen(true);
                }
            );
        } else {
            setOpen(true);
        }
    };

    const closeMenu = () => setOpen(false);

    return (
        <View>
            <TouchableOpacity
                ref={btnRef}
                onPress={openMenu}
                style={styles.menuButton}
                accessibilityLabel="Open actions"
            >
                <Text style={styles.menuDots}>⋯</Text>
            </TouchableOpacity>

            <Modal
                visible={open}
                transparent
                animationType="none"
                onRequestClose={closeMenu}
            >
                <TouchableWithoutFeedback onPress={closeMenu}>
                    <View style={{ flex: 1 }}>
                        {pos ? (
                            <View
                                style={[
                                    styles.menu,
                                    {
                                        left: Math.max(8, pos.x + pos.w - 150),
                                        top: pos.y + pos.h + 6,
                                    },
                                ]}
                            >
                                <View style={styles.menuInner}>
                                    <TouchableOpacity
                                        onPress={() => {
                                            closeMenu();
                                            onMove();
                                        }}
                                        style={styles.menuItem}
                                    >
                                        <Text style={styles.menuText}>
                                            Move
                                        </Text>
                                    </TouchableOpacity>

                                    {onEdit ? (
                                        <TouchableOpacity
                                            onPress={() => {
                                                closeMenu();
                                                onEdit();
                                            }}
                                            style={styles.menuItem}
                                        >
                                            <Text style={styles.menuText}>
                                                Edit
                                            </Text>
                                        </TouchableOpacity>
                                    ) : null}

                                    <TouchableOpacity
                                        onPress={() => {
                                            closeMenu();
                                            onDelete();
                                        }}
                                        style={[
                                            styles.menuItem,
                                            styles.menuDeleteItem,
                                        ]}
                                    >
                                        <Text
                                            style={[
                                                styles.menuText,
                                                styles.deleteTxt,
                                            ]}
                                        >
                                            Delete
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ) : null}
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        </View>
    );
}
