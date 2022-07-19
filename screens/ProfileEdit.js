import { View, Text, Image, StyleSheet, Button } from "react-native";
import React, { useEffect, useState, useContext } from "react";
import { colors } from "../colors";
import AuthContext from "../AuthContext";
import { launchImageLibrary } from "react-native-image-picker";

const ProfileEdit = ({ navigation }) => {
  const { user } = useContext(AuthContext);
  const [profile, setProfile] = useState();
  const [loading, setLoading] = useState(true);
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
    const result = await launchImageLibrary(options);
    console.log(result);
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
        <Text>Profile Picture</Text>
        <View style={styles.uploadDiv}>
          <Button title="Upload" onPress={upload}></Button>
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
