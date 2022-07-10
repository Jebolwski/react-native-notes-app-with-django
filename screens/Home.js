import React, { useContext } from "react";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { colors } from "../colors";
import {
  StyleSheet,
  SafeAreaView,
  Text,
  View,
  ScrollView,
  TextInput,
} from "react-native";
import AuthContext from "../AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

export default function Home() {
  const [notes, setNotes] = useState([]);
  let { user } = useContext(AuthContext);

  const notesGel = async () => {
    let response = await fetch("http://192.168.0.11:19002/api/notes/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: user.user_id,
      }),
    });
    if (response.status === 200) {
      let data = await response.json();
      setNotes(data);
    }
  };

  useEffect(() => {
    notesGel();
  }, []);

  const navigation = useNavigation();
  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Ionicons
          name="person-circle"
          size={40}
          style={styles.person_icon}
          onPress={() => {
            navigation.navigate("Profile", user.user_id);
          }}
        />
        <Text style={styles.note}>Your Notes</Text>
        <Ionicons
          onPress={() => {
            console.log("sad");
          }}
          name="add-circle"
          style={styles.icon}
          color={colors.icon_color}
          size={62}
        />
        <TextInput
          placeholder="Enter your note..."
          style={styles.note_input}
        ></TextInput>
        <ScrollView>
          {notes.map((note) => (
            <View key={note.id} style={styles.scroll_div}>
              <Text>{note.title}</Text>
              <Text>{note.create_date}</Text>
              <Text>{note.edit_date}</Text>
            </View>
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.primary_color,
    flex: 1,
  },
  note: {
    fontWeight: "600",
    fontSize: 22,
    textAlign: "left",
    paddingTop: 90,
    paddingLeft: 32,
  },
  icon: {
    position: "relative",
    left: "82%",
    top: 520,
    zIndex: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 0.45,
    shadowRadius: 3.84,

    elevation: 5,
  },
  scroll_div: {
    width: "80%",
    marginLeft: "10%",
    marginBottom: 20,
    padding: 20,
    borderRadius: 20,
    backgroundColor: "rgba(198,196,199,0.3)",
  },
  scroll_div_parent: {
    display: "flex",
    flexDirection: "row",
  },
  person_icon: {
    position: "absolute",
    right: 50,
    top: 50,
  },
  note_input: {
    backgroundColor: colors.icon_color,
    width: "60%",
    marginLeft: "8%",
    position: "absolute",
    top: 654,
    zIndex: 2,
    height: 41,
    borderRadius: 20,
    paddingLeft: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 0.45,
    shadowRadius: 3.84,

    elevation: 5,
  },
});
