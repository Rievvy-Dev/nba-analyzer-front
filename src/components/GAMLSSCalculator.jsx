import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getGAMLSSPrediction, getPlayerStats } from "../../api";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, Legend, ScatterChart, Scatter, PieChart, Pie, Cell
} from "recharts";
import "../styles/Probability.css";

export default function GAMLSSCalculator() {
  const { playerId, teamAbbreviation } = useParams();
  const [playerInfo, setPlayerInfo] = useState(null);
  const [variavelDep, setVariavelDep] = useState("points"); 
  const [modelo, setModelo] = useState("poisson");
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
      const requestData = { variavel_dependente: variavelDep, modelo };
      const response = await getGAMLSSPrediction(playerId, playerInfo.team_id, requestData);
      
      console.log("📊 Resposta da API:", response);
      setResult(response);
    } catch (error) {
      console.error("Erro ao calcular previsão GAMLSS:", error);
      setResult(null);
    }

    setLoading(false);
  };

  const COLORS = ["#0088FE", "#FFBB28", "#FF8042", "#00C49F", "#FF3333"];

  // 🔹 Formatação dos dados para gráficos
  const statsData = result
    ? [
        { tipo: "Mínimo Previsto", valor: result.min_previsto },
        { tipo: "Média Prevista", valor: result.media_prevista },
        { tipo: "Máximo Previsto", valor: result.max_previsto }
      ]
    : [];

  const probData = result?.probabilidades
    ? Object.entries(result.probabilidades).map(([key, value]) => ({
        tipo: key.replace("_", " ").toUpperCase(),
        valor: value
      }))
    : [];

  const distribPrevisoes = result?.distribuicao_previsoes
    ? result.distribuicao_previsoes.map((valor, index) => ({
        index: index + 1,
        valor: valor[0]
      }))
    : [];

  return (
    <div className="regression-page">
      <h2>Previsão GAMLSS - {playerInfo?.name}</h2>

      <form onSubmit={handleSubmit} className="probability-form">
        <label>Escolha a variável dependente:</label>
        <select value={variavelDep} onChange={(e) => setVariavelDep(e.target.value)}>
          <option value="points">Pontos</option>
          <option value="rebounds">Rebotes</option>
          <option value="assists">Assistências</option>
        </select>

        <label>Escolha o modelo:</label>
        <select value={modelo} onChange={(e) => setModelo(e.target.value)}>
          <option value="poisson">Poisson</option>
          <option value="linear">Linear</option>
        </select>

        <button type="submit" disabled={loading || !playerInfo?.team_id}>
          {loading ? "Calculando..." : "Calcular Previsão GAMLSS"}
        </button>
      </form>

      {result && (
        <div className="result-container">
          <h3>Resultados</h3>
          <p><strong>Modelo Utilizado:</strong> {result?.modelo?.toUpperCase() ?? "N/A"}</p>
          <p><strong>Mínimo Previsto:</strong> {result?.min_previsto?.toFixed(2) ?? "N/A"}</p>
          <p><strong>Média Prevista:</strong> {result?.media_prevista?.toFixed(2) ?? "N/A"}</p>
          <p><strong>Máximo Previsto:</strong> {result?.max_previsto?.toFixed(2) ?? "N/A"}</p>

          <div className="chart-group">
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

            <div className="chart-container">
              <h3>Distribuição de Previsões</h3>
              <ResponsiveContainer width="100%" height={300}>
                <ScatterChart>
                  <XAxis dataKey="index" />
                  <YAxis dataKey="valor" />
                  <Tooltip />
                  <Scatter name="Previsões" data={distribPrevisoes} fill="#FF8042" />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="chart-group">
            <div className="chart-container">
              <h3>Probabilidades Acima e Abaixo</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={probData} dataKey="valor" nameKey="tipo" cx="50%" cy="50%" outerRadius={100}>
                    {probData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="chart-container">
              <h3>Matriz de Confusão</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={result?.matriz_confusao.map((row, i) => ({ categoria: `Classe ${i + 1}`, Verdadeiro: row[0], Falso: row[1] }))}>
                  <XAxis dataKey="categoria" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="Verdadeiro" fill="#00C49F" />
                  <Bar dataKey="Falso" fill="#FF3333" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
