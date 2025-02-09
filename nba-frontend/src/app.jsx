import { Routes, Route } from "react-router-dom";
import { useState } from "react";
import "./index.css";
import Header from "./components/Header.jsx";
import Sidemenu from "./components/Sidemenu.jsx";
import Home from "./pages/Home.jsx";
import Teams from "./pages/Teams.jsx";
import Teamfilter from "./pages/Teamfilter.jsx";
import PlayersList from "./pages/PlayersList.jsx";
import Player from "./pages/Player.jsx";
import PlayerStats from "./pages/PlayerStats.jsx";
import DashboardPlayer from "./pages/DashboardPlayer.jsx";

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
          <Route path="/players/:teamId" element={<PlayersList />} />
          <Route path="/player/:playerId/:teamAbbreviation" element={<Player />} />
          <Route path="/playerstats/:playerId/:teamAbbreviation" element={<PlayerStats />} />
          <Route path="/dashboard/:playerId/:teamAbbreviation" element={<DashboardPlayer />} />
        </Routes>
      </main>
    </div>
  );
}
