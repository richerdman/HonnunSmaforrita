import React, { useEffect, useState } from "react";
import { Alert, Modal, Text, TextInput, View } from "react-native";
import styles from "../views/tasks/styles";
import Button from "./button";

type Payload = { name: string; description?: string; dueDate?: string };

type Result = { ok: true; task?: any } | { ok: false; error: string };

type TaskLike = { id?: number; name?: string; description?: string; dueDate?: string };

type Props = {
    visible: boolean;
    title?: string;
    task?: TaskLike;
    onSubmit: (payload: Payload) => Promise<Result> | Result;
    onClose: () => void;
};

export default function TaskFormModal({
    visible,
    title,
    task,
    onSubmit,
    onClose,
}: Props) {
    const [name, setName] = useState(task?.name ?? "");
    const [description, setDescription] = useState(task?.description ?? "");
    const [dueDate, setDueDate] = useState(task?.dueDate ?? "");
    const [errorMsg, setErrorMsg] = useState("");

    useEffect(() => {
        setName(task?.name ?? "");
        setDescription(task?.description ?? "");
        setDueDate(task?.dueDate ?? "");
        setErrorMsg("");
    }, [task?.id, task?.name, task?.description, task?.dueDate, visible]);

    const handleSubmit = async () => {
        const trimmedName = name.trim();
        if (!trimmedName) return;

        const due = dueDate?.trim();
        if (due) {
            const isIso = /^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(due);
            let valid = false;
            if (isIso) {
                const d = new Date(due);
                valid = !isNaN(d.getTime()) && d.toISOString().startsWith(due);
            }
            if (!valid) {
                const msg = "Please enter the due date in YYYY-MM-DD format.";
                setErrorMsg(msg);
                Alert.alert("Invalid date", msg);
                return;
            }
        }

        setErrorMsg("");
        const res = await onSubmit({
            name: trimmedName,
            description: description.trim(),
            dueDate: dueDate || undefined,
        });
        if (!(res && (res as any).ok)) {
            const msg = (res && (res as any).error) || "Failed to save task";
            setErrorMsg(msg);
            Alert.alert("Error", msg);
            return;
        }

        // success — close modal
        onClose();
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <Text style={styles.formTitle}>{title ?? "Task"}</Text>
                    <TextInput
                        placeholder="Name"
                        value={name}
                        onChangeText={setName}
                        style={styles.input}
                    />
                    <TextInput
                        placeholder="Description"
                        value={description}
                        onChangeText={setDescription}
                        style={[styles.input, styles.textarea]}
                        multiline
                    />
                    <TextInput
                        placeholder="Due date (YYYY-MM-DD) - (Optional)"
                        value={dueDate}
                        onChangeText={(t) => {
                            setDueDate(t);
                            if (errorMsg) setErrorMsg("");
                        }}
                        style={styles.input}
                    />
                    {errorMsg ? (
                        <Text style={styles.error}>{errorMsg}</Text>
                    ) : null}

                    <View
                        style={{ flexDirection: "row", gap: 8, marginTop: 8 }}
                    >
                        <Button
                            title="Save"
                            onPress={handleSubmit}
                            style={{ paddingHorizontal: 16 }}
                        />
                        <Button
                            title="Cancel"
                            onPress={onClose}
                            style={{ backgroundColor: "#ccc" }}
                        />
                    </View>
                </View>
            </View>
        </Modal>
    );
}
