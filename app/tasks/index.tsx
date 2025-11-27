import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { getLists } from "../../services/taskService";
import styles from "../../views/tasks/styles";

export const screenOptions = { title: "Tasks" } as const;

export default function TasksScreen() {
    const [lists, setLists] = useState(() => getLists());

    useEffect(() => {
        setLists(getLists());
    }, []);

    return (
        <View style={styles.container}>
            
        </View>
    );
}
