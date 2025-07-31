import React, { useState, useEffect } from 'react';

const fullName = localStorage.getItem("full_name") || "User";
const token = localStorage.getItem("token");

const dummyArticles = [
  'Abbas Accidentally Buys 100 Shares of Nvidia Thinking It Was Netflix',
  'Mustafa Tells Everyone to Sell Apple, Then Buys It Himself an Hour Later',
  'Mohammad Tries to Short Tesla, Ends Up Shorting His Sleep Schedule Instead',
  'Sakina STEALS Abbas’s Robinhood Login and Buys Amazon Stock “for the culture”'
];

export default function Dashboard() {
  const [stocks, setStocks] = useState([]);
  const [selectedStock, setSelectedStock] = useState(null);
  const [companyData, setCompanyData] = useState(null);

  
  useEffect(() => {
    const fetchWatchlist = async () => {
      try {
        const res = await fetch("https://sentistock-backend.onrender.com/api/watchlist/", {
          headers: {
            Authorization: `Token ${token}`,
          },
        });

        const data = await res.json();
        if (res.ok && Array.isArray(data)) {
          const stockSymbols = data.map((item) => item.symbol);
          setStocks(stockSymbols);
          if (stockSymbols.length > 0) {
            setSelectedStock(stockSymbols[0]);
          }
        } else {
          console.error("Watchlist fetch error:", data);
        }
      } catch (err) {
        console.error("Error fetching watchlist:", err);
      }
    };

    fetchWatchlist();
  }, []);

  
  useEffect(() => {
    if (!selectedStock) return;

    const fetchCompanyData = async () => {
      try {
        const res = await fetch(`https://sentistock-backend.onrender.com/api/company/${selectedStock}/`, {
          headers: {
            Authorization: `Token ${token}`,
          },
        });

        const data = await res.json();
        if (res.ok) setCompanyData(data);
        else console.error("Company not found:", data);
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };

    fetchCompanyData();
  }, [selectedStock]);

  
  const handleAddStock = async () => {
    const newStock = prompt('Enter stock ticker:');
    if (!newStock) return;

    const symbol = newStock.toUpperCase();

    try {
      const res = await fetch("https://sentistock-backend.onrender.com/api/watchlist/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify({ symbol }),
      });

      const data = await res.json();
      if (res.ok) {
        setStocks((prev) => [...prev, symbol]);
        setSelectedStock(symbol);
      } else {
        alert(data.error || "Failed to add stock.");
      }
    } catch (err) {
      console.error("Error adding stock:", err);
    }
  };

  return (
    <div className="dashboard-container">
      <div className="navbar">SENTISTOCK</div>
      <div className="welcome">Welcome back, {fullName}</div>

      <div className="content">
        {stocks.length === 0 ? (
          <div className="no-stocks" style={{ textAlign: "center", marginTop: "100px" }}>
            <button className="add-stock center" onClick={handleAddStock}>
              + Add to Watchlist
            </button>
          </div>
        ) : (
          <>
            <div className="sidebar">
              {stocks.map((stock, i) => (
                <div
                  key={i}
                  className={`stock-item ${selectedStock === stock ? 'active' : ''}`}
                  onClick={() => setSelectedStock(stock)}
                >
                  {stock}
                </div>
              ))}
              <button className="add-stock" onClick={handleAddStock}>
                + Add Stock
              </button>
            </div>

            <div className="main-view">
              <div className="graph-box">[Graph for {selectedStock}]</div>

              {companyData && (
                <div className="company-info" style={{ marginTop: "20px", color: "#fff" }}>
                  <h3 style={{ marginBottom: "10px" }}>
                    <a
                      href={companyData.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: "#5ca9fb", textDecoration: "none" }}
                    >
                      {companyData.name}
                    </a>
                  </h3>
                  <p><strong>Symbol:</strong> {companyData.symbol}</p>
                  <p><strong>Sector:</strong> {companyData.sector}</p>
                  <p><strong>Industry:</strong> {companyData.industry}</p>
                  <p style={{ marginTop: "10px" }}>{companyData.description}</p>
                </div>
              )}

              <div className="articles" style={{ marginTop: "30px" }}>
                {dummyArticles.map((text, i) => (
                  <div key={i} className="article">{text}</div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
