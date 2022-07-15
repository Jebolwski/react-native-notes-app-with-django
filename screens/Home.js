import React, { useContext, useRef, useEffect, useState } from "react";
import { colors } from "../colors";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  BackHandler,
  KeyboardAvoidingView,
  SafeAreaView,
  FlatList,
} from "react-native";
import AuthContext from "../AuthContext";
import { Ionicons } from "@expo/vector-icons";

export default function Home({ navigation }) {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState();
  let { user } = useContext(AuthContext);

  let scrollRef = useRef();
  let textAddRef = useRef();
  const notesGel = async () => {
    let response = await fetch("http://192.168.8.134:19002/api/notes/", {
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
  const addNote = async () => {
    if (title == "" || title == undefined || title == null) {
      alert("Enter something to add a note.");
    } else {
      let response = await fetch("http://192.168.8.134:19002/api/add-note/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: user.user_id,
          title: title,
        }),
      });
      if (response.status === 200) {
        let data = await response.json();
        setNotes([data, ...notes]);
        setTitle("");
        textAddRef.current.clear();
        scrollRef.current.scrollToOffset({ offset: 0, animated: true });
      }
    }
  };
  const noteStatus = async (number, NoteId) => {
    let response = await fetch("http://192.168.8.134:19002/api/note-status/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        note_id: NoteId,
        note_status: number,
      }),
    });
    if (response.status === 200) {
      notesGel();
    } else {
      alert("an error accured.");
    }
  };
  const ScrollDiv = (note) => {
    return (
      <View key={note.id} style={styles.scroll_div}>
        <View style={{ display: "flex", flexDirection: "row" }}>
          {note.status == 0 ? (
            <Ionicons
              name="radio-button-off"
              size={23}
              onPress={() => {
                noteStatus("1", note.id);
              }}
            />
          ) : (
            <Ionicons
              name="radio-button-on"
              size={23}
              onPress={() => {
                noteStatus("0", note.id);
              }}
            />
          )}
          <Text style={{ fontSize: 16, marginLeft: 10 }}>{note.title}</Text>
        </View>
      </View>
    );
  };
  useEffect(() => {
    notesGel();
  }, []);
  BackHandler.addEventListener("hardwareBackPress", function () {
    return true;
  });
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior="position">
        <View>
          <Ionicons
            name="person-circle"
            size={40}
            style={styles.person_icon}
            onPress={() => {
              navigation.navigate("Profile", {
                id: user.user_id,
                username: user.username,
                email: user.email,
              });
            }}
          />
          <Text style={styles.note}>Your Notes</Text>
          <FlatList
            style={styles.scroll_div_parent}
            data={notes}
            keyExtractor={(item) => {
              item.id;
            }}
            ref={scrollRef}
            renderItem={({ item }) => ScrollDiv(item)}
          />
          <TextInput
            placeholder="Enter your note..."
            style={styles.note_input}
            onChangeText={(text) => setTitle(text)}
            ref={textAddRef}
          ></TextInput>
          <Ionicons
            onPress={addNote}
            name="add-circle"
            style={styles.icon}
            color={colors.icon_color_2}
            size={62}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.primary_color,
  },
  note: {
    fontWeight: "600",
    fontSize: 22,
    textAlign: "left",
    paddingTop: 90,
    paddingBottom: 20,
    paddingLeft: 32,
  },
  icon: {
    position: "relative",
    left: "79%",
    bottom: "7%",
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
    borderWidth: 2,
    borderColor: colors.dark_primary_color,
  },
  scroll_div_parent: {
    height: "66%",
  },
  person_icon: {
    position: "absolute",
    right: 50,
    top: 79,
    zIndex: 2,
  },
  note_input: {
    backgroundColor: colors.icon_color,
    width: "60%",
    marginLeft: "8%",
    marginTop: "3.5%",
    position: "relative",
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
