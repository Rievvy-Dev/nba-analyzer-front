import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getGumbelProbability, getPlayerStats } from "../../api";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from "recharts";
import "../styles/Probability.css";

export default function Probability() {
  const { playerId, teamAbbreviation } = useParams();
  const [playerInfo, setPlayerInfo] = useState(null);
  const [variavel, setVariavel] = useState("points"); 
  const [x, setX] = useState(""); 
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

    if (!x || isNaN(x)) {
      alert("Por favor, insira um valor numérico válido.");
      setLoading(false);
      return;
    }

    if (!playerInfo?.team_id) {
      alert("Erro: ID do time não encontrado.");
      setLoading(false);
      return;
    }

    try {
      const modelData = { variavel, x: parseFloat(x) };
      const response = await getGumbelProbability(playerId, playerInfo.team_id, modelData);
      setResult(response);
    } catch (error) {
      console.error("Erro ao buscar probabilidade Gumbel:", error);
      setResult(null);
    }

    setLoading(false);
  };

  const COLORS = ["#0088FE", "#FFBB28", "#FF8042", "#00C49F", "#FF3333"];
  const probData = [
    { name: "Probabilidade Acima", value: result?.prob_acima ?? 0 },
    { name: "Probabilidade Abaixo", value: result?.prob_abaixo ?? 0 },
  ];

  const menorIgualData = [
    { name: "Proporção Menores", value: result?.prop_menores ?? 0 },
    { name: "Proporção Maiores", value: 100 - (result?.prop_menores ?? 0) }
  ];
  const valoresMenoresData = result?.valores_menores
    ? result.valores_menores.map((value, index) => ({ index: index + 1, value }))
    : [];

  const proporcaoMenoresData = [
    { name: "Proporção Menores", value: result?.proporcao_menores ?? 0 },
    { name: "Proporção Maiores", value: 100 - (result?.proporcao_menores ?? 0) }
  ];

  return (
    <div className="probability-page">
      <h2>Probabilidade de Gumbel - {playerInfo?.name}</h2>

      <form onSubmit={handleSubmit} className="probability-form">
        <label>Escolha a variável:</label>
        <select value={variavel} onChange={(e) => setVariavel(e.target.value)}>
          <option value="points">Pontos</option>
          <option value="rebounds">Rebotes</option>
          <option value="assists">Assistências</option>
        </select>

        <label>Digite um valor X:</label>
        <input
          type="number"
          value={x}
          onChange={(e) => setX(e.target.value)}
          placeholder="Exemplo: 25"
          required
        />

        <button type="submit" disabled={loading || !playerInfo?.team_id}>
          {loading ? "Calculando..." : "Calcular Probabilidade"}
        </button>
      </form>

      {result && (
        <div className="result-container">
          <h3>Resultado</h3>
          <div className="chart-group">
            <div className="chart-container">
              <h3>Probabilidade Acima e Abaixo de X</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={probData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100}>
                    {probData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="chart-container">
              <h3>Proporção de Valores Menores ou Iguais a X</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={menorIgualData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100}>
                    {menorIgualData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="chart-group">
            <div className="chart-container">
              <h3>Distribuição de Valores Menores que X</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={valoresMenoresData}>
                  <XAxis dataKey="index" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="chart-container">
              <h3>Proporção de Valores Menores que X</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={proporcaoMenoresData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100}>
                    {proporcaoMenoresData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}