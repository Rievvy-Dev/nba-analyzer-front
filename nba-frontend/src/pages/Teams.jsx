import { useEffect, useState } from "react";
import { getStandings } from "../../api";
import { useNavigate } from "react-router-dom";
import Table from "../components/Table";
import "../styles/Teams.css";

export default function Teams() {
  const [standings, setStandings] = useState({
    "Eastern Conference": [],
    "Western Conference": [],
  });
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchStandings() {
      const data = await getStandings("2024-25");
      console.log("Dados recebidos no Teams.jsx:", data);
      setStandings(data);
    }
    fetchStandings();
  }, []);

  const renderTableData = (teams) => {
    return teams.map((team) => ({
      rank: team.rank,
      team: (
        <span 
          className="clickable-team" 
          onClick={() => navigate(`/players/${team.teamId}`)}
        >
          {team.team}
        </span>
      ), 
      wins: team.wins,
      losses: team.losses,
    }));
  };
  
  return (
    <div className="teams-page">
      <div className="header-container">
        <h2 className="teams-title">Classificação da Atual da NBA </h2>
        <button className="info-button" onClick={() => navigate("/teamsfilter")}>
          Mais Informações
        </button>
      </div>
      <hr className="title-divider" />

      <div className="tables-wrapper">
        <div className="table-container">
          <div className="table-header">
            <h3>Eastern Conference</h3>
          </div>
          <Table 
            title="" 
            columns={["rank", "team", "wins", "losses"]} 
            data={renderTableData(standings["Eastern Conference"])} 
          />
        </div>

        <div className="table-container">
          <div className="table-header">
            <h3>Western Conference</h3>
          </div>
          <Table 
            title="" 
            columns={["rank", "team", "wins", "losses"]} 
            data={renderTableData(standings["Western Conference"])} 
          />
        </div>
      </div>
    </div>
  );
}
