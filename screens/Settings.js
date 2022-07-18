import { SafeAreaView, View, Text, Button } from "react-native";
import React, { useState, useEffect, useContext } from "react";
import { colors } from "../colors";
import { Ionicons } from "@expo/vector-icons";
import AuthContext from "../AuthContext";

export default function Settings({ navigation }) {
  let { logoutUser } = useContext(AuthContext);
  let { user } = useContext(AuthContext);
  return (
    <SafeAreaView
      style={{
        backgroundColor: colors.primary_color,
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <View style={{ display: "flex", flexDirection: "row" }}>
        <Ionicons
          name="log-out-outline"
          size={30}
          onPress={async () => {
            let a = await logoutUser();
            if (a == "a" && user == undefined) {
              navigation.navigate("Login");
            }
          }}
        />
        <Text
          style={{ fontSize: 19, marginLeft: 10 }}
          onPress={async () => {
            let a = await logoutUser();
            if (a == "a") {
              navigation.navigate("Login");
            }
          }}
        >
          Logout
        </Text>
      </View>
    </SafeAreaView>
  );
}
