import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPlayers } from "../../api"; 
import Table from "../components/Table";
import "../styles/PlayersList.css";

export default function PlayersList() {
  const { teamId } = useParams();
  const navigate = useNavigate();
  const [players, setPlayers] = useState([]);
  const [teamName, setTeamName] = useState(""); 
  const season = "2024-25";

  useEffect(() => {
    async function fetchPlayers() {
      const data = await getPlayers(teamId, season);
      console.log("Jogadores recebidos:", data);

      if (data.length > 0) {
        setTeamName(data[0].team); 
      } else {
        setTeamName("Desconhecido");
      }

      setPlayers(data);
    }
    fetchPlayers();
  }, [teamId]);

  const renderTableData = (players) => {
    return players.map((player) => ({
      Id: player.id,
      Nome: (
        <span 
          className="clickable-player" 
          onClick={() => navigate(`/player/${player.id}/${player.team}`)}
        >
          {player.name}
        </span>
      ),
      Idade: player.age ?? "N/A",
      Time: player.team ?? "N/A",
    }));
  };

  return (
    <div className="players-list-page">
      <div className="header-container">
        <h2 className="players-title">Jogadores {teamName}</h2>
        <button className="back-button" onClick={() => navigate("/teams")}>
          Voltar
        </button>
      </div>
      <hr className="title-divider" />

      {players.length > 0 ? (
        <Table 
          columns={["Id", "Nome","Idade", "Time"]}
          data={renderTableData(players)}
        />
      ) : (
        <p className="no-players">Carregando.</p>
      )}
    </div>
  );
}
