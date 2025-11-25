import { Link } from 'expo-router';
import { Text, View } from "react-native";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Add "/tasks/[listId]" to the url to view tasks for a specific list.</Text>
      <Link href="/tasks" style={{ marginTop: 20, color: "blue" }}>
        Go to Tasks Screen
      </Link>
    </View>
  );
}
