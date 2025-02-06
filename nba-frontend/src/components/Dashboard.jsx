import { useState } from "react";
import "../styles/Dashboard.css";

export default function Dashboard() {
  const [season, setSeason] = useState("2024-2025");

  const charts = {
    "2023-2024": [
      "assets/home_away_wins_losses_by_month_chart.html",
      "assets/points_radar_chart.html",
      "assets/points_scatter_chart.html",
      "assets/rf6_metrics_chart_lines.html",
      "assets/rf7_results_chart_bars.html",
      "assets/streak_line_chart.html",
      "assets/wins_losses_by_month_chart.html",
      "assets/wins_losses_histogram.html",
      "assets/wins_pie_chart.html",
    ],
    "2024-2025": [
      "assets/24-25/home_away_wins_losses_by_month_chart.html",
      "assets/24-25/points_radar_chart.html",
      "assets/24-25/points_scatter_chart.html",
      "assets/24-25/rf6_metrics_chart_lines.html",
      "assets/24-25/rf7_results_chart_bars.html",
      "assets/24-25/streak_line_chart.html",
      "assets/24-25/wins_losses_by_month_chart.html",
      "assets/24-25/wins_losses_histogram.html",
      "assets/24-25/wins_pie_chart.html",
    ],
  };

  return (
    <div className="dashboard">
      <h2>New York Knicks - Estatísticas</h2>
      <div className="season-selector">
        <button 
          className={season === "2024-2025" ? "active" : ""}
          onClick={() => setSeason("2024-2025")}
        >
          2024-2025
        </button>
        <button 
          className={season === "2023-2024" ? "active" : ""}
          onClick={() => setSeason("2023-2024")}
        >
          2023-2024
        </button>
      </div>

      <div className="charts-container">
        {charts[season].map((chart, index) => (
          <iframe 
            key={index}
            src={`/${chart}`} 
            className="chart-iframe"
            title={`chart-${index}`}
          />
        ))}
      </div>
    </div>
  );
}
