import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "./context/AuthContext.jsx";
import Navbar from "./components/Navbar.jsx";
import AuthModal from "./components/AuthModal.jsx";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import Profile from "./pages/Profile.jsx";
import SearchResults from "./pages/SearchResults.jsx";
import Tag from "./pages/Tag.jsx";
import ProtectedRoute from "./routes/ProtectedRoute.jsx";
import UploadPage from "./pages/UploadPage";
import VideoPlayer from "./pages/VideoPlayer";

export default function App() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { login, signup } = useAuth();
  const nav = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  // 🔹 Handle login from modal
  const handleLogin = async (form) => {
    try {
      await login(form.email, form.password); // use AuthContext login
      setShowAuthModal(false);
      nav(from, { replace: true });
    } catch (err) {
      alert(err?.response?.data?.message || "Login failed");
    }
  };

  // 🔹 Handle signup from modal
  const handleSignup = async (form) => {
    try {
      await signup(form.username, form.email, form.password); // use AuthContext signup
      setShowAuthModal(false);
      nav(from, { replace: true });
    } catch (err) {
      alert(err?.response?.data?.message || "Signup failed");
    }
  };

  return (
    <>
      <Navbar onOpenAuthModal={() => setShowAuthModal(true)} />
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onLogin={handleLogin}
        onSignup={handleSignup}
      />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/tag/:name" element={<Tag />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/profile" element={<Profile />} />
        </Route>

        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route path="/upload" element={<UploadPage />} />
        <Route path="/video/:id" element={<VideoPlayer />} />

        <Route path="/search/:q" element={<SearchResults />} />
        <Route path="/tag/:tag" element={<SearchResults />} />
      </Routes>
    </>
  );
}


// import { Routes, Route } from "react-router-dom";
// import { useState } from "react";
// import Navbar from "./components/Navbar.jsx";
// import AuthModal from "./components/AuthModal.jsx";
// import Home from "./pages/Home.jsx";
// import Login from "./pages/Login.jsx";
// import Signup from "./pages/Signup.jsx";
// import Profile from "./pages/Profile.jsx";
// import SearchResults from "./pages/SearchResults.jsx";
// import Tag from "./pages/Tag.jsx";
// import ProtectedRoute from "./routes/ProtectedRoute.jsx";
// import UploadPage from "./pages/UploadPage";
// import VideoPlayer from "./pages/VideoPlayer";

// export default function App() {
//   const [showAuthModal, setShowAuthModal] = useState(false);

//   const handleLogin = (form) => {
//     console.log("Login with", form);
//     setShowAuthModal(false);
//   };

//   const handleSignup = (form) => {
//     console.log("Signup with", form);
//     setShowAuthModal(false);
//   };

//   return (
//     <>
//       <Navbar onOpenAuthModal={() => setShowAuthModal(true)} />
//       <AuthModal
//         isOpen={showAuthModal}
//         onClose={() => setShowAuthModal(false)}
//         onLogin={handleLogin}
//         onSignup={handleSignup}
//       />
//       <Routes>
//         <Route path="/" element={<Home />} />
//         <Route path="/search" element={<SearchResults />} />
//         <Route path="/tag/:name" element={<Tag />} />

//         <Route element={<ProtectedRoute />}>
//           <Route path="/profile" element={<Profile />} />
//         </Route>

//         <Route path="/login" element={<Login />} />
//         <Route path="/signup" element={<Signup />} />

//         <Route path="/upload" element={<UploadPage />} />
//         <Route path="/video/:id" element={<VideoPlayer />} />

//         <Route path="/search/:q" element={<SearchResults />} />
//         <Route path="/tag/:tag" element={<SearchResults />} />
//       </Routes>

//       {/* {showAuthModal && (
//         <AuthModal onClose={() => setShowAuthModal(false)} />
//       )} */}
//     </>
//   );
// }


// import { Routes, Route } from "react-router-dom";
// import Navbar from "./components/Navbar.jsx";
// import AuthModal from "./components/AuthModal.jsx";
// import Home from "./pages/Home.jsx";
// import Login from "./pages/Login.jsx";
// import Signup from "./pages/Signup.jsx";
// import Profile from "./pages/Profile.jsx";
// import SearchResults from "./pages/SearchResults.jsx";
// import Tag from "./pages/Tag.jsx";
// import ProtectedRoute from "./routes/ProtectedRoute.jsx";
// import UploadPage from "./pages/UploadPage";
// import VideoPlayer from "./pages/VideoPlayer";

// export default function App() {
//   return (
//     <>
//       <Navbar />
//       <Routes>
//         <Route path="/" element={<Home />} />
//         <Route path="/search" element={<SearchResults />} />
//         <Route path="/tag/:name" element={<Tag />} />

//         <Route element={<ProtectedRoute />}>
//           <Route path="/profile" element={<Profile />} />
//         </Route>

//         <Route path="/login" element={<Login />} />
//         <Route path="/signup" element={<Signup />} />

//         <Route path="/upload" element={<UploadPage />} /> 
//         <Route path="/video/:id" element={<VideoPlayer />} />

//         <Route path="/search/:q" element={<SearchResults />} />
//         <Route path="/tag/:tag" element={<SearchResults />} />
//       </Routes>
//     </>
//   );
// }
