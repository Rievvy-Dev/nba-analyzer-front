import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPlayerStats, getPlayerGames, getPlayerGamesbyOpp, getStandings } from "../../api"; 
import {  AiOutlineBarChart, AiOutlineFileText } from "react-icons/ai"; 
import Table from "../components/Table";
import ProbabilityCalculator from "../components/ProbabilityCalculator";
import LinearRegressionCalculator from "../components/LinearRegressionCalculator";
import LogisticRegressionCalculator from "../components/LogisticRegression"; 
import GAMLSSCalculator from "../components/GAMLSSCalculator";
import "../styles/Player.css";

export default function Player() {
  const { playerId, teamAbbreviation } = useParams();
  const navigate = useNavigate();
  const [playerInfo, setPlayerInfo] = useState(null);
  const [playerGames, setPlayerGames] = useState([]); 
  const [filteredGames, setFilteredGames] = useState([]); 
  const [viewMode, setViewMode] = useState("info");
  const [teams, setTeams] = useState([]); 
  const [selectedOpponent, setSelectedOpponent] = useState(""); 
  const [season, setSeason] = useState("2024-25"); 
  const [generalStats, setGeneralStats] = useState(null); 
  const [probabilityType, setProbabilityType] = useState("gumbel");
  
  

  useEffect(() => {
    async function fetchStats() {
      try {
        const data = await getPlayerStats(playerId, teamAbbreviation);
        setPlayerInfo(data);
      } catch (error) {
        console.error("Erro ao buscar estatísticas do jogador:", error);
      }
    }
    fetchStats();
  }, [playerId, teamAbbreviation]);

  useEffect(() => {
    async function fetchGames() {
      try {
        const games = await getPlayerGames(playerId, season, playerInfo["team_id"] );
        console.log(playerInfo)
        setPlayerGames(games);
        setFilteredGames(games); 
      } catch (error) {
        console.error("Erro ao buscar jogos do jogador:", error);
      }
    }
    fetchGames();
  }, [playerId, season, playerInfo]);

  useEffect(() => {
    async function fetchTeams() {
      try {
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
      } catch (error) {
        console.error("Erro ao buscar times:", error);
      }
    }
    fetchTeams();
  }, [season]);

  const fetchGamesByOpponent = async () => {
    if (!selectedOpponent) {
      setFilteredGames(playerGames); 
      setGeneralStats(null);
      return;
    }
  
    try {
      const response = await getPlayerGamesbyOpp(playerId, season, selectedOpponent);

      if (response && response.jogos && Array.isArray(response.jogos) && response.jogos.length > 0) {
        setFilteredGames(response.jogos);
        setGeneralStats(response.estatisticas_gerais || null); 
      } else {
        setFilteredGames([]); 
        setGeneralStats(null);
      }
    } catch (error) {
      console.error("Erro ao buscar jogos contra oponente:", error);
      setFilteredGames([]); 
      setGeneralStats(null);
    }
  };

  const renderGamesTable = (games) => {
    return games.map((game) => ({
      Data: new Date(game.game_date).toLocaleDateString("pt-BR"),
      Oponente: game.opponent ?? "N/A",
      Pontos: game.points ?? "N/A",
      Assistências: game.assists ?? "N/A",
      Rebotes: game.rebounds ?? "N/A",
      Jogo: game.home_away ?? "N/A",
      Placar: game.score ?? "N/A",
      Resultado: game.result ?? "N/A",
    }));
  };

  const renderStatsTable = (stats) => {
    const keys = ["pontos", "rebotes", "assistencias", "aproveitamento_3pts", "tempo_medio_jogado"];
    return keys.map((key) => ({
      Estatística: key.charAt(0).toUpperCase() + key.slice(1).replace("_", " "),
      Média: stats[key]?.media ?? "N/A",
      Mediana: stats[key]?.mediana ?? "N/A",
      Moda: stats[key]?.moda?.valor ?? "N/A",
      "Frequência da Moda": stats[key]?.moda?.frequencia ?? "N/A",
      "Desvio Padrão": stats[key]?.desvio_padrao ?? "N/A",
      "Abaixo da Média": `${stats[key]?.abaixo_media_percentual ?? 0}%`,
      "Abaixo da Mediana": `${stats[key]?.abaixo_mediana_percentual ?? 0}%`,
    }));
  };

  if (!playerInfo) {
    return <p className="loading">Carregando estatísticas do jogador...</p>;
  }

  return (
    <div className="player-stats-page">
      <div className="header-container">
        <h2 className="stats-title">{playerInfo.name}</h2>
        <button className="back-button" onClick={() => navigate(-1)}>Voltar</button>
      </div>
      <hr className="title-divider" />

      {/* 🔹 Botões de Alternância */}
      <div className="toggle-container">
        <button 
          className={`toggle-button ${viewMode === "info" ? "active" : ""}`}
          onClick={() => setViewMode("info")}
        >
          Informações
        </button>
        <button 
          className={`toggle-button ${viewMode === "games" ? "active" : ""}`}
          onClick={() => setViewMode("games")}
        >
          Jogos
        </button>
        <button 
          className={`toggle-button ${viewMode === "probability" ? "active" : ""}`}
          onClick={() => setViewMode("probability")}
        >
          Probabilidade
        </button>
      </div>

      {/* 🔹 Renderização Condicional */}
      {viewMode === "info" && (
        <div className="player-info">
          <div className="info-container">
            <div className="info-text">
              <p><strong>Posição:</strong> {playerInfo.position}</p>
              <p><strong>Altura:</strong> {playerInfo.height}</p>
              <p><strong>Peso:</strong> {playerInfo.weight}</p>
              <p><strong>Idade:</strong> {playerInfo.age} anos</p>
              <p><strong>Experiência:</strong> {playerInfo.experience} anos</p>
              <p><strong>Faculdade:</strong> {playerInfo.college ?? "Não informado"}</p>
              <p><strong>Salário:</strong> {playerInfo.salary}</p>
            </div>
            <div className="icon-group">
              <button
                className="grafics-icon"
                onClick={() => navigate(`/dashboard/${playerId}/${teamAbbreviation}`)}
                title="Ver Gráficos"
              >
                <AiOutlineBarChart size={24} color="#003366" />
              </button>
              <button
                className="grafics-icon"
                onClick={() => navigate(`/playerstats/${playerId}/${teamAbbreviation}`)}
                title="Ver Status do Jogador"
              >
                <AiOutlineFileText size={24} color="#003366" />
              </button>
            </div>
          </div>
        </div>
      )}

      {viewMode === "games" && (
        <>
          <div className="filter-controls">
            <label>Filtrar por oponente:</label>
            <select
              onChange={(e) => setSelectedOpponent(e.target.value)}
              value={selectedOpponent}
              disabled={teams.length === 0}
            >
              <option value="">Todos os adversários</option>
              {teams.map((team) => (
                <option key={team.id} value={team.id}>{team.name}</option>
              ))}
            </select>
            <button onClick={fetchGamesByOpponent}>Filtrar</button>
          </div>

          <Table 
            columns={["Data", "Oponente", "Pontos", "Assistências", "Rebotes", "Jogo","Placar", "Resultado"]}
            data={renderGamesTable(filteredGames.length > 0 ? filteredGames : playerGames)}
          />

          {generalStats && (
            <Table 
              title="Estatísticas Gerais"
              columns={[
                "Estatística",
                "Média",
                "Mediana",
                "Moda",
                "Frequência da Moda",
                "Desvio Padrão",
                "Abaixo da Média",
                "Abaixo da Mediana",
              ]}
              data={renderStatsTable(generalStats)}
            />
          )}
        </>
      )}

{viewMode === "probability" && (
        <div className="probability-section">
          <div>
          <label>Escolha o modelo de probabilidade:</label>
          <select value={probabilityType} onChange={(e) => setProbabilityType(e.target.value)}>
            <option value="gumbel">Gumbel</option>
            <option value="linear">Regressão Linear</option>
            <option value="logistic">Regressão Logística</option>
            <option value="gamlss">GAMLSS</option>
          </select>
          </div>
          {probabilityType === "gumbel" && (
            <ProbabilityCalculator playerId={playerId} teamAbbreviation={teamAbbreviation} />
          )}

          {probabilityType === "linear" && (
            <LinearRegressionCalculator playerId={playerId} teamAbbreviation={teamAbbreviation} />
          )}

          {probabilityType === "logistic" && (
            <LogisticRegressionCalculator playerId={playerId} teamAbbreviation={teamAbbreviation} />
          )}

          {probabilityType === "gamlss" && (
            <GAMLSSCalculator playerId={playerId} teamAbbreviation={teamAbbreviation} />
          )}
        </div>
      )}
    </div>
  );
}
