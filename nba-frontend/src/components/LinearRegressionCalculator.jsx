import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getLinearRegression, getPlayerStats } from "../../api";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, Legend
} from "recharts";
import "../styles/Player.css";

export default function LinearRegressionCalculator() {
  const { playerId, teamAbbreviation } = useParams();
  const [playerInfo, setPlayerInfo] = useState(null);
  const [variavelIndep, setVariavelIndep] = useState("tempo_quadra");
  const [variavelDep, setVariavelDep] = useState("pontos");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchPlayerInfo() {
      try {
        const playerData = await getPlayerStats(playerId, teamAbbreviation);
        setPlayerInfo(playerData);
      } catch (error) {
        console.error("Erro ao buscar informações do jogador:", error);
      }
    }
    fetchPlayerInfo();
  }, [playerId, teamAbbreviation]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    if (!playerInfo?.team_id) {
      alert("Erro: ID do time não encontrado.");
      setLoading(false);
      return;
    }

    try {
      const requestData = { variavel_dependente: variavelDep, variavel_independente: variavelIndep };
      const response = await getLinearRegression(playerId, playerInfo.team_id, requestData);
      
      console.log("📊 Resposta da API:", response);  // 🔹 LOG DOS DADOS
      setResult(response);
    } catch (error) {
      console.error("Erro ao calcular regressão linear:", error);
      setResult(null);
    }

    setLoading(false);
  };

  // 🔹 Formatação dos dados para gráficos
  const statsData = result
    ? [
        { tipo: "Mínimo Previsto", valor: result.min_previsto },
        { tipo: "Média Prevista", valor: result.media_prevista },
        { tipo: "Máximo Previsto", valor: result.max_previsto }
      ]
    : [];

  return (
    <div className="regression-page">
      <h2>Regressão Linear - {playerInfo?.name}</h2>

      <form onSubmit={handleSubmit} className="regression-form">
        <label>Escolha a variável independente:</label>
        <select value={variavelIndep} onChange={(e) => setVariavelIndep(e.target.value)}>
          <option value="tempo_quadra">Tempo em Quadra</option>
          <option value="arremessos_tentados">Arremessos Tentados</option>
          <option value="turnovers">Turnovers</option>
        </select>

        <label>Escolha a variável dependente:</label>
        <select value={variavelDep} onChange={(e) => setVariavelDep(e.target.value)}>
          <option value="pontos">Pontos</option>
          <option value="assistencias">Assistências</option>
          <option value="rebotes">Rebotes</option>
        </select>

        <button type="submit" disabled={loading || !playerInfo?.team_id}>
          {loading ? "Calculando..." : "Calcular Regressão Linear"}
        </button>
      </form>

      {result && (
        <div className="result-container">
          <h3>Resultado</h3>
          <p><strong>Mínimo Previsto:</strong> {result.min_previsto.toFixed(2)}</p>
          <p><strong>Média Prevista:</strong> {result.media_prevista.toFixed(2)}</p>
          <p><strong>Máximo Previsto:</strong> {result.max_previsto.toFixed(2)}</p>

          {/* 🔹 Gráfico 1 - Comparação de Mínimo, Média e Máximo */}
          <div className="chart-container">
            <h3>Comparação de Valores Previstos</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={statsData}>
                <XAxis dataKey="tipo" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="valor" fill="#0088FE" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* 🔹 Gráfico 2 - Linha de Tendência */}
          <div className="chart-container">
            <h3>Linha de Tendência</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={statsData}>
                <XAxis dataKey="tipo" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="valor" stroke="#FF8042" name="Tendência" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}
