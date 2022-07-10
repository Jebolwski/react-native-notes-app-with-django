import {
  SafeAreaView,
  Text,
  View,
  TextInput,
  StyleSheet,
  Button,
} from "react-native";
import React, { useContext, useState } from "react";
import AuthContext from "../AuthContext";
import { colors } from "../colors";

export default function Login({ navigation }) {
  let [username, setUsername] = useState();
  let [password, setPassword] = useState();
  let { loginUser } = useContext(AuthContext);
  return (
    <SafeAreaView
      style={{ backgroundColor: colors.primary_color, height: "100%" }}
    >
      <View style={styles.c1}></View>
      <View style={styles.c2}></View>
      <View style={styles.c3}></View>
      <View style={styles.c4}></View>
      <TextInput
        placeholder="Username"
        style={styles.input}
        name={"username"}
        onChangeText={(newText) => setUsername(newText)}
      />
      <TextInput
        placeholder="Password"
        style={styles.input1}
        secureTextEntry={true}
        name={"password"}
        onChangeText={(newText) => setPassword(newText)}
      />
      <View style={{ width: "40%", marginLeft: "30%" }}>
        <Button
          title="Login"
          style={styles.button}
          color={colors.dark_primary_color}
          onPress={async () => {
            let a = await loginUser(username, password);
            if (a == "True") {
              navigation.navigate("Home");
            }
          }}
        />
      </View>
      <Text
        style={{
          textAlign: "center",
          marginTop: 30,
          color: "white",
          fontSize: 16,
        }}
      >
        Dont have an account ? Register
      </Text>
      <Text
        style={{
          textAlign: "center",
          marginTop: 20,
          color: "white",
          fontSize: 15,
        }}
      >
        Forgot your password ? Reset
      </Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  input: {
    width: "60%",
    height: 40,
    backgroundColor: "white",
    marginLeft: "20%",
    marginTop: "28%",
    borderColor: "gray",
    borderWidth: 2,
    borderRadius: 6,
    paddingLeft: 10,
  },
  input1: {
    width: "60%",
    height: 40,
    backgroundColor: "white",
    marginLeft: "20%",
    marginTop: "15%",
    marginBottom: "15%",
    borderColor: "gray",
    borderWidth: 2,
    borderRadius: 6,
    paddingLeft: 10,
  },
  button: {
    margin: 50,
    width: "50%",
  },
  c1: {
    position: "absolute",
    width: 80,
    height: 80,
    borderRadius: 40,
    top: "42%",
    left: "-2%",
    backgroundColor: "rgba(118,146,179,0.3)",
  },
  c2: {
    position: "absolute",
    width: 100,
    height: 100,
    borderRadius: 50,
    top: "22%",
    left: "80%",
    backgroundColor: "rgba(118,136,179,0.3)",
  },
  c3: {
    position: "absolute",
    width: 120,
    height: 120,
    borderRadius: 60,
    top: "62%",
    left: "80%",
    backgroundColor: "rgba(148,118,179,0.3)",
  },
  c4: {
    position: "absolute",
    width: 60,
    height: 60,
    borderRadius: 30,
    top: "52%",
    left: "40%",
    backgroundColor: "rgba(148,168,179,0.4)",
  },
});
