import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPlayerStats, getPlayerSeasonStats, getPlayerCareerStats } from "../../api";
import Table from "../components/Table";
import "../styles/Player.css";

export default function PlayerStats() {
  const { playerId, teamAbbreviation } = useParams();
  const navigate = useNavigate();
  const [playerInfo, setPlayerInfo] = useState(null);
  const [seasonStats, setSeasonStats] = useState(null);
  const [careerStats, setCareerStats] = useState(null);
  const [season, setSeason] = useState("2024-25");

  useEffect(() => {
    async function fetchPlayerInfo() {
      try {
        const data = await getPlayerStats(playerId, teamAbbreviation);
        setPlayerInfo(data);
      } catch (error) {
        console.error("Erro ao buscar informações do jogador:", error);
      }
    }
    async function fetchSeasonStats() {
        try {
          const data = await getPlayerSeasonStats(playerId, season);
          setSeasonStats(data);
        } catch (error) {
          console.error("Erro ao buscar estatísticas da temporada:", error);
        }
      }
  
      async function fetchCareerStats() {
        try {
          const data = await getPlayerCareerStats(playerId);
          if (data) {
            setCareerStats({
              "Total de Jogos": data.total_jogos ?? "N/A",
              "Total de Pontos": data.total_pontos ?? "N/A",
              "Total de Assistências": data.total_assistencias ?? "N/A",
              "Total de Rebotes": data.total_rebotes ?? "N/A",
              "Total de Minutos": data.total_minutos ?? "N/A",
              "Média de Pontos": data.media_pontos ?? "N/A",
              "Média de Assistências": data.media_assistencias ?? "N/A",
              "Média de Rebotes": data.media_rebotes ?? "N/A",
            });
          } else {
            setCareerStats(null);
          }
        } catch (error) {
          console.error("Erro ao buscar estatísticas da carreira:", error);
          setCareerStats(null);
        }
      }
  
      fetchPlayerInfo();
      fetchSeasonStats();
      fetchCareerStats();
    }, [playerId, season, teamAbbreviation]);
  
    const renderStatsTable = (stats) => {
      if (!stats) return [];
      return Object.entries(stats).map(([key, value]) => ({
        Estatística: key,
        Valor: value,
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
  
        <div className="filter-controls">
          <label>Selecionar Temporada:</label>
          <select onChange={(e) => setSeason(e.target.value)} value={season}>
            <option value="2024-25">Temporada 2024-25</option>
            <option value="2023-24">Temporada 2023-24</option>
          </select>
        </div>
  
        <h3 className="stats-title">Estatísticas da Temporada {season}</h3>
        {seasonStats ? (
          <Table columns={["Estatística", "Valor"]} data={renderStatsTable(seasonStats)} />
        ) : (
          <p className="no-stats">Nenhuma estatística da temporada encontrada.</p>
        )}
  
        <h3 className="c">Estatísticas da Carreira</h3>
        {careerStats ? (
          <Table columns={["Estatística", "Valor"]} data={renderStatsTable(careerStats)} />
        ) : (
          <p className="no-stats">Nenhuma estatística de carreira encontrada.</p>
        )}
      </div>
    );
  }