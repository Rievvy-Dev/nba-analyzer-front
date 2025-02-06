import axios from "axios";

const API_URL = "http://127.0.0.1:8000";

export const getStandings = async (season) => {
  try {
    const response = await axios.post(`${API_URL}/standings`, { season });
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar standings:", error);
    return null;
  }
};

export const getTeamVictories = async (teamId, season) => {
  try {
    const response = await axios.post(`${API_URL}/team-victories/${teamId}`, { season });
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar vitórias do time:", error);
    return null;
  }
};

export const getTeamStats = async (teamId, season) => {
  try {
    const response = await axios.post(`${API_URL}/team-stats/${teamId}`, { season });
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar estatísticas do time:", error);
    return null;
  }
};

export const getDefensiveStats = async (teamId, season) => {
  try {
    const response = await axios.post(`${API_URL}/defensive-stats/${teamId}`, { season });
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar estatísticas defensivas do time:", error);
    return null;
  }
};
