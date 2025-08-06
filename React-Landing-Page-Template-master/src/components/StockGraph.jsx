import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend);

const StockGraph = ({ symbol, priceHistory }) => {
  const labels = priceHistory.map(entry => entry.date);
  const prices = priceHistory.map(entry => entry.close);

  const data = {
    labels,
    datasets: [
      {
        label: `${symbol} Close`,
        data: prices,
        borderColor: "#5ca9fb",
        backgroundColor: "rgba(92, 169, 251, 0.2)",
        tension: 0.3,
        pointRadius: 0,
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: { mode: "index", intersect: false },
    },
    scales: {
      x: {
        ticks: { color: "#aaa" },
        grid: { color: "rgba(255,255,255,0.1)" },
      },
      y: {
        ticks: { color: "#aaa" },
        grid: { color: "rgba(255,255,255,0.1)" },
      },
    },
  };

  return (
    <div style={{
      background: "rgba(0,0,0,0.6)",
      padding: "20px",
      borderRadius: "12px",
      boxShadow: "0 0 12px rgba(92,169,251,0.4)"
    }}>
      <h3 style={{ color: "#5ca9fb", marginBottom: "10px" }}>{symbol} Price History</h3>
      <Line data={data} options={options} />
    </div>
  );
};

export default StockGraph;
