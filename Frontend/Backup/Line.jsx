// Line.jsx

import React, { useState, useEffect } from 'react';
import { ChartsHeader, LineChart } from '../../components';
import axios from 'axios';

const Line = () => {
  const [data, setData] = useState([]);

  const fetchData = () => {
    axios.get('http://localhost:3001/api/crime-trend-analysis') // Adjust the endpoint to match your server
      .then(response => {
        setData(response.data);
        console.log('Fetched data:', response.data);
      })
      .catch(error => console.error(error));
  };

  useEffect(() => {
    // Fetch data from the API endpoint when the component mounts
    fetchData();
  }, []); // Empty dependency array ensures the effect runs once on mount

  return (
    <div className="m-4 md:m-10 mt-24 p-10 bg-white dark:bg-secondary-dark-bg rounded-3xl">
      <ChartsHeader category="" title="Crime Trend Analysis" />
      <div className="w-full">
        <LineChart data={data} />
      </div>
    </div>
  );
};

export default Line;
