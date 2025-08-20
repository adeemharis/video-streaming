import { createContext, useContext, useEffect, useState } from "react";
import { api } from "../api/axios";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // load session if any
  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get("/auth/me", { withCredentials: true });
        setUser(data.user);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const login = async (emailOrUsername, password) => {
    const { data } = await api.post(
      "/auth/login",
      { emailOrUsername, password },
      { withCredentials: true }
    );
    setUser(data.user);
    return data.user;
  };

  const signup = async (username, email, password) => {
    const { data } = await api.post(
      "/auth/signup",
      { username, email, password },
      { withCredentials: true }
    );
    setUser(data.user);
    return data.user;
  };

  const logout = async () => {
    await api.post("/auth/logout", {}, { withCredentials: true });
    setUser(null);
  };

  // 🔹 Upload Profile Image
  const uploadProfileImage = async (file) => {
    const formData = new FormData();
    formData.append("profileImage", file);

    const { data } = await api.post("/users/profile/image", formData, {
      withCredentials: true,
      headers: { "Content-Type": "multipart/form-data" },
    });

    setUser((prev) => ({ ...prev, profileImage: data.profileImage }));
    return data.profileImage;
  };

  // 🔹 Change Password
  const changePassword = async (currentPassword, newPassword) => {
    await api.post(
      "/users/change-password",
      { currentPassword, newPassword },
      { withCredentials: true }
    );
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        login,
        signup,
        logout,
        uploadProfileImage,
        changePassword,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

// import { createContext, useContext, useEffect, useState } from "react";
// import { api } from "../api/axios";

// const AuthContext = createContext(null);

// export function AuthProvider({ children }) {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   // load session if any
//   useEffect(() => {
//     (async () => {
//       try {
//         const { data } = await api.get("/auth/me");
//         setUser(data.user);
//       } catch {
//         setUser(null);
//       } finally {
//         setLoading(false);
//       }
//     })();
//   }, []);

//   const login = async (emailOrUsername, password) => {
//     const { data } = await api.post("/auth/login", { emailOrUsername, password });
//     setUser(data.user);
//     return data.user;
//   };

//   const signup = async (username, email, password) => {
//     const { data } = await api.post("/auth/signup", { username, email, password });
//     setUser(data.user);
//     return data.user;
//   };

//   const logout = async () => {
//     await api.post("/auth/logout");
//     setUser(null);
//   };

//   return (
//     <AuthContext.Provider value={{ user, setUser, login, signup, logout, loading }}>
//       {children}
//     </AuthContext.Provider>
//   );
// }

// export const useAuth = () => useContext(AuthContext);
