import React, { useState, useEffect } from 'react';
import StockGraph from "./StockGraph";

export default function Dashboard() {
  const token = localStorage.getItem("token");
  const fullName = localStorage.getItem("full_name") || "User";

  const [watchlist, setWatchlist] = useState([]);
  const [selectedSymbol, setSelectedSymbol] = useState(null);
  const [selectedData, setSelectedData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStocks = async () => {
    setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      alert("Session expired. Please log in again.");
      window.location.href = "/";
      return;
    }
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
      if (res.ok) {
        await fetchStocks();
      } else {
        alert(data.error || "Failed to add stock.");
      }
    } catch (err) {
      alert("Server error while adding stock.");
    }
  };

  const logoUrl = `${process.env.PUBLIC_URL}/img/logo.png`;

  return (
    <div className="dashboard-container">
      <div className="navbar" style={{
        display: 'flex',
        alignItems: 'center',
        padding: '10px 20px',
        backgroundColor: '#111',
        borderBottom: '1px solid rgba(255,255,255,0.1)'
      }}>
        <img src={logoUrl} alt="Logo" className="logo" style={{ height: 32, marginRight: 10 }} />
        <span style={{ fontWeight: "bold", fontSize: "18px", color: "#5ca9fb" }}>SentiStock</span>
      </div>

      <div className="welcome" style={{ color: "#fff", fontSize: "20px", margin: "20px" }}>
        Welcome back, {fullName}
      </div>

      <div className="content" style={{ display: 'flex', gap: '20px', padding: '0 20px' }}>
        {loading ? (
          <div className="loading-screen" style={{ color: '#fff' }}>Loading your dashboard...</div>
        ) : watchlist.length === 0 ? (
          <div className="no-stocks" style={{ color: '#fff' }}>
            <button className="add-stock center" onClick={handleAddStock}>+ Add to Watchlist</button>
          </div>
        ) : (
          <>
            <div className="sidebar" style={{ minWidth: '140px', paddingTop: 10 }}>
              {watchlist.map((w, i) => (
                <div
                  key={i}
                  className={`stock-item ${selectedSymbol === w.symbol ? 'active' : ''}`}
                  onClick={() => setSelectedSymbol(w.symbol)}
                  style={{
                    padding: '8px 12px',
                    marginBottom: '8px',
                    backgroundColor: selectedSymbol === w.symbol ? '#5ca9fb' : '#222',
                    color: selectedSymbol === w.symbol ? '#000' : '#fff',
                    borderRadius: '6px',
                    cursor: 'pointer'
                  }}
                >
                  {w.symbol}
                </div>
              ))}
              <button
                className="add-stock"
                onClick={handleAddStock}
                style={{
                  marginTop: '10px',
                  width: '100%',
                  padding: '8px',
                  backgroundColor: '#5ca9fb',
                  color: '#000',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                + Add Stock
              </button>
            </div>

            <div className="main-view" style={{ flex: 1 }}>
              <div className="graph-box">
                {selectedData?.price_history?.length ? (
                  <StockGraph symbol={selectedData.symbol} priceHistory={selectedData.price_history} />
                ) : <p style={{ color: '#fff' }}>No data available yet.</p>}
              </div>

              {selectedData && (
                <div className="company-info" style={{ marginTop: '20px', color: '#fff' }}>
                  <h3>
                    {selectedData.official_site ? (
                      <a
                        href={selectedData.official_site.startsWith("http") ? selectedData.official_site : `https://${selectedData.official_site}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: "#5ca9fb", textDecoration: "none" }}
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
                    borderLeft: `5px solid ${selectedData.ai_opinion.sentiment === 'positive' ? 'limegreen' : 'red'}`,
                    color: '#fff',
                    borderRadius: '8px'
                  }}
                >
                  <h3 style={{ marginBottom: '10px', color: '#5ca9fb' }}>AI Based Analysis</h3>
                  <div style={{ fontSize: '15px' }}>
                    <strong>Sentiment:</strong>{' '}
                    <span style={{ color: selectedData.ai_opinion.sentiment === 'positive' ? 'limegreen' : 'red' }}>
                      {selectedData.ai_opinion.sentiment}
                    </span>
                  </div>
                  <p style={{ marginTop: '8px' }}>{selectedData.ai_opinion.text}</p>
                </div>
              )}

              {selectedData?.articles?.length > 0 && (
                <div className="articles" style={{ marginTop: '20px' }}>
                  <h3 style={{ color: '#5ca9fb' }}>Latest News</h3>
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
                      <a href={a.url} target="_blank" rel="noopener noreferrer" style={{ color: '#5ca9fb', fontWeight: 'bold' }}>
                        {a.title}
                      </a>
                      <div style={{ fontSize: '13px', marginTop: '4px' }}>
                        <strong>Sentiment:</strong> {a.sentiment}
                      </div>
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
