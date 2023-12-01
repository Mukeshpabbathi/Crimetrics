// server.js

const express = require('express');
const oracledb = require('oracledb');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3001;

app.use(cors()); // Enable CORS for all routes
app.use(bodyParser.json());

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
  const connection = await oracledb.getConnection(dbConfig);
  try {
    // Establish the Oracle database connection
    // Your SQL query
    const query = `
      SELECT
        PJ.areaCode,
        PJ.location AS areaName,
        EXTRACT(YEAR FROM CID.dateOccurred) AS crimeYear,
        COUNT(*) AS crimeCount
      FROM 
        crimeIncidentDetails CID
      JOIN CRIMEJURISDICTION CJ ON CID.crimeID = CJ.crimeID
      JOIN policeJurisdiction PJ ON CJ.policeAreaCode = PJ.areaCode
      WHERE 
        EXTRACT(YEAR FROM CID.dateOccurred) >= EXTRACT(YEAR FROM SYSDATE) - 5
      GROUP BY 
        PJ.areaCode, PJ.location, EXTRACT(YEAR FROM CID.dateOccurred)
      ORDER BY 
        PJ.areaCode, crimeYear
    `;

    // Execute the query
    const result = await connection.execute(query);

    // Send the result as JSON response
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }finally {
    // Close the database connection in the finally block to ensure it is closed regardless of success or failure
    if (connection) {
      try {
        await connection.close();
      } catch (error) {
        console.error(error);
      }
    }
  }
});

app.get('/api/seasonal-crime-patterns', async (req, res) => {
  const connection = await oracledb.getConnection(dbConfig);
  try {
    // Establish the Oracle database connection
    // Your SQL query
    const query = `
    SELECT
          EXTRACT(YEAR FROM dateOccurred) AS crimeYear,
          CASE
              WHEN EXTRACT(MONTH FROM dateOccurred) IN (12, 1, 2) THEN 'Winter'
              WHEN EXTRACT(MONTH FROM dateOccurred) BETWEEN 3 AND 5 THEN 'Spring'
              WHEN EXTRACT(MONTH FROM dateOccurred) BETWEEN 6 AND 8 THEN 'Summer'
              WHEN EXTRACT(MONTH FROM dateOccurred) BETWEEN 9 AND 11 THEN 'Fall'
          END AS season,
          c.description AS crimeType,
          COUNT(*) AS crimeCount
      FROM
          crimeIncidentDetails cid
          JOIN CRIMECOMMITTED cc ON cid.crimeID = cc.crimeID
          JOIN crime c ON cc.crimeCode = c.crimeCode
      GROUP BY
          EXTRACT(YEAR FROM dateOccurred),
          CASE
              WHEN EXTRACT(MONTH FROM dateOccurred) IN (12, 1, 2) THEN 'Winter'
              WHEN EXTRACT(MONTH FROM dateOccurred) BETWEEN 3 AND 5 THEN 'Spring'
              WHEN EXTRACT(MONTH FROM dateOccurred) BETWEEN 6 AND 8 THEN 'Summer'
              WHEN EXTRACT(MONTH FROM dateOccurred) BETWEEN 9 AND 11 THEN 'Fall'
          END,
          c.description
      ORDER BY
          crimeYear, crimeType
    `;

    // Execute the query
    const result = await connection.execute(query);

    // Send the result as JSON response
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }finally {
    // Close the database connection in the finally block to ensure it is closed regardless of success or failure
    if (connection) {
      try {
        await connection.close();
      } catch (error) {
        console.error(error);
      }
    }
  }
});

