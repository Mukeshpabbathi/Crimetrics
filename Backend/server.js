// server.js

const express = require('express');
const oracledb = require('oracledb');
const cors = require('cors');

const app = express();
const PORT = 3001;

app.use(cors()); // Enable CORS for all routes

// Database connection configuration
const dbConfig = {
  user: 'mukeshpabbathi',
  password: 'j9JTpDLEheWhPVAkQeAfiHnL',
  connectString: 'oracle.cise.ufl.edu:1521/orcl',
};

// API endpoint for fetching data from the database
app.get('/api/data', async (req, res) => {
  try {
    // Establish the Oracle database connection
    const connection = await oracledb.getConnection(dbConfig);

    // Your SQL query to retrieve data from the database
    const query = 'SELECT * FROM VICTIM';
    
    // Execute the query
    const result = await connection.execute(query);

    // Send the result as JSON response
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
app.get('/api/crime-trend-analysis', async (req, res) => {
  try {
    // Establish the Oracle database connection
    const connection = await oracledb.getConnection(dbConfig);

    // Your SQL query
    const query = `
      SELECT
        PJ.areaCode,
        PJ.location AS areaName,
        EXTRACT(YEAR FROM CID.dateOccurred) AS crimeYear,
        COUNT(*) AS crimeCount
      FROM crimeIncidentDetails CID
      JOIN CRIMEJURISDICTION CJ ON CID.crimeID = CJ.crimeID
      JOIN policeJurisdiction PJ ON CJ.policeAreaCode = PJ.areaCode
      WHERE EXTRACT(YEAR FROM CID.dateOccurred) >= EXTRACT(YEAR FROM SYSDATE) - 5
      GROUP BY PJ.areaCode, PJ.location, EXTRACT(YEAR FROM CID.dateOccurred)
      ORDER BY PJ.areaCode, crimeYear
    `;

    // Execute the query
    const result = await connection.execute(query);

    // Send the result as JSON response
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
