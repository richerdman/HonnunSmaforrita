import React, { useRef, useState } from "react";
import {
    Modal,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from "react-native";
import styles from "./styles";

type MenuItem = { label: string; onPress: () => void; destructive?: boolean };

type Props = {
    onMove?: () => void;
    onEdit?: () => void;
    onDelete?: () => void;
    // optionally provide custom menu items
    items?: MenuItem[];
    buttonStyle?: any;
};

export default function OverflowMenu({ onMove, onEdit, onDelete, items, buttonStyle }: Props) {
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
                style={[styles.menuButton, buttonStyle]}
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
                                        left: Math.max(8, pos.x + pos.w - 200),
                                        top: pos.y + pos.h + 6,
                                    },
                                ]}
                            >
                                <View style={styles.menuInner}>
                                    {items && items.length > 0 ? (
                                        items.map((it: MenuItem, idx: number) => (
                                            <TouchableOpacity
                                                key={idx}
                                                onPress={() => {
                                                    closeMenu();
                                                    it.onPress();
                                                }}
                                                style={[
                                                    styles.menuItem,
                                                    it.destructive ? styles.menuDeleteItem : undefined,
                                                ]}
                                            >
                                                <Text style={[styles.menuText, it.destructive ? styles.deleteTxt : undefined]}>
                                                    {it.label}
                                                </Text>
                                            </TouchableOpacity>
                                        ))
                                    ) : (
                                        <>
                                            <TouchableOpacity
                                                onPress={() => {
                                                    closeMenu();
                                                    onMove && onMove();
                                                }}
                                                style={styles.menuItem}
                                            >
                                                <Text style={styles.menuText}>Move</Text>
                                            </TouchableOpacity>

                                            {onEdit ? (
                                                <TouchableOpacity
                                                    onPress={() => {
                                                        closeMenu();
                                                        onEdit && onEdit();
                                                    }}
                                                    style={styles.menuItem}
                                                >
                                                    <Text style={styles.menuText}>Edit</Text>
                                                </TouchableOpacity>
                                            ) : null}

                                            <TouchableOpacity
                                                onPress={() => {
                                                    closeMenu();
                                                    onDelete && onDelete();
                                                }}
                                                style={[styles.menuItem, styles.menuDeleteItem]}
                                            >
                                                <Text style={[styles.menuText, styles.deleteTxt]}>Delete</Text>
                                            </TouchableOpacity>
                                        </>
                                    )}
                                </View>
                            </View>
                        ) : null}
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        </View>
    );
}
