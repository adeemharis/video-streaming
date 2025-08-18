import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";
import Navbar from "./components/Navbar.jsx";
import Home from "./pages/Home.jsx";
import Upload from "./pages/Upload.jsx";
import Profile from "./pages/Profile.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";

export default function App() {
  const [showAuthModal, setShowAuthModal] = useState(false);

  return (
    <AuthProvider>
      <Router>
        {/* Navbar with login modal trigger */}
        <Navbar onLoginClick={() => setShowAuthModal(true)} />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>

        {/* Auth Modal */}
        {showAuthModal && (
          <div className="modal-overlay" onClick={() => setShowAuthModal(false)}>
            <div
              className="modal"
              onClick={(e) => e.stopPropagation()} // prevent closing on inner click
            >
              <button
                className="close-btn"
                onClick={() => setShowAuthModal(false)}
              >
                ✖
              </button>
              <h2>Login / Signup</h2>
              {/* 👉 Replace with your actual login/signup form component */}
              <p>Here goes your login & signup form...</p>
            </div>
          </div>
        )}
      </Router>
    </AuthProvider>
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
