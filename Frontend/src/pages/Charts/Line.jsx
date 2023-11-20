import React, { useState, useEffect } from 'react';
import { ChartsHeader, LineChart } from '../../components';
import axios from 'axios';
import Select from 'react-select';

const Line = () => {
  const [data, setData] = useState([]);
  const [selectedAreas, setSelectedAreas] = useState([]);

  const fetchData = () => {
    axios.get('http://localhost:3001/api/crime-trend-analysis')
      .then(response => {
        setData(response.data);
        console.log('Fetched data:', response.data);
      })
      .catch(error => console.error(error));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const areaOptions = Array.from(new Set(data.map(item => item[1]))).map(areaName => ({
    value: areaName,
    label: areaName,
  }));

  const handleAreaChange = selectedOptions => {
    setSelectedAreas(selectedOptions.map(option => option.value));
  };

  return (
    <div className="m-4 md:m-10 mt-24 p-10 bg-white dark:bg-secondary-dark-bg rounded-3xl">
      <ChartsHeader category="" title="Crime Trend Analysis" />
      <div className="w-full">
        <Select
          isMulti
          options={areaOptions}
          value={areaOptions.filter(option => selectedAreas.includes(option.value))}
          onChange={handleAreaChange}
          placeholder="Select Areas"
        />
        <LineChart data={data} selectedAreas={selectedAreas} />
      </div>
    </div>
  );
};

export default Line;
