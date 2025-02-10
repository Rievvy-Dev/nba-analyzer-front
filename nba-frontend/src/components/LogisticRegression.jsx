import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getLogisticRegression, getPlayerStats } from "../../api";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, Legend
} from "recharts";
import "../styles/Probability.css";

export default function LogisticRegressionCalculator() {
  const { playerId, teamAbbreviation } = useParams();
  const [playerInfo, setPlayerInfo] = useState(null);
  const [variavelDep, setVariavelDep] = useState("points");
  const [limite, setLimite] = useState(10);
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
      const requestData = { variavel_dependente: variavelDep, limite };
      const response = await getLogisticRegression(playerId, playerInfo.team_id, requestData);
      
      console.log("📊 Resposta da API:", response);
      setResult(response);
    } catch (error) {
      console.error("Erro ao calcular regressão logística:", error);
      setResult(null);
    }

    setLoading(false);
  };

  const statsData = result
    ? [
        { tipo: "Mínima Probabilidade", valor: result.prob_min },
        { tipo: "Média Probabilidade", valor: result.prob_media },
        { tipo: "Máxima Probabilidade", valor: result.prob_max }
      ]
    : [];

  return (
    <div className="regression-page">
      <h2>Regressão Logística - {playerInfo?.name}</h2>

      <form onSubmit={handleSubmit} className="probability-form">
        <label>Escolha a variável dependente:</label>
        <select value={variavelDep} onChange={(e) => setVariavelDep(e.target.value)}>
        <option value="points">Pontos</option>
          <option value="rebounds">Rebotes</option>
          <option value="assists">Assistências</option>
        </select>

        <label>Defina o limite:</label>
        <input type="number" value={limite} onChange={(e) => setLimite(e.target.value)} />

        <button type="submit" disabled={loading || !playerInfo?.team_id}>
          {loading ? "Calculando..." : "Calcular Regressão Logística"}
        </button>
      </form>

      {result && (
        <div className="result-container">
          <h3>Resultado</h3>
          <p><strong>Mínima Probabilidade:</strong> {result?.prob_min ? result.prob_min.toFixed(2) : "N/A"}</p>
<p><strong>Média Probabilidade:</strong> {result?.prob_media ? result.prob_media.toFixed(2) : "N/A"}</p>
<p><strong>Máxima Probabilidade:</strong> {result?.prob_max ? result.prob_max.toFixed(2) : "N/A"}</p>

          <div className="chart-group">
            <div className="chart-container">
              <h3>Distribuição das Probabilidades</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={statsData}>
                  <XAxis dataKey="tipo" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="valor" fill="#0088FE" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="chart-container">
              <h3>Tendência das Probabilidades</h3>
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
        </div>
      )}
    </div>
  );
}
