import { View, Text, Image, StyleSheet } from "react-native";
import React, { useEffect, useState, useContext } from "react";
import { colors } from "../colors";
import AuthContext from "../AuthContext";

const ProfileEdit = ({ navigation }) => {
  const { user } = useContext(AuthContext);
  const [profile, setProfile] = useState();
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
  console.log(profile);
  useEffect(() => {
    profileGel();
  }, []);
  return (
    <View>
      <Text>{profile.bio}</Text>
      {profile.profilePhoto ? (
        <Image
          style={{ width: 60, height: 60, borderRadius: 30 }}
          source={{
            uri: `http://192.168.8.134:19002/api/${profile.profilePhoto}/`,
          }}
        ></Image>
      ) : (
        <Image
          style={{ width: 60, height: 70 }}
          source={{
            uri: "https://img.a.transfermarkt.technology/portrait/big/28003-1631171950.jpg?lm=1",
          }}
        ></Image>
      )}
    </View>
  );
};

export default ProfileEdit;
