import { View, Text, StyleSheet, ScrollView } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { colors } from "../colors";
import { Ionicons } from "@expo/vector-icons";
import AuthContext from "../AuthContext";

const Profile = ({ route, navigation }) => {
  const [notes, setNotes] = useState([]);
  const [notesFive, setNotesFive] = useState([]);
  let { user } = useContext(AuthContext);
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
  const notesFiveGel = async () => {
    let response = await fetch("http://192.168.8.134:19002/api/notes-five/", {
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
      setNotesFive(data);
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
    console.log(response.status);
    if (response.status === 200) {
      notesGel();
    } else {
      alert("an error accured.");
    }
  };

  useEffect(() => {
    notesGel();
    notesFiveGel();
  }, []);
  return (
    <View style={styles.container}>
      <View style={styles.top}>
        <Ionicons name="person" size={38} />
        <Text
          style={{
            fontSize: 20,
            fontWeight: "600",
            marginTop: 5,
            marginLeft: 24,
          }}
        >
          {route.params.username}
        </Text>
        <Ionicons
          name="pencil"
          size={24}
          style={{ marginTop: 6, marginLeft: 30 }}
          onPress={() => {
            navigation.navigate("ProfileEdit");
          }}
        />
      </View>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          marginTop: 40,
        }}
      >
        <Ionicons
          name="document-text-outline"
          size={38}
          style={{ marginLeft: 35 }}
        />
        <Text
          style={{
            marginLeft: 20,
            fontWeight: "600",
            fontSize: 20,
            marginTop: 4,
          }}
        >
          Favorite Notes
        </Text>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.horizontal}
      >
        {notesFive.map((note) => (
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
        ))}
      </ScrollView>
      <ScrollView style={{ width: "78%", marginLeft: "11%", marginTop: 10 }}>
        {notes.map((note) => (
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
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.primary_color,
    flex: 1,
  },
  top: {
    display: "flex",
    flexDirection: "row",
    marginLeft: 40,
    marginTop: 20,
  },
  horizontal: {
    marginTop: 30,
    height: 400,
  },
  box: {
    marginLeft: 20,
    borderColor: "gray",
    borderWidth: 2,
    borderRadius: 14,
    backgroundColor: "#efefef",
    padding: 10,
    width: 220,
    marginTop: 40,
    height: 140,
  },
  scroll_div: {
    height: 140,
    marginBottom: 20,
    width: 250,
    marginLeft: 40,
    padding: 20,
    borderRadius: 20,
    backgroundColor: "rgba(198,196,199,0.3)",
    borderWidth: 2,
    borderColor: colors.dark_primary_color,
  },
  scroll_div_parent: {},
});

export default Profile;
