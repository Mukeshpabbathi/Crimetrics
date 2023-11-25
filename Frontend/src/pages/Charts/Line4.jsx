import React, { useState, useEffect } from 'react';
import { ChartsHeader, LineChart4 } from '../../components';
import axios from 'axios';
import Select from 'react-select';

const Line4 = () => {
  const [data, setData] = useState([]);
  const [selectedCrimes, setSelectedCrimes] = useState([]);
  const [selectedAgeGroup, setSelectedAgeGroup] = useState([]);


  const fetchData = () => {
    axios.get('http://localhost:3001/api/Age-Distribution-of-Victims')
      .then(response => {
        setData(response.data);
        console.log('Fetched my data:', response.data);
      })
      .catch(error => console.error(error));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const CrimeOptions = Array.from(new Set(data.map(item => item[0]))).map(crimeType => ({
    value: crimeType,
    label: crimeType,
  }));

  const AgeGroupOptions = Array.from(new Set(data.map(item => item[2]))).map(agegroup => ({
    value: agegroup,
    label: agegroup,
  }));

  const handleCrimeChange = selectedOptions => {
    setSelectedCrimes(selectedOptions.map(option => option.value));
  };
  const handleAgeGroupChange = selectedOptions => {
    setSelectedAgeGroup(selectedOptions.value);
  };


  return (
    <div className="m-4 md:m-10 mt-24 p-10 bg-white dark:bg-secondary-dark-bg rounded-3xl">
      <ChartsHeader category="" title="Age Distribution of Victims" />
      <div className="w-full">
        <Select
          isMulti
          options={CrimeOptions}
          value={CrimeOptions.filter(option => selectedCrimes.includes(option.value))}
          onChange={handleCrimeChange}
          placeholder="Select Crimes"
        />
        <Select
          options={AgeGroupOptions}
          //value={selectedSeason}
          onChange={handleAgeGroupChange}
          placeholder="Select Age Group"
        />
        <LineChart4 data={data} selectedCrimes={selectedCrimes} selectedAgeGroup={selectedAgeGroup} />
      </div>
    </div>
  );
};

export default Line4;
