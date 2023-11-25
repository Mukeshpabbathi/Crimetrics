// Home.jsx

import React, { useState } from 'react';
import './Home.css'; // Import the external CSS file

function Home() {
  const [tableData, setTableData] = useState(null);
  const [totalCount, setTotalCount] = useState(null);

  const handleButtonClick = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/getNumTuples');

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Invalid response format, expected JSON');
      }

      const data = await response.json();
      setTableData(data);

      // Calculate and set the total count
      const total = Object.values(data).reduce((acc, count) => acc + count, 0);
      setTotalCount(total);
    } catch (error) {
      console.error('Error fetching data:', error.message);
    }
  };

  return (
    <div className="container">
      <label id="count">Count Number of Tuples</label>
      <button className="button" onClick={handleButtonClick}>
        Count
      </button>

      {tableData !== null && (
        <div className="table-container">
          <h2>Number of Tuples in Each Table</h2>
          <table className="table">
            <thead>
              <tr>
                <th>Table Name</th>
                <th>Number of Tuples</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(tableData).map(([tableName, numRows]) => (
                <tr key={tableName}>
                  <td>{tableName}</td>
                  <td>{numRows}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {totalCount !== null && (
        <div className="total-count-container">
          <h2>Total Count</h2>
          <p className="total-count">{totalCount}</p>
        </div>
      )}
    </div>
  );
}

export default Home;
