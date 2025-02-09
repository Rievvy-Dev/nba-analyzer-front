import axios from "axios";

const API_URL = "http://127.0.0.1:8000";

export const getStandings = async (season) => {
  try {
    const response = await axios.post(`${API_URL}/standings`, { season });
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar standings:", error);
    return { "Eastern Conference": [], "Western Conference": [] };
  }
};

export const getTeamVictories = async (teamId, season) => {
  try {
    const response = await axios.post(`${API_URL}/team-victories/${teamId}`, { season });
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar vitórias do time:", error);
    return [];
  }
};

export const getTeamStats = async (teamId, season) => {
  try {
    const response = await axios.post(`${API_URL}/team-stats/${teamId}`, { season });
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar estatísticas do time:", error);
    return [];
  }
};

export const getDefensiveStats = async (teamId, season) => {
  try {
    const response = await axios.post(`${API_URL}/defensive-stats/${teamId}`, { season });
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar estatísticas defensivas do time:", error);
    return [];
  }
};

export const getTeamGames = async (teamId, season) => {
  try {
    const response = await axios.post(`${API_URL}/team-games/${teamId}`, { season });
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar jogos do time:", error);
    return [];
  }
};

export const getPlayers = async (teamId, season) => {
  try {
    const response = await axios.post(`${API_URL}/players/${teamId}`, { season });
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar jogadores do time:", error);
    return [];
  }
};

export const getPlayerStats = async (playerId, teamAbbreviation) => {
  try {
    const response = await axios.post(`${API_URL}/player-stats/${playerId}`, { team_abbreviation: teamAbbreviation });
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar estatísticas do jogador:", error);
    return [];
  }
};

export async function getPlayerGames(playerId, season, team_id) {
  try {
    const response = await axios.post(`${API_URL}/player-games/${playerId}`, {
      season,
      team_id
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar jogos do jogador:", error.response?.data || error.message);
    return [];
  }
}

export async function getPlayerGamesbyOpp(playerId, season, opponentId) {
  try {
    const response = await axios.post(`${API_URL}/player-games-against-team/${playerId}`, {
      season, 
      opponent_id: opponentId,
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar jogos contra um adversário:", error);
    return [];
  }
}

export async function getPlayerSeasonStats(playerId, season) {
  try {
    const response = await axios.post(`${API_URL}/player-season-stats/${playerId}`, {
      season, 
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar estatísticas da temporada do jogador:", error);
    return null;
  }
}

export async function getPlayerCareerStats(playerId) {
  try {
    const response = await axios.get(`${API_URL}/player-career-stats/${playerId}`);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar estatísticas da carreira do jogador:", error);
    return null;
  }
}

export async function getGumbelProbability(playerId, teamId, modelData) {
  try {
    const response = await axios.post(`${API_URL}/gumbel/probability/${playerId}`, {
      team_id: teamId,
      ...modelData
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao calcular a probabilidade Gumbel:", error);
    return null;
  }
}

export async function getLinearRegression(playerId, teamId, modelData) {
  try {
    const response = await axios.post(`${API_URL}/linear-regression/${playerId}`, {
      team_id: teamId,
      ...modelData
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao calcular regressão linear:", error);
    return null;
  }
}

export async function getLogisticRegression(playerId, teamId, modelData) {
  try {
    const response = await axios.post(`${API_URL}/logistic-regression/${playerId}`, {
      team_id: teamId,
      ...modelData
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao calcular regressão logística:", error);
    return null;
  }
}

export async function getGAMLSSPrediction(playerId, teamId, modelData) {
  try {
    const response = await axios.post(`${API_URL}/gamlss/prediction/${playerId}`, {
      team_id: teamId,
      ...modelData
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao calcular previsão GAMLSS:", error);
    return null;
  }
}
