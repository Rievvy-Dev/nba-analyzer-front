import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPlayerGames, getPlayerStats } from "../../api"; 
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";
import "../styles/DashboardPlayer.css";

export default function DashboardPlayer() {
  const { playerId, teamAbbreviation } = useParams();
  const [playerGames, setPlayerGames] = useState([]);
  const [playerInfo, setPlayerInfo] = useState(null);
  const season = "2024-25"; 
  useEffect(() => {
    async function fetchPlayerGames() {
      try {
        const response = await getPlayerGames(playerId, season);
        setPlayerGames(response ?? []); 
      } catch (error) {
        console.error("Erro ao buscar jogos:", error);
        setPlayerGames([]);
      }
    }

    async function fetchPlayerInfo() {
      try {
        const playerData = await getPlayerStats(playerId, teamAbbreviation);
        setPlayerInfo(playerData);
      } catch (error) {
        console.error("Erro ao buscar dados do jogador:", error);
        setPlayerInfo(null);
      }
    }

    fetchPlayerGames();
    fetchPlayerInfo();
  }, [playerId, season]);


  const calculateStats = (games, key) => {
    if (!games.length) return { media: 0, mediana: 0, moda: { valor: 0, frequencia: 0 }, min: 0, max: 0, q1: 0, q3: 0, outliers: [] };

    const values = games.map(game => game[key]).sort((a, b) => a - b);
    const media = values.reduce((acc, val) => acc + val, 0) / values.length;
    const mediana = values.length % 2 === 0 ? (values[values.length / 2 - 1] + values[values.length / 2]) / 2 : values[Math.floor(values.length / 2)];
    
    const moda = values.reduce((acc, val) => {
      acc[val] = (acc[val] || 0) + 1;
      return acc;
    }, {});
    const modaValor = Object.keys(moda).reduce((a, b) => moda[a] > moda[b] ? a : b, 0);

    const q1 = values[Math.floor(values.length * 0.25)];
    const q3 = values[Math.floor(values.length * 0.75)];
    const min = values[0];
    const max = values[values.length - 1];
    const outliers = values.filter(v => v < q1 - 1.5 * (q3 - q1) || v > q3 + 1.5 * (q3 - q1));

    return { media, mediana, moda: { valor: modaValor, frequencia: moda[modaValor] || 0 }, min, max, q1, q3, outliers };
  };

  const pontosStats = calculateStats(playerGames, "points");
  const rebotesStats = calculateStats(playerGames, "rebounds");
  const assistenciasStats = calculateStats(playerGames, "assists");

  const createChartData = (stat) => [
    { categoria: "Média", valor: stat.media },
    { categoria: "Mediana", valor: stat.mediana },
    { categoria: "Moda", valor: stat.moda.valor },
  ];

  const boxPlotData = [
    {
      categoria: "Pontos",
      min: pontosStats.min,
      q1: pontosStats.q1,
      median: pontosStats.mediana,
      q3: pontosStats.q3,
      max: pontosStats.max,
      outliers: pontosStats.outliers,
    },
    {
      categoria: "Rebotes",
      min: rebotesStats.min,
      q1: rebotesStats.q1,
      median: rebotesStats.mediana,
      q3: rebotesStats.q3,
      max: rebotesStats.max,
      outliers: rebotesStats.outliers,
    },
    {
      categoria: "Assistências",
      min: assistenciasStats.min,
      q1: assistenciasStats.q1,
      median: assistenciasStats.mediana,
      q3: assistenciasStats.q3,
      max: assistenciasStats.max,
      outliers: assistenciasStats.outliers,
    },
  ];

  return (
    <div className="dashboard-page">
      <h2>Dashboard de {playerInfo?.name} - Temporada {season}</h2>
  
      {playerGames.length > 0 ? (
        <>
          <div className="chart-group">
            <div className="chart-container">
              <h3>Distribuição de Pontos por Jogo</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={createChartData(pontosStats)}>
                  <XAxis dataKey="categoria" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="valor" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
  
            <div className="chart-container">
              <h3>Distribuição de Rebotes por Jogo</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={createChartData(rebotesStats)}>
                  <XAxis dataKey="categoria" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="valor" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
  
          <div className="chart-group">
            <div className="chart-container">
              <h3>Distribuição de Assistências por Jogo</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={createChartData(assistenciasStats)}>
                  <XAxis dataKey="categoria" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="valor" fill="#ffc658" />
                </BarChart>
              </ResponsiveContainer>
            </div>
  
            <div className="chart-container">
              <h3>Box Plot de Pontos, Rebotes e Assistências</h3>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={boxPlotData}>
                  <XAxis dataKey="categoria" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="min" fill="#ff6666" name="Mínimo" />
                  <Bar dataKey="q1" fill="#ffa500" name="Q1 (Primeiro Quartil)" />
                  <Bar dataKey="median" fill="#00cc99" name="Mediana" />
                  <Bar dataKey="q3" fill="#003366" name="Q3 (Terceiro Quartil)" />
                  <Bar dataKey="max" fill="#800080" name="Máximo" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      ) : (
        <p className="no-data">Nenhum jogo encontrado para essa temporada.</p>
      )}
    </div>
  );
}  