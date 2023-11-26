import React, { useState, useEffect } from 'react';
import { ChartsHeader, LineChart2 } from '../../components';
import axios from 'axios';
import Select from 'react-select';

const Line3 = () => {
  const [data, setData] = useState([]);
  const [selectedcrimecode, setSelectedcrimecode] = useState([]);

  const fetchData = () => {
    axios.get('http://localhost:3001/api/crimecategory')
      .then(response => {
        setData(response.data);
        console.log('Fetched my data:', response.data);
      })
      .catch(error => console.error(error));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const crimecount = Array.from(new Set(data.map(item => item[0]))).map(crimecount => ({
    value: crimecount,
    label: crimecount,
  }));
  console.log(crimecount)

  const handlecrimecodeChange = selectedOptions => {
    setSelectedcrimecode(selectedOptions.map(option => option.value));
  };
  const customStyles = {
    control: (provided) => ({
      ...provided,
      width: 400, // Adjust the width as needed
    }),
  };


  return (
    <div className="m-4 md:m-10 mt-24 p-10 bg-white dark:bg-secondary-dark-bg rounded-3xl">
      <ChartsHeader category="" title="Crime Category Analysis" />
      <div className="flex">
        <Select
          isMulti
          options={crimecount}
          value={crimecount.filter(option => selectedcrimecode.includes(option.value))}
          onChange={handlecrimecodeChange}
          placeholder="Select CrimeCode"
          className="mb-4"
          styles={customStyles}
        />
      </div>
      <LineChart2 data={data} selectedcrimecode={selectedcrimecode} />

    </div>
  );
};

export default Line3;
