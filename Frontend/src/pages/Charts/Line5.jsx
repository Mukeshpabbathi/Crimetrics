import React, { useState, useEffect } from 'react';
import { ChartsHeader, LineChart5 } from '../../components';
import axios from 'axios';
import Select from 'react-select';

const Line5 = () => {
  const [data, setData] = useState([]);
  const [selectedCrimes, setSelectedCrimes] = useState([]);
  const [selectedSeason, setSelectedSeason] = useState([]);


  const fetchData = () => {
    axios.get('http://localhost:3001/api/Seasonal-Crime-Patterns')
      .then(response => {
        setData(response.data);
        console.log('Fetched my data:', response.data);
      })
      .catch(error => console.error(error));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const CrimeOptions = Array.from(new Set(data.map(item => item[2]))).map(crimeType => ({
    value: crimeType,
    label: crimeType,
  }));

  const SeasonOptions = Array.from(new Set(data.map(item => item[1]))).map(season => ({
    value: season,
    label: season,
  }));

  const handleCrimeChange = selectedOptions => {
    setSelectedCrimes(selectedOptions.map(option => option.value));
  };
  const handleSeasonChange = selectedOptions => {
    setSelectedSeason(selectedOptions.value);
  };


  return (
    <div className="m-4 md:m-10 mt-24 p-10 bg-white dark:bg-secondary-dark-bg rounded-3xl">
      <ChartsHeader category="" title="Seasonal Crime Patterns" />
      <div className="w-full">
        <Select
          isMulti
          options={CrimeOptions}
          value={CrimeOptions.filter(option => selectedCrimes.includes(option.value))}
          onChange={handleCrimeChange}
          placeholder="Select Crimes"
        />
        <Select
          options={SeasonOptions}
          //value={selectedSeason}
          onChange={handleSeasonChange}
          placeholder="Select Season"
        />
        <LineChart5 data={data} selectedCrimes={selectedCrimes} selectedSeason={selectedSeason} />
      </div>
    </div>
  );
};

export default Line5;