app.post('/api/login', async (req, res) => {
  const connection = await oracledb.getConnection(dbConfig);
  const { email, password } = req.body;
  try {
    // Establish the Oracle database connection


    // Check if the user exists
    const checkUserQuery = 'SELECT * FROM userdetails WHERE EMAIL = :email';
    
    const checkUserResult = await connection.execute(checkUserQuery, { email });

    if (checkUserResult.rows.length > 0) {
      // User exists, proceed with login
      const loginUserQuery = 'SELECT * FROM userdetails WHERE EMAIL = :email AND password = :password';
      const loginUserResult = await connection.execute(loginUserQuery, { email, password });

      if (loginUserResult.rows.length > 0) {
        // User is authenticated
        res.status(200).json({ message: 'Authentication successful', user: loginUserResult.rows[0] });
      } else {
        // Invalid password
        res.status(401).json({ message: 'Invalid password' });
      }
    } else {

      // User doesn't exist, create a new record and login
      const createUserQuery = 'INSERT INTO USERDETAILS VALUES (:email, :password)';
      await connection.execute(createUserQuery, { email, password });
      await connection.commit();

      // Fetch the newly created user for response
      const newUserQuery = 'SELECT * FROM USERDETAILS WHERE email = :email';
      const newUserResult = await connection.execute(newUserQuery, { email });

      res.status(200).json({ message: 'User created and authenticated', user: newUserResult.rows[0] });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }finally {
    // Close the database connection in the finally block to ensure it is closed regardless of success or failure
    if (connection) {
      try {
        await connection.close();
      } catch (error) {
        console.error(error);
      }
    }
  }
});
app.get('/api/getNumTuples', async (req, res) => {
  const connection = await oracledb.getConnection(dbConfig);
  try {
    // Establish the Oracle database connection

    const totalCountQuery = `
    SELECT 
        SUM(tableRecords) as totalRecords 
    FROM
    (
    SELECT  
        TABLE_NAME, NUM_ROWS as tablerecords
    FROM 
        ALL_TAB_STATISTICS
    WHERE 
        OWNER = 'MUKESHPABBATHI'
    )
    `;
    const totalCountResult = await connection.execute(totalCountQuery);
    console.log(totalCountResult.rows[0][0]);

    // // List of specific tables you want to count rows for
    // const targetTables = ['CRIME', 'CRIMECOMMITTED', 'CRIMEINCIDENTDETAILS', 'CRIMEJURISDICTION', 'CRIMEMODUSOPERANDI', 'MODUSOPERANDI', 'PARTIESINVOLVED', 'POLICEJURISDICTION', 'PREMISES', 'SUSPECT', 'VICTIM', 'WEAPON','WEAPONUSEDINCRIME'];

    // // Initialize an object to store table names and row counts
    // const tableRowCounts = {};

    // // Iterate through specified tables and get row counts
    // for (const tableName of targetTables) {
    //   const countQuery = `SELECT COUNT(*) AS numRows FROM ${tableName}`;
    //   const countResult = await connection.execute(countQuery);
      
    //   // Store the table name and row count in the object
    //   tableRowCounts[tableName] = countResult.rows[0][0];
    // }
    // console.log(tableRowCounts);

    // Send the result as JSON response
    res.json(totalCountResult.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }finally {
    // Close the database connection in the finally block to ensure it is closed regardless of success or failure
    if (connection) {
      try {
        await connection.close();
      } catch (error) {
        console.error(error);
      }
    }
  }
});


app.get('/api/Modus-Operandi-Analysis', async (req, res) => {
  const connection = await oracledb.getConnection(dbConfig);
  try {
    // Establish the Oracle database connection

    // Your SQL query
    const query = `   
      SELECT 
          MO.description,
          EXTRACT(YEAR FROM CID.dateOccurred) as Year,
          COUNT(CMO.mocode) AS MO_USED
      FROM 
          MODUSOPERANDI MO
      JOIN
          CRIMEMODUSOPERANDI CMO ON CMO.mocode = MO.mocode
      JOIN
          CRIMEINCIDENTDETAILS CID ON CID.crimeID = CMO.crimeID
      WHERE 
          MO.mocode IN 
      (SELECT 
          MO.mocode
      FROM 
          MODUSOPERANDI MO 
      JOIN
          CRIMEMODUSOPERANDI CMO ON CMO.mocode = MO.mocode
      GROUP BY 
          MO.mocode 
      ORDER BY 
          COUNT(MO.description) DESC 
      FETCH FIRST 30 ROWS ONLY
      )
      GROUP BY 
          EXTRACT(YEAR FROM CID.dateOccurred),
          MO.description
      ORDER BY
          Year,MO_USED
    `;
    // Execute the query
    const result = await connection.execute(query);
    // Send the result as JSON response
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }finally {
    // Close the database connection in the finally block to ensure it is closed regardless of success or failure
    if (connection) {
      try {
        await connection.close();
      } catch (error) {
        console.error(error);
      }
    }
  }
});


app.get('/api/Age-Distribution-of-Victims', async (req, res) => {
  const connection = await oracledb.getConnection(dbConfig);
  try {
    // Establish the Oracle database connection

    // Your SQL query
    const query = `   
    SELECT
        C.description AS crimetype,
        EXTRACT(YEAR FROM CID.dateOccurred) AS year,
        CASE
            WHEN V.age BETWEEN 1 AND 12 THEN 'Kids(1_12)'
            WHEN V.age BETWEEN 13 AND 19 THEN 'Teenage(13_19)'
            WHEN V.age BETWEEN 20 AND 40 THEN 'Youth(20_40)'
            WHEN V.age BETWEEN 41 AND 60 THEN 'Middle Age(41_60)'
            WHEN V.age > 60 THEN 'Elderly(>60)'
            ELSE 'Unknown Age group'
        END as ageGroup,
        COUNT(*) as crimeCount
    FROM
        CRIMEINCIDENTDETAILS CID 
    JOIN
        PARTIESINVOLVED P ON CID.crimeID = P.crimeID
    JOIN
        VICTIM V ON P.victimID = V.victimID
    JOIN
        crimecommitted CC ON CID.crimeID = CC.crimeID 
    JOIN
        crime C ON CC.crimeCode = C.crimeCode
    GROUP BY
        C.description, EXTRACT(YEAR FROM CID.dateOccurred),
        CASE
            WHEN V.age BETWEEN 1 AND 12 THEN 'Kids(1_12)'
            WHEN V.age BETWEEN 13 AND 19 THEN 'Teenage(13_19)'
            WHEN V.age BETWEEN 20 AND 40 THEN 'Youth(20_40)'
            WHEN V.age BETWEEN 41 AND 60 THEN 'Middle Age(41_60)'
            WHEN V.age > 60 THEN 'Elderly(>60)'
            ELSE 'Unknown Age group'
        END
    ORDER BY
        C.description, EXTRACT(YEAR FROM CID.dateOccurred)
    `;
    // Execute the query
    const result = await connection.execute(query);
    // Send the result as JSON response
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }finally {
    // Close the database connection in the finally block to ensure it is closed regardless of success or failure
    if (connection) {
      try {
        await connection.close();
      } catch (error) {
        console.error(error);
      }
    }
  }
});

app.get('/api/Crime-Severity-Assessment', async (req, res) => {
  const connection = await oracledb.getConnection(dbConfig);

  try {
    // Establish the Oracle database connection
    // Your SQL query
    const query = `   
    SELECT 
        CODEWISEDATA.*,
        PJ.division,
        C.description
    FROM 
    (SELECT          
        crimeCode,
        policeAreaCode 
    FROM     
    ( 
    SELECT          
        COUNT(DISTINCT CC.crimeId) AS crimeCount, 
        CC.crimeCode, 
        CJ.policeAreaCode,
        ROW_NUMBER() OVER (PARTITION BY CJ.policeAreaCode
        ORDER BY COUNT(CC.crimeId) DESC) AS crimeRank
    FROM            
        CRIMECOMMITTED CC
    JOIN            
        CRIMEJURISDICTION CJ ON CC.crimeId = CJ.crimeId
    GROUP BY        
        CC.crimeCode, CJ.policeAreaCode 
    )
    WHERE  
        crimeRank <= 5
    ORDER BY        
        policeAreaCode,crimeCount DESC 
    ) TOPCRIMECODES
    JOIN    
    (SELECT          
        CC.crimeCode,
        EXTRACT(YEAR FROM C.dateOccurred) AS YEAR,
        CJ.policeAreaCode,
        COUNT(DISTINCT CC.crimeId) AS crimeCount
    FROM            
        CRIMECOMMITTED CC
    JOIN            
        CRIMEJURISDICTION CJ ON CC.crimeId = CJ.crimeId
    JOIN            
        CRIMEINCIDENTDETAILS C ON CC.crimeId = C.crimeId
    GROUP BY        
        CC.crimeCode, CJ.policeAreaCode,EXTRACT(YEAR FROM C.dateOccurred)
    ORDER BY        
        CJ.policeAreaCode,EXTRACT(YEAR FROM C.dateOccurred),crimeCount DESC 
    ) CODEWISEDATA ON TOPCRIMECODES.crimeCode = CODEWISEDATA.crimeCode
    AND TOPCRIMECODES.policeAreaCode = CODEWISEDATA.policeAreaCode
    JOIN 
        CRIME C ON TOPCRIMECODES.crimeCode = C.crimeCode
    JOIN
        POLICEJURISDICTION PJ ON PJ.areacode = CODEWISEDATA.policeAreaCode
    ORDER BY  
        CODEWISEDATA.policeAreaCode, CODEWISEDATA.crimeCode,
        CODEWISEDATA.year, CODEWISEDATA.crimeCount DESC
    `;
    // Execute the query
    const result = await connection.execute(query);
    // Send the result as JSON response
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }finally {
    // Close the database connection in the finally block to ensure it is closed regardless of success or failure
    if (connection) {
      try {
        await connection.close();
      } catch (error) {
        console.error(error);
      }
    }
  }
});

app.get('/api/Law-Enforcement-Performance-Ratio', async (req, res) => {
  const connection = await oracledb.getConnection(dbConfig);

  try {
    // Establish the Oracle database connection
    // Your SQL query
    const query = `   
    SELECT 
        SUM(A.UNSOLVED) AS UNSOLVED, 
        SUM(A.SOLVED) AS SOLVED, 
        A.policeareacode, 
        PJ.division, 
        A.YEAR, 
        ROUND(SUM(A.SOLVED)/SUM(A.UNSOLVED)*100,2) AS PERFORMANCE
    FROM
    (
    SELECT 
      COUNT(DISTINCT CASE WHEN CID.STATUS NOT LIKE '%Invest Cont%' THEN CID.Crimeid END) AS SOLVED,
      COUNT(DISTINCT CASE WHEN CID.STATUS LIKE '%Invest Cont%' THEN CID.Crimeid END) AS UNSOLVED,
      CJ.policeareacode,
      EXTRACT(YEAR FROM CID.DATEOCCURRED) AS YEAR
    FROM 
      crimeincidentdetails CID
    JOIN 
      CRIMEJURISDICTION CJ ON CJ.crimeid = CID.crimeid
    GROUP BY 
      CID.status, CJ.policeareacode,EXTRACT(YEAR FROM CID.DATEOCCURRED)
    ) A
    JOIN 
        policeJurisdiction  PJ ON A.policeareacode = PJ.AREACODE
    GROUP BY 
        A.policeareacode, PJ.division, A.YEAR
    ORDER BY 
        A.policeareacode, A.YEAR
    `;
    // Execute the query
    const result = await connection.execute(query);
    // Send the result as JSON response
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }finally {
    // Close the database connection in the finally block to ensure it is closed regardless of success or failure
    if (connection) {
      try {
        await connection.close();
      } catch (error) {
        console.error(error);
      }
    }
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
