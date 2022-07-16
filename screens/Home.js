import React, { useContext, useRef, useEffect, useState } from "react";
import { colors } from "../colors";
import {
  StyleSheet,
  Text,
  View,
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
  const noteStar = async (number, NoteId) => {
    let response = await fetch("http://192.168.8.134:19002/api/note-star/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        note_id: NoteId,
        note_star: number,
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
          {note.star == 0 ? (
            <Ionicons
              name="star-outline"
              color={"orange"}
              size={22}
              style={styles.star}
              onPress={() => {
                noteStar("1", note.id);
              }}
            />
          ) : (
            <Ionicons
              name="star"
              color={"yellow"}
              size={22}
              style={styles.star}
              onPress={() => {
                noteStar("0", note.id);
              }}
            />
          )}

          <View
            style={{
              position: "absolute",
              backgroundColor: "red",
              height: 67,
              top: -21,
              width: 40,
              borderTopRightRadius: 20,
              borderBottomRightRadius: 20,
              right: -21,
            }}
          >
            <Ionicons
              name="trash"
              size={22}
              color="white"
              style={{ marginLeft: 10, marginTop: 20 }}
              onPress={() => {
                removeNote(note.id);
              }}
            />
          </View>
        </View>
      </View>
    );
  };

  const removeNote = async (note_id) => {
    let response = await fetch(
      `http://192.168.8.134:19002/api/note/${note_id}/remove/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (response.status === 200) {
      notesGel();
    }
  };
  useEffect(() => {
    notesGel();
  }, []);
  BackHandler.addEventListener("hardwareBackPress", function () {
    return true;
  });
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior="padding">
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
          <View style={styles.div_1}>
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
        </View>
      </KeyboardAvoidingView>
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
    paddingBottom: 20,
    paddingLeft: 32,
  },
  icon: {
    bottom: 12,
  },
  star: {
    position: "absolute",
    right: 35,
    zIndex: 10,
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
  div_1: {
    marginTop: "8%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
  },
});
