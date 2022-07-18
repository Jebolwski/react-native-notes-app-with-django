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
  Image,
  Animated,
  LayoutAnimation,
  ScrollView,
} from "react-native";
import AuthContext from "../AuthContext";
import { Ionicons } from "@expo/vector-icons";

export default function Home({ navigation }) {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState();
  let { user } = useContext(AuthContext);

  const layoutconfig = {
    duration: 300,
    update: {
      type: LayoutAnimation.Types.easeInEaseOut,
      property: LayoutAnimation.Properties.opacity,
    },
    delete: {
      duration: 100,
      type: LayoutAnimation.Types.easeInEaseOut,
      property: LayoutAnimation.Properties.opacity,
    },
  };

  let scrollRef = useRef();
  let textAddRef = useRef();

  const profileGel = async () => {
    let response = await fetch(
      `http://192.168.8.134:19002/api/profile/${user.user_id}/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (response.status === 200) {
      let data = await response.json();
      setProfile(data);
    }
  };

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
        LayoutAnimation.configureNext(layoutconfig);
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
      let data = notes.filter(function (item) {
        return item.id !== note_id;
      });
      setNotes(data);
      LayoutAnimation.configureNext(layoutconfig);
    }
  };
  useEffect(() => {
    profileGel();
    notesGel();
    setLoading(false);
  }, []);
  BackHandler.addEventListener("hardwareBackPress", function () {
    return true;
  });
  if (loading) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  } else {
    return (
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView behavior="padding">
          <View>
            <Ionicons
              name="person-circle"
              size={40}
              style={styles.settings_icon}
              onPress={() => {
                navigation.navigate("Profile", {
                  id: user.user_id,
                  username: user.username,
                  email: user.email,
                });
              }}
            />
            <Ionicons
              name="settings"
              size={38}
              style={styles.person_icon}
              onPress={() => {
                navigation.navigate("Settings", {
                  id: user.user_id,
                  username: user.username,
                  email: user.email,
                });
              }}
            />
            {profile && profile.profilePhoto ? (
              <Image
                style={{ width: 60, height: 60, borderRadius: 30 }}
                source={{
                  uri: `http://192.168.8.134:19002/api/${profile.profilePhoto}/`,
                }}
              ></Image>
            ) : (
              <Image
                source={{
                  uri: `https://fiverr-res.cloudinary.com/images/t_main1,q_auto,f_auto,q_auto,f_auto/gigs/142819271/original/09dafa4104fa6aeca4e62f33326be4933ae7ccac/create-cartoon-profile-picture-abd7.jpg`,
                }}
              ></Image>
            )}
            <Text style={styles.note}>Your Notes</Text>
            {/* <FlatList
            style={styles.scroll_div_parent}
            data={notes}
            keyExtractor={(item) => {
              item.id;
            }}
            ref={scrollRef}
            renderItem={({ item }) => ScrollDiv(item)}
          /> */}
            <ScrollView style={styles.scroll_div_parent} ref={scrollRef}>
              {notes.map((note) => (
                <Animated.View key={note.id} style={styles.scroll_div}>
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
                    <Text style={{ fontSize: 16, marginLeft: 10 }}>
                      {note.title}
                    </Text>
                    {note.star == 0 ? (
                      <Ionicons
                        name="star-outline"
                        color={"#bd7a3c"}
                        size={22}
                        style={styles.star}
                        onPress={() => {
                          noteStar("1", note.id);
                        }}
                      />
                    ) : (
                      <Ionicons
                        name="star"
                        color={"#bdb83c"}
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
                        onPress={(e) => {
                          removeNote(note.id);
                        }}
                      />
                    </View>
                  </View>
                </Animated.View>
              ))}
            </ScrollView>

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
    marginTop: "5%",
    height: "68%",
  },
  person_icon: {
    position: "absolute",
    right: 50,
    top: 82,
    zIndex: 2,
  },
  settings_icon: {
    position: "absolute",
    right: 105,
    top: 82,
    zIndex: 2,
  },
  note_input: {
    backgroundColor: colors.icon_color,
    width: "70%",
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
    position: "absolute",
    bottom: "-18%",
    display: "flex",
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
  },
});
