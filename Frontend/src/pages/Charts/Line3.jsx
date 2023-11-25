import React, { useState, useEffect } from 'react';
import { ChartsHeader, LineChart3 } from '../../components';
import axios from 'axios';
import Select from 'react-select';

const Line3 = () => {
  const [data, setData] = useState([]);
  const [selectedMocodes, setSelectedMocodes] = useState([]);

  const fetchData = () => {
    axios.get('http://localhost:3001/api/Modus-Operandi-Analysis')
      .then(response => {
        setData(response.data);
        console.log('Fetched my data:', response.data);
      })
      .catch(error => console.error(error));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const MocodeOptions = Array.from(new Set(data.map(item => item[0]))).map(mocode => ({
    value: mocode,
    label: mocode,
  }));

console.log(MocodeOptions)
  const handleMocodeChange = selectedOptions => {
    setSelectedMocodes(selectedOptions.map(option => option.value));
  };


  return (
    <div className="m-4 md:m-10 mt-24 p-10 bg-white dark:bg-secondary-dark-bg rounded-3xl">
      <ChartsHeader category="" title="Modus Operandi Analysis" />
      <div className="w-full">
        <Select
          isMulti
          options={MocodeOptions}
          value={MocodeOptions.filter(option => selectedMocodes.includes(option.value))}
          onChange={handleMocodeChange}
          placeholder="Select Mocodes"
        />
        <LineChart3 data={data} selectedMocodes={selectedMocodes} />
      </div>
    </div>
  );
};

export default Line3;
