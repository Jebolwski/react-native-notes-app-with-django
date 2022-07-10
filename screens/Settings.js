import { SafeAreaView, View, Text, Button } from "react-native";
import React, { useState, useEffect } from "react";
import { colors } from "../colors";

export default function Settings({ navigation }) {
  return (
    <SafeAreaView
      style={{ backgroundColor: colors.primary_color, height: "100%" }}
    >
      <Text
        style={{
          textAlign: "center",
          marginTop: "50%",
        }}
      >
        Settings
      </Text>
    </SafeAreaView>
  );
}
