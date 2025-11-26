import React, { useEffect, useState } from 'react';
import { FlatList, Text, View } from 'react-native';
import TasksForList from '../../src/components/TasksForList';
import { getLists } from '../../src/services/taskService';
import styles from '../../src/views/tasks/styles';

export default function TasksScreen() {
    const [lists, setLists] = useState(() => getLists());

    useEffect(() => {
        setLists(getLists());
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Tasks by List</Text>
            <FlatList
                data={lists}
                keyExtractor={(l) => String(l.id)}
                renderItem={({ item: list }) => <TasksForList key={list.id} listId={list.id} />}
                ListEmptyComponent={<Text style={styles.empty}>No lists found.</Text>}
            />
        </View>
    );
}
