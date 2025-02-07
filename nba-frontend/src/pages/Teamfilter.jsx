import { useEffect, useState } from "react";
import { getStandings, getTeamVictories, getTeamStats, getDefensiveStats, getTeamGames } from "../../api";
import { useNavigate } from "react-router-dom";

import Table from "../components/Table";
import "../styles/Teamsfilter.css";

export default function Teams() {
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("");
  const [season] = useState("2023-24");
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1); // Volta para a página anterior
  };
  
  const [data, setData] = useState({
    stats: [],
    defensiveStats: [],
    generalData: [],
  });

  useEffect(() => {
    async function fetchTeams() {
      const standings = await getStandings(season);
      if (standings) {
        const allTeams = [
          ...standings["Eastern Conference"],
          ...standings["Western Conference"],
        ].map((team) => ({
          id: team.teamId,
          name: team.team,
        }));
        setTeams(allTeams);
      }
    }
    fetchTeams();
  }, [season]);

  const fetchData = async () => {
    if (!selectedTeam || !selectedFilter) return;

    let response = null;
    switch (selectedFilter) {
      case "Vitórias":
        response = await getTeamVictories(selectedTeam, season);
        break;
      case "Estatísticas Gerais":
        response = await getTeamStats(selectedTeam, season);
        break;
      case "Estatísticas Ofensivas":
        response = await getDefensiveStats(selectedTeam, season);
        break;
      case "Jogos":
        response = await getTeamGames(selectedTeam, season);
        break;
      default:
        return;
    }

    let extractedData = { stats: [], defensiveStats: [], generalData: [] };

    if (response && typeof response === "object" && !Array.isArray(response)) {
      if (response.team_stats_data) {
        extractedData.stats = Object.entries(response.team_stats_data).map(([key, value]) => ({
          Estatística: key.replace(/_/g, " "),
          Valor: value,
        }));
      }

      if (response.team_stats_data_div) {
        extractedData.defensiveStats = Object.entries(response.team_stats_data_div).map(([key, value]) => ({
          Estatística: key.replace(/_/g, " "),
          Valor: value,
        }));
      }

      if (response.defensive_stats_data) {
        extractedData.defensiveStats = Object.entries(response.defensive_stats_data).map(([key, value]) => ({
          Estatística: key.replace(/_/g, " "),
          Valor: value,
        }));
      }

      if (response.games_data && Array.isArray(response.games_data)) {
        extractedData.generalData = response.games_data.map(game => ({
          "Data": game.date,
          "Adversário": game.opponent,
          "Resultado": game.result,
          "Local": game.home_or_away === "home" ? "Casa" : "Fora",
          "Placar": game.score
        }));
      }

      if (response.victories_data && Array.isArray(response.victories_data)) {
        extractedData.generalData = response.victories_data;
      }

      if (!extractedData.generalData.length && !extractedData.stats.length && !extractedData.defensiveStats.length) {
        extractedData.generalData = [response];
      }
    } else {
      extractedData.generalData = response;
    }

    setData(extractedData);
  };

  return (
    <div className="teams-page">
      <div className="header-container">
        <h2 className="teams-title">Filtrar Informações dos Times</h2>
        <button className="back-button" onClick={handleGoBack}>Voltar</button>
 
      </div>
       <hr className="title-divider" />
      <div className="filter-controls">
        <select 
          onChange={(e) => {
            setSelectedTeam(e.target.value);
            setSelectedFilter(""); 
            setData({ stats: [], defensiveStats: [], generalData: [] });
          }} 
          value={selectedTeam}
        >
          <option value="">Selecione um time</option>
          {teams.map((team) => (
            <option key={team.id} value={team.id}>{team.name}</option>
          ))}
        </select>

        <select onChange={(e) => setSelectedFilter(e.target.value)} value={selectedFilter} disabled={!selectedTeam}>
          <option value="">Selecione um filtro</option>
          <option value="Vitórias">Vitórias</option>
          <option value="Estatísticas Gerais">Estatísticas Gerais</option>
          <option value="Estatísticas Defensivas">Estatísticas Defensivas</option>
          <option value="Jogos">Jogos</option>
        </select>

        <button onClick={fetchData} disabled={!selectedFilter}>Buscar</button>
      </div>

      {selectedFilter === "Estatísticas Gerais" && (data.stats.length > 0 || data.defensiveStats.length > 0) ? (
        <div className="stats-tables">
          {data.stats.length > 0 && (
            <Table
              title={`Estatísticas Gerais - ${teams.find(t => t.id == selectedTeam)?.name}`}
              columns={["Estatística", "Valor"]}
              data={data.stats}
            />
          )}
          {data.defensiveStats.length > 0 && (
            <Table
              title={`Estatísticas Defensivas - ${teams.find(t => t.id == selectedTeam)?.name}`}
              columns={["Estatística", "Valor"]}
              data={data.defensiveStats}
            />
          )}
        </div>
      ) : selectedFilter === "Estatísticas Defensivas" && data.defensiveStats.length > 0 ? (
        <Table
          title={`Estatísticas Defensivas - ${teams.find(t => t.id == selectedTeam)?.name}`}
          columns={["Estatística", "Valor"]}
          data={data.defensiveStats}
        />
      ) : data.generalData.length > 0 ? (
        <Table
          title={`${selectedFilter} - ${teams.find(t => t.id == selectedTeam)?.name}`}
          columns={Object.keys(data.generalData[0] || {})}
          data={data.generalData}
        />
      ) : (
        <p>Nenhum dado encontrado para essa consulta.</p>
      )}
    </div>
  );
}
