import { createContext, useState, useEffect } from "react";
import jwt_decode from "jwt-decode";
import slugify from "./node_modules/slugify";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AuthContext = createContext();
export default AuthContext;

export const AuthProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);

  let [authTokens, setAuthTokens] = useState(async () =>
    AsyncStorage.getItem("authTokens")
      ? await JSON.parse(await AsyncStorage.getItem("authTokens"))
      : null
  );

  let [user, setUser] = useState(async () =>
    AsyncStorage.getItem("user") ? await AsyncStorage.getItem("user") : null
  );

  let loginUser = async (username1, password1) => {
    let response = await fetch("http://192.168.0.11:19002/api/token/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username1,
        password: password1,
      }),
    });
    if (response.status === 200) {
      let data = await response.json();
      setAuthTokens(data);
      setUser(jwt_decode(data.access));
      AsyncStorage.setItem("authTokens", JSON.stringify(data));
      AsyncStorage.setItem("user", JSON.stringify(jwt_decode(data.access)));
      return "True";
    }
  };

  // let logoutUser = () => {
  //   setAuthTokens(null);
  //   setUser(null);
  //   AsyncStorage.removeItem("authTokens");
  //   alert("Logged Out");
  //   console.log(user);
  //   console.log(authTokens);
  // };

  let updateToken = async () => {
    let response = await fetch("http://192.168.0.11:19002/api/token/refresh/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refresh: authTokens?.refresh }),
    });

    let data = await response.json();

    if (response.status === 200) {
      setAuthTokens(data);
      setUser(jwt_decode(data.access));
      AsyncStorage.setItem("authTokens", JSON.stringify(data));
    } else {
      // logoutUser();
    }

    if (loading) {
      setLoading(false);
    }
  };

  let registerUser = async (e) => {
    e.preventDefault();

    let response = await fetch("http://192.168.0.11:19002/api/kayit-ol/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: e.target.username.value,
        email: e.target.email.value,
        password: e.target.password.value,
        username_slug: slugify(e.target.username.value),
      }),
    });
    if (response.status === 200) {
      // navigate("/giris/");
    } else {
      let data = await response.json();
      if (data === "Bu kullanıcı adı mevcut.") {
        let alert = document.querySelector(".giris-alert-1");
        alert.innerHTML = "Bu kullanıcı adı mevcut.";
        alert.classList.remove("display-none");
        alert.classList.add("giris-alert");
        alert.classList.add("display-block");
        setTimeout(() => {
          alert.classList.remove("display-block");
          alert.classList.add("display-none");
          alert.classList.remove("giris-alert");
        }, 5000);
      }
    }
  };

  useEffect(() => {
    if (loading) {
      updateToken();
    }

    let fourMinutes = 1000 * 60 * 4;

    let interval = setInterval(() => {
      if (authTokens) {
        updateToken();
      }
    }, fourMinutes);

    return () => clearInterval(interval);
  }, [authTokens, loading]);

  let contextData = {
    user: user,
    authTokens: authTokens,
    loginUser: loginUser,
    // logoutUser: logoutUser,
    registerUser: registerUser,
  };

  return (
    <AuthContext.Provider value={contextData}>{children}</AuthContext.Provider>
  );
};
