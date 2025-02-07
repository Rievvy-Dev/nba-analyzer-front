import { Routes, Route } from "react-router-dom";
import { useState } from "react";
import "./index.css";
import Header from "./components/header.jsx";
import Sidemenu from "./components/Sidemenu.jsx";
import Home from "./pages/Home.jsx";
import Teams from "./pages/Teams.jsx";
import Teamfilter from "./pages/Teamfilter.jsx";

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className={`app-container ${isMenuOpen ? "menu-open" : ""}`}>
      <Header onMenuClick={() => setIsMenuOpen(true)} />
      <Sidemenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/teams" element={<Teams />} />
          <Route path="/teamsfilter" element={<Teamfilter />} />
        </Routes>
      </main>
    </div>
  );
}
