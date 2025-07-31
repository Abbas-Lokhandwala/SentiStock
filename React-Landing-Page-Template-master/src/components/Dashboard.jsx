import React, { useState } from 'react';

const dummyStocks = ['AAPL', 'TSLA', 'MSFT', 'NVDA', 'GOOGL'];
const dummyArticles = [
  'Abbas Accidentally Buys 100 Shares of Nvidia Thinking It Was Netflix',
  'Mustafa Tells Everyone to Sell Apple, Then Buys It Himself an Hour Later',
  'Mohammad Tries to Short Tesla, Ends Up Shorting His Sleep Schedule Instead',
  'Sakina STEALS Abbas’s Robinhood Login and Buys Amazon Stock “for the culture”'
];

export default function Dashboard() {
  const [selectedStock, setSelectedStock] = useState(dummyStocks[0]);
  const [stocks, setStocks] = useState(dummyStocks);

  const handleAddStock = () => {
    const newStock = prompt('Enter stock ticker:');
    if (newStock) setStocks([...stocks, newStock.toUpperCase()]);
  };

  return (
    <div className="dashboard-container">
      <div className="navbar">SENTISTOCK</div>
      <div className="welcome">Welcome back, Joe</div>

      <div className="content">
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
          <button className="add-stock" onClick={handleAddStock}>+ Add Stock</button>
        </div>

        <div className="main-view">
          {stocks.length > 0 ? (
            <>
              <div className="graph-box">[Graph for {selectedStock}]</div>
              <div className="articles">
                {dummyArticles.map((text, i) => (
                  <div key={i} className="article">{text}</div>
                ))}
              </div>
            </>
          ) : (
            <div className="no-stocks">
              <button className="add-stock center" onClick={handleAddStock}>+ Add Stock</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
