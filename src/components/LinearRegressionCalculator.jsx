import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getLinearRegression, getPlayerStats } from "../../api";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, Legend, ScatterChart, Scatter
} from "recharts";
import "../styles/Probability.css";

export default function LinearRegressionCalculator() {
  const { playerId, teamAbbreviation } = useParams();
  const [playerInfo, setPlayerInfo] = useState(null);
  const [variavelDep, setVariavelDep] = useState("points");
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
      const requestData = { variavel_dependente: variavelDep };
      const response = await getLinearRegression(playerId, playerInfo.team_id, requestData);
      console.log("📊 Resposta da API:", response);
      setResult(response);
    } catch (error) {
      console.error("Erro ao calcular regressão linear:", error);
      setResult(null);
    }

    setLoading(false);
  };

  // 🔹 Dados formatados para os gráficos
  const statsData = result
    ? [
        { tipo: "Mínimo Previsto", valor: result.min_previsto },
        { tipo: "Mediana Prevista", valor: result.mediana_prevista },
        { tipo: "Média Prevista", valor: result.media_prevista },
        { tipo: "Máximo Previsto", valor: result.max_previsto }
      ]
    : [];

  const distribuicaoPrevisoes = result?.distribuicao_previsoes
    ? result.distribuicao_previsoes.map((valor, index) => ({ index, valor }))
    : [];

  const probabilidadeStats = result?.probabilidades
    ? [
        { estatistica: "Média", acima: result.probabilidades.acima_media },
        { estatistica: "Mediana", acima: result.probabilidades.acima_mediana },
        { estatistica: "Mínimo", acima: result.probabilidades.acima_minimo },
        { estatistica: "Máximo", acima: result.probabilidades.acima_maximo },
      ]
    : [];

  const matrizConfusaoData = result?.matriz_confusao
    ? [
        { classe: "Positivos", corretos: result.matriz_confusao[0][0], errados: result.matriz_confusao[0][1] },
        { classe: "Negativos", corretos: result.matriz_confusao[1][1], errados: result.matriz_confusao[1][0] }
      ]
    : [];

  const curvaRocData = result?.curva_roc
    ? result.curva_roc.fpr.map((fpr, index) => ({
        fpr, tpr: result.curva_roc.tpr[index]
      }))
    : [];

  return (
    <div className="regression-page">
      <h2>Regressão Linear - {playerInfo?.name}</h2>

      <form onSubmit={handleSubmit} className="probability-form">
        <label>Escolha a variável dependente:</label>
        <select value={variavelDep} onChange={(e) => setVariavelDep(e.target.value)}>
        <option value="points">Pontos</option>
          <option value="rebounds">Rebotes</option>
          <option value="assists">Assistências</option>
        </select>

        <button type="submit" disabled={loading || !playerInfo?.team_id}>
          {loading ? "Calculando..." : "Calcular Regressão Linear"}
        </button>
      </form>

      {result && (
        <div className="result-container">
          <h3>Resultado</h3>

          <div className="chart-group">
            <div className="chart-container">
              <h3>Valores Previstos (Mínimo, Média e Máximo)</h3>
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
              <h3>Distribuição das Previsões</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={distribuicaoPrevisoes}>
                  <XAxis dataKey="index" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="valor" stroke="#FF8042" name="Previsão" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="chart-group">
            <div className="chart-container">
              <h3>Probabilidades Acima de Estatísticas</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={probabilidadeStats}>
                  <XAxis dataKey="estatistica" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="acima" fill="#00C49F" name="Acima" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="chart-container">
              <h3>Matriz de Confusão</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={matrizConfusaoData}>
                  <XAxis dataKey="classe" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="corretos" fill="#82ca9d" name="Corretos" />
                  <Bar dataKey="errados" fill="#ff6666" name="Errados" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="chart-container">
            <h3>Curva ROC</h3>
            <ResponsiveContainer width="100%" height={300}>
              <ScatterChart>
                <XAxis dataKey="fpr" name="FPR" />
                <YAxis dataKey="tpr" name="TPR" />
                <Tooltip />
                <Scatter name="Curva ROC" data={curvaRocData} fill="#FF8042" />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}
