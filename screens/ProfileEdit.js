import { View, Text, Image, StyleSheet, Button, TextInput } from "react-native";
import React, { useEffect, useState, useContext } from "react";
import { colors } from "../colors";
import AuthContext from "../AuthContext";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
const ProfileEdit = ({ navigation }) => {
  const { user } = useContext(AuthContext);
  const [profile, setProfile] = useState();
  const [loading, setLoading] = useState(true);
  const [image, setImage] = useState();
  const [bio, setBio] = useState();
  const [result, setResult] = useState([]);
  const profileGel = async () => {
    let response = await fetch(
      `http://192.168.0.11:19002/api/profile/${user.user_id}/`,
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
      setLoading(false);
    }
  };
  const options = {
    title: "Select Image",
    type: "library",
    options: {
      maxHeight: 200,
      maxWidth: 200,
      selectionLimit: 0,
      mediaType: "photo",
      includeBase64: false,
    },
  };
  const upload = async () => {
    const result = await launchCamera(options);
    console.log(result);
  };
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    setResult(result);

    var formdata = new FormData();
    formdata.append("photo", result.uri);

    if (!result.cancelled) {
      setImage(result.uri);
    }
  };
  let duzenle = async (e) => {
    e.preventDefault();
    var formdata = new FormData();
    if (image != null) {
      formdata.append("photo", {
        name: new Date() + "_profile",
        uri: image,
        type: "image/jpg",
      });
    }

    formdata.append("bio", bio == undefined ? profile.bio : bio);
    var requestOptions = {
      method: "PUT",
      body: formdata,
      credentials: "same-origin",
    };
    let response = await fetch(
      `http://192.168.0.11:19002/api/profile/${user.user_id}/edit/`,
      requestOptions
    );
    console.log(response.status);
    if (response.status === 200) {
      navigation.navigate("Home");
    }
    // .then((response) => console.log(response.text()))
    // .then(() => {
    //   navigation.navigate("Home");
    // })
    // .catch((error) => console.log("error", error));
  };
  useEffect(() => {
    profileGel();
  }, []);

  if (loading) {
    return (
      <View
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text>Loading...</Text>
      </View>
    );
  } else {
    return (
      <View>
        <Text style={{ marginTop: 30, textAlign: "center" }}>Your Bio</Text>
        <TextInput
          style={styles.note_input}
          defaultValue={profile.bio}
          onChangeText={(text) => setBio(text)}
        ></TextInput>
        <Text style={{ marginTop: 45, textAlign: "center" }}>
          Your Profile Picture
        </Text>

        {image ? (
          <View style={styles.profilePic}>
            <Image
              source={{
                uri: image,
              }}
              style={{ width: "100%", height: "100%", borderRadius: 13 }}
            />
            <Ionicons
              name="image"
              size={30}
              style={styles.camera}
              onPress={pickImage}
            />
            <Ionicons
              name="trash-outline"
              size={30}
              style={styles.trash}
              onPress={() => {
                setImage();
              }}
            />
          </View>
        ) : (
          <View style={styles.profilePic}>
            <Image
              source={{
                uri: `http://192.168.0.11:19002/api/${profile.profilePhoto}/`,
              }}
              style={{ width: "100%", height: "100%", borderRadius: 13 }}
            />
            <Ionicons
              name="image"
              size={30}
              style={styles.camera}
              onPress={pickImage}
            />
            <Ionicons
              name="trash-outline"
              size={30}
              style={styles.trash}
              onPress={() => {
                setImage();
                alert(image);
              }}
            />
          </View>
        )}

        <View style={styles.uploadDiv}>
          <Button
            title="Edit Profile"
            color={"gray"}
            onPress={duzenle}
          ></Button>
        </View>
      </View>
    );
  }
};

export default ProfileEdit;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.primary_color,
    flex: 1,
  },
  uploadDiv: {
    width: "30%",
    marginLeft: "35%",
    marginTop: 10,
  },
  camera: {
    right: 5,
    top: 5,
    color: "white",
    zIndex: 2,
    position: "absolute",
  },
  trash: {
    right: 5,
    bottom: 5,
    zIndex: 2,
    position: "absolute",
    color: "white",
  },
  note_input: {
    backgroundColor: colors.icon_color,
    width: "70%",
    marginLeft: "15%",
    position: "relative",
    marginTop: 20,
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
  profilePic: {
    width: "50%",
    height: "35%",
    borderWidth: 1,
    marginTop: 15,
    marginLeft: "25%",
    borderColor: "gray",
    borderRadius: 15,
  },
});
