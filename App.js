import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "./screens/Home";
import { View, Text, SafeAreaView, StyleSheet } from "react-native";
import Settings from "./screens/Settings";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import Login from "./screens/Login";
import Blank from "./screens/Blank";
import Profile from "./screens/Profile";
import AuthContext, { AuthProvider } from "./AuthContext";
import { useContext } from "react";

const Stack = createNativeStackNavigator();

const Tabs = createBottomTabNavigator();
export default function App() {
  const TabsNavigator = () => (
    <Tabs.Navigator
      screenOptions={{
        tabBarActiveTintColor: "lightblue",
        headerTitleAlign: "center",
      }}
    >
      <Tabs.Screen
        options={{
          tabBarLabel: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" color={color} size={size} />
          ),
        }}
        name="Home"
        component={Home}
      />
      <Tabs.Screen
        options={{
          tabBarLabel: "Settings",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="cog-outline" color={color} size={size} />
          ),
        }}
        name="Settings"
        component={Settings}
      />
      {user ? (
        <Tabs.Screen
          options={{
            tabBarLabel: "Logout",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="log-out-outline" color={color} size={size} />
            ),
          }}
          name="Logout"
          component={Blank}
          listeners={(e) => ({
            tabPress: (e) => {
              e.preventDefault();
            },
          })}
        />
      ) : null}
      {!user ? (
        <Tabs.Screen
          options={{
            tabBarLabel: "Login",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="log-in-outline" color={color} size={size} />
            ),
          }}
          name="Login"
          component={Login}
        />
      ) : null}
    </Tabs.Navigator>
  );

  const TabsNavigator1 = () => (
    <Tabs.Navigator
      screenOptions={{
        tabBarActiveTintColor: "lightblue",
        headerTitleAlign: "center",
      }}
    >
      <Tabs.Screen
        options={{
          tabBarLabel: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" color={color} size={size} />
          ),
        }}
        name="Home"
        component={Home}
      />
      <Tabs.Screen
        options={{
          tabBarLabel: "Settings",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="cog-outline" color={color} size={size} />
          ),
        }}
        name="Settings"
        component={Settings}
      />
      <Tabs.Screen
        options={{
          tabBarLabel: "Logout",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="log-out-outline" color={color} size={size} />
          ),
        }}
        name="Logout"
        component={Blank}
        listeners={(e) => ({
          tabPress: (e) => {
            e.preventDefault();
          },
        })}
      />
    </Tabs.Navigator>
  );
  let user = useContext(AuthContext);
  console.log(user);
  return (
    <>
      <AuthProvider>
        <NavigationContainer>
          <Stack.Navigator
            screenOptions={{ headerTitleAlign: "center", headerShown: true }}
            initialRouteName="Login"
          >
            <Stack.Screen
              options={{ headerShown: false }}
              name="Home"
              component={Home}
            />
            <Stack.Screen name="Settings" component={Settings} />
            {user == undefined ? (
              <Stack.Screen name="Login" component={Login} />
            ) : null}
            {user == undefined ? null : (
              <Stack.Screen name="Profile" component={Profile} />
            )}
          </Stack.Navigator>
        </NavigationContainer>
      </AuthProvider>
    </>
  );
}
