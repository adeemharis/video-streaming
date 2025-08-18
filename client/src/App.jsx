import { Routes, Route } from "react-router-dom";
import { useState } from "react";
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

  return (
    <>
      <Navbar onLoginClick={() => setShowAuthModal(true)} />

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

      {showAuthModal && (
        <AuthModal onClose={() => setShowAuthModal(false)} />
      )}
    </>
  );
}


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
