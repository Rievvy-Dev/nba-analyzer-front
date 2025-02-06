import { useEffect, useState } from "react";
import { getStandings } from "../../api";
import Table from "../components/Table";
import "../styles/Teams.css";

export default function Teams() {
  const [standings, setStandings] = useState({
    "Eastern Conference": [],
    "Western Conference": [],
  });

  useEffect(() => {
    async function fetchStandings() {
      const data = await getStandings("2024-25");
      console.log("Dados recebidos no Teams.jsx:", data);
      setStandings(data);
    }
    fetchStandings();
  }, []);

  return (
    <div className="teams-page">
      <h2 className="teams-title">Classificação da NBA 2024-25</h2>
      
      <div className="tables-wrapper">
        <Table 
          title="Eastern Conference" 
          columns={["rank", "team", "wins", "losses"]} 
          data={standings["Eastern Conference"]} 
        />
        
        <Table 
          title="Western Conference" 
          columns={["rank", "team", "wins", "losses"]} 
          data={standings["Western Conference"]} 
        />
      </div>
    </div>
  );
}