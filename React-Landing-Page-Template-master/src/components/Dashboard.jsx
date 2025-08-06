import React, { useState, useEffect } from 'react';
import StockGraph from "./StockGraph";

export default function Dashboard() {
  const token = localStorage.getItem("token");
  const fullName = localStorage.getItem("full_name") || "User";

  const [watchlist, setWatchlist] = useState([]);
  const [selectedStock, setSelectedStock] = useState(null);
  const [companyData, setCompanyData] = useState(null);

  const dummyArticles = [
    'Abbas Accidentally Buys 100 Shares of Nvidia Thinking It Was Netflix',
    'Mustafa Tells Everyone to Sell Apple, Then Buys It Himself an Hour Later',
    'Mohammad Tries to Short Tesla, Ends Up Shorting His Sleep Schedule Instead',
    'Sakina STEALS Abbas’s Robinhood Login and Buys Amazon Stock “for the culture”'
  ];

  useEffect(() => {
    if (!token) {
      alert("Session expired. Please log in again.");
      window.location.href = "/";
      return;
    }

    const fetchStocks = async () => {
      try {
        const res = await fetch("https://sentistock-backend.onrender.com/api/stocks/", {
          headers: {
            Authorization: `Token ${token}`,
          },
        });

        const data = await res.json();

        if (res.ok && Array.isArray(data)) {
          setWatchlist(data);
          if (data.length > 0) {
            setSelectedStock(data[0].stock.symbol);
            setCompanyData(data[0].stock);
          }
        } else {
          console.error("Watchlist fetch error:", data);
        }
      } catch (err) {
        console.error("Error fetching watchlist:", err);
      }
    };

    fetchStocks();
  }, [token]);

  useEffect(() => {
    const selected = watchlist.find(w => w.stock.symbol === selectedStock);
    if (selected) {
      setCompanyData(selected.stock);
    }
  }, [selectedStock, watchlist]);

  const handleAddStock = async () => {
    const newStock = prompt('Enter stock ticker:');
    if (!newStock) return;

    const symbol = newStock.toUpperCase();

    try {
      const res = await fetch("https://sentistock-backend.onrender.com/api/stocks/add/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify({ symbol }),
      });

      const data = await res.json();

      if (res.ok) {
        window.location.reload();
      } else {
        alert(data.error || "Failed to add stock.");
      }
    } catch (err) {
      console.error("Error adding stock:", err);
      alert("Server error while adding stock.");
    }
  };

  return (
    <div className="dashboard-container">
      <div className="navbar" style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "10px",
        fontWeight: "bold",
        fontSize: "24px",
        paddingLeft: "20px",
        color: "#fff"
      }}>
        <img src="/img/logo.ico" alt="Logo" style={{ height: "28px", marginRight: "5px" }} />
        SENTISTOCK
      </div>

      <div className="welcome">Welcome back, {fullName}</div>

      <div className="content">
        {watchlist.length === 0 ? (
          <div className="no-stocks" style={{ textAlign: "center", marginTop: "100px" }}>
            <button className="add-stock center" onClick={handleAddStock}>
              + Add to Watchlist
            </button>
          </div>
        ) : (
          <>
            <div className="sidebar">
              {watchlist.map((w, i) => (
                <div
                  key={i}
                  className={`stock-item ${selectedStock === w.stock.symbol ? 'active' : ''}`}
                  onClick={() => setSelectedStock(w.stock.symbol)}
                >
                  {w.stock.symbol}
                </div>
              ))}
              <button className="add-stock" onClick={handleAddStock}>
                + Add Stock
              </button>
            </div>

            <div className="main-view">
              <div className="graph-box">
                {companyData?.price_history?.length > 0 ? (
                  <StockGraph symbol={companyData.symbol} priceHistory={companyData.price_history} />
                ) : (
                  <p style={{ color: "#fff" }}>No data available yet.</p>
                )}
              </div>

              {companyData && (
                <div className="company-info" style={{ marginTop: "20px", color: "#fff" }}>
                  <h3 style={{ marginBottom: "10px" }}>
                    {companyData.official_site ? (
                      <a
                        href={companyData.official_site.startsWith("http") ? companyData.official_site : `https://${companyData.official_site}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: "#5ca9fb", textDecoration: "none" }}
                      >
                        {companyData.name || companyData.symbol}
                      </a>
                    ) : (
                      companyData.name || companyData.symbol
                    )}
                  </h3>
                  <p><strong>Symbol:</strong> {companyData.symbol}</p>
                  <p><strong>Sector:</strong> {companyData.sector || "N/A"}</p>
                  <p><strong>Industry:</strong> {companyData.industry || "N/A"}</p>
                  <p style={{ marginTop: "10px" }}>{companyData.description || "No description available."}</p>
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
