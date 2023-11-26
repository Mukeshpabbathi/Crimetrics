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

  const handleMocodeChange = selectedOptions => {
    setSelectedMocodes(selectedOptions.map(option => option.value));
  };

  const generateMocodeInsights = () => {
    if (selectedMocodes.length === 0) {
      return <p>Please select one or more Mocodes to view analysis.</p>;
    }
  
    if (selectedMocodes.length === 1) {
      const singleMocode = selectedMocodes[0];
      const singleMocodeData = data.filter(item => item[0] === singleMocode);
  
      const singleMocodeInsights = singleMocodeData.map(item => {
        const year = item[1];
        const crimeCount = item[2];
  
        return (
          <li key={`${singleMocode}-${year}`}>
            In {year}, the crime count for Mocode {singleMocode} was {crimeCount}. {/* Customize this based on your data structure */}
          </li>
        );
      });
  
      return (
        <p>
          The line chart above illustrates the Modus Operandi analysis for {singleMocode}. Here are key insights:
          <ul className="list-disc pl-6 mt-2">
            {singleMocodeInsights}
          </ul>
        </p>
      );
    }
  
    // If multiple Mocodes are selected, provide comparisons
    const years = Array.from(new Set(data.map(item => item[1])));
    const insights = years.map(year => {
      const yearInsights = selectedMocodes.map((mocode, index) => {
        const mocodeData = data.filter(item => item[0] === mocode && item[1] === year);
        const crimeCount = mocodeData.length > 0 ? mocodeData[0][2] : 0;
  
        return {
          mocode,
          crimeCount,
        };
      });
  
      const maxCrimeMocode = yearInsights.reduce((max, mocode) => (mocode.crimeCount > max.crimeCount ? mocode : max));
      const minCrimeMocode = yearInsights.reduce((min, mocode) => (mocode.crimeCount < min.crimeCount ? mocode : min));
  
      return (
        <li key={year}>
          In {year}:
          {maxCrimeMocode.mocode !== minCrimeMocode.mocode && (
            <p>
              {maxCrimeMocode.mocode} had the highest crime count, while  {minCrimeMocode.mocode} had the lowest.
            </p>
          )}
        </li>
      );
    });
  
    return (
      <p>
        The line chart above illustrates the Modus Operandi analysis for the selected Mocodes over the past years. Here are key insights:
        <ul className="list-disc pl-6 mt-2">
          {insights}
        </ul>
      </p>
    );
  };
  

  const customStyles = {
    control: (provided) => ({
      ...provided,
      width: 400, // Adjust the width as needed
    }),
  };

  return (
    <div className="m-4 md:m-10 mt-24 p-10 bg-white dark:bg-secondary-dark-bg rounded-3xl">
      <ChartsHeader category="" title="Modus Operandi Analysis" />
      <div className="flex">
        <Select
          isMulti
          options={MocodeOptions}
          value={MocodeOptions.filter(option => selectedMocodes.includes(option.value))}
          onChange={handleMocodeChange}
          placeholder="Select Mocodes"
          className="mb-4"
          styles={customStyles}
        />
      </div>
      <LineChart3 data={data} selectedMocodes={selectedMocodes} />
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">Mocode Analysis</h2>
        {generateMocodeInsights()}
      </div>
    </div>
  );
};

export default Line3;
