import { Stack } from "expo-router";
import { COLORS } from "../src/constants/theme";

// defines what header bar looks like, which screens exist, their titles and the navigation structure
export default function Layout() {
    return (
        <Stack
            screenOptions={{
                headerStyle: {
                    backgroundColor: COLORS.primary,
                },
                headerTintColor: COLORS.white,
                headerTitleStyle: {
                    fontWeight: "bold",
                },
            }}
        >
            <Stack.Screen name="index" options={{ title: "Homepage" }} />
            <Stack.Screen name="boards" options={{ title: "All Boards" }} />
            <Stack.Screen
                name="createBoard"
                options={{ title: "Create Board" }}
            />
			<Stack.Screen name="lists" options={{ title: "Lists" }} />
			<Stack.Screen name="tasks/[listId]" options={{ title: "Tasks" }} />
        </Stack>
    );
}
