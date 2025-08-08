import React, { useState, useEffect } from 'react';
import StockGraph from "./StockGraph";

export default function Dashboard() {
  const token = localStorage.getItem("token");
  const fullName = localStorage.getItem("full_name") || "User";

  const [watchlist, setWatchlist] = useState([]);
  const [selectedSymbol, setSelectedSymbol] = useState(null);
  const [selectedData, setSelectedData] = useState(null);

  useEffect(() => {
    if (!token) {
      alert("Session expired. Please log in again.");
      window.location.href = "/";
      return;
    }

    const fetchStocks = async () => {
      try {
        const res = await fetch("https://sentistock-backend.onrender.com/api/stocks/", {
          headers: { Authorization: `Token ${token}` },
        });
        const data = await res.json();
        if (res.ok && Array.isArray(data)) {
          setWatchlist(data);
          if (data.length > 0) {
            setSelectedSymbol(data[0].symbol);
            setSelectedData(data[0]);
          }
        }
      } catch (err) {
        console.error("Error fetching stocks:", err);
      }
    };

    fetchStocks();
  }, [token]);

  useEffect(() => {
    const selected = watchlist.find(w => w.symbol === selectedSymbol);
    setSelectedData(selected);
  }, [selectedSymbol, watchlist]);

  const handleAddStock = async () => {
    const newStock = prompt('Enter stock ticker:');
    if (!newStock) return;

    try {
      const res = await fetch("https://sentistock-backend.onrender.com/api/stocks/add/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify({ symbol: newStock.toUpperCase() }),
      });
      const data = await res.json();
      if (res.ok) window.location.reload();
      else alert(data.error || "Failed to add stock.");
    } catch (err) {
      alert("Server error while adding stock.");
    }
  };

  return (
    <div className="dashboard-container">
      <div className="navbar">
        <img src="/img/logo.ico" alt="Logo" className="logo" />
        SENTISTOCK
      </div>

      <div className="welcome">Welcome back, {fullName}</div>

      <div className="content">
        {watchlist.length === 0 ? (
          <div className="no-stocks">
            <button className="add-stock center" onClick={handleAddStock}>+ Add to Watchlist</button>
          </div>
        ) : (
          <>
            <div className="sidebar">
              {watchlist.map((w, i) => (
                <div
                  key={i}
                  className={`stock-item ${selectedSymbol === w.symbol ? 'active' : ''}`}
                  onClick={() => setSelectedSymbol(w.symbol)}
                >
                  {w.symbol}
                </div>
              ))}
              <button className="add-stock" onClick={handleAddStock}>+ Add Stock</button>
            </div>

            <div className="main-view">
              <div className="graph-box">
                {selectedData?.price_history?.length ? (
                  <StockGraph symbol={selectedData.symbol} priceHistory={selectedData.price_history} />
                ) : <p>No data available yet.</p>}
              </div>

              {selectedData && (
                <div className="company-info">
                  <h3>
                    {selectedData.official_site ? (
                      <a
                        href={selectedData.official_site.startsWith("http") ? selectedData.official_site : `https://${selectedData.official_site}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {selectedData.name || selectedData.symbol}
                      </a>
                    ) : (
                      selectedData.name || selectedData.symbol
                    )}
                  </h3>
                  <p><strong>Symbol:</strong> {selectedData.symbol}</p>
                  <p><strong>Sector:</strong> {selectedData.sector || "N/A"}</p>
                  <p><strong>Industry:</strong> {selectedData.industry || "N/A"}</p>
                  <p>{selectedData.description || "No description available."}</p>
                </div>
              )}
              
              {selectedData?.ai_opinion && (
                <div
                  className="ai-opinion-box"
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.05)',
                    padding: '15px',
                    marginTop: '20px',
                    borderLeft: `5px solid ${selectedData.ai_sentiment === 'positive' ? 'limegreen' : 'red'}`,
                    color: '#fff',
                    borderRadius: '8px'
                  }}
                >
                  <h3 style={{ margin: 0, color: '#5ca9fb', marginBottom: '10px' }}>AI Based Analysis</h3>
                  <div style={{ fontSize: '15px' }}>
                    <strong>Sentiment:</strong>{' '}
                    <span style={{ color: selectedData.ai_sentiment === 'positive' ? 'limegreen' : 'red' }}>
                      {selectedData.ai_sentiment}
                    </span>
                  </div>
                  <p style={{ marginTop: '8px' }}>{selectedData.ai_opinion}</p>
                </div>
              )}

              {selectedData?.articles?.length > 0 && (
                <div className="articles">
                  <h3>Latest News</h3>
                  {selectedData.articles.map((a, i) => (
                    <div
                      key={i}
                      className="article"
                      style={{
                        borderLeft: `5px solid ${a.sentiment === 'positive' ? 'limegreen' : 'red'}`,
                        padding: '10px',
                        marginBottom: '10px',
                        backgroundColor: 'rgba(255,255,255,0.05)',
                        color: '#fff'
                      }}
                    >
                      <a href={a.url} target="_blank" rel="noopener noreferrer" style={{ color: '#5ca9fb', fontWeight: 'bold' }}>{a.title}</a>
                      <div style={{ fontSize: '13px', marginTop: '4px' }}><strong>Sentiment:</strong> {a.sentiment}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
