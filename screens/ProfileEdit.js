import { View, Text, Image, StyleSheet, Button } from "react-native";
import React, { useEffect, useState, useContext } from "react";
import { colors } from "../colors";
import AuthContext from "../AuthContext";
import * as ImagePicker from "expo-image-picker";

const ProfileEdit = ({ navigation }) => {
  const { user } = useContext(AuthContext);
  const [profile, setProfile] = useState();
  const [loading, setLoading] = useState(true);
  const [image, setImage] = useState();
  const [result, setResult] = useState([]);
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
    formdata.append("photo", {
      name: new Date() + "_profile",
      uri: image,
      type: "image/jpg",
    });
    var requestOptions = {
      method: "PUT",
      body: formdata,
      credentials: "same-origin",
      redirect: "follow",
    };
    fetch(
      `http://192.168.8.134:19002/api/profile/${user.user_id}/edit/`,
      requestOptions
    )
      .then((response) => response.text())
      .then(() => {
        navigation.navigate("Home");
      })
      .catch((error) => console.log("error", error));
  };

  useEffect(() => {
    profileGel();
  }, []);
  if (loading) {
    return <Text>Loading...</Text>;
  } else {
    return (
      <View>
        {profile.profilePhoto ? (
          <Image
            style={{ width: 60, height: 60, borderRadius: 30 }}
            source={{
              uri: `http://192.168.8.134:19002/api/${profile.profilePhoto}/`,
            }}
          ></Image>
        ) : (
          <Image
            style={{
              width: 60,
              height: 60,
              borderRadius: 30,
            }}
            source={{
              uri: "https://pbs.twimg.com/media/DmNX8VyXcAElz_W.jpg",
            }}
          ></Image>
        )}
        <Image source={{ uri: image }} style={{ width: 100, height: 100 }} />
        <View style={styles.uploadDiv}>
          <Button title="Upload" onPress={pickImage} color={"black"}></Button>
        </View>
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
  },
});
