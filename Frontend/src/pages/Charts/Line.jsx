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

  const generateInsights = () => {
    if (selectedAreas.length === 0) {
      return <p>Please select one or more areas to view trend analysis.</p>;
    }
    if (selectedAreas.length === 1) {
      const areaName = selectedAreas[0];
      const areaData = data.filter(item => item[1] === areaName);
  
      const insights = areaData.map(item => (
        <li key={`${areaName}-${item[2]}`}>
          In {item[2]}:
          <ul className="list-disc pl-6 mt-2">
            <li>
              {areaName} had {item[3]} crimes.
            </li>
          </ul>
        </li>
      ));
  
      return (
        <p>
          The line chart above illustrates the crime trend analysis for {areaName} over the past four years. Here are key insights:
          <ul className="list-disc pl-6 mt-2">
            {insights}
          </ul>
        </p>
      );
    }
  
    // Get the years available in the dataset
    const years = Array.from(new Set(data.map(item => item[2])));
  
    const insights = years.map(year => {
      const yearInsights = selectedAreas.map((areaName, index) => {
        const areaData = data.filter(item => item[1] === areaName && item[2] === year);
        const crimeCount = areaData.length > 0 ? areaData[0][3] : 0;
  
        return {
          areaName,
          crimeCount,
        };
      });
  
      const maxCrimeArea = yearInsights.reduce((max, area) => (area.crimeCount > max.crimeCount ? area : max));
      const minCrimeArea = yearInsights.reduce((min, area) => (area.crimeCount < min.crimeCount ? area : min));
  
      return (
        <li key={year}>
          In {year}:
          {/* <ul className="list-disc pl-6 mt-2">
            {yearInsights.map(area => (
              <li key={area.areaName}>
                {area.areaName} had {area.crimeCount} crimes.
              </li>
            ))}
          </ul> */}
          {maxCrimeArea.areaName !== minCrimeArea.areaName && (
            <p>
              {maxCrimeArea.areaName} had the highest crime count, while {minCrimeArea.areaName} had the lowest.
            </p>
          )}
        </li>
      );
    });
  
    return (
      <p>
        The line chart above illustrates the crime trend analysis for the selected areas over the past four years. Each line represents a specific area, and the x-axis corresponds to the years. Here are key insights:
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
      <ChartsHeader category="" title="Crime Trend Analysis" />
      <div className="flex">
        <Select
          isMulti
          options={areaOptions}
          value={areaOptions.filter(option => selectedAreas.includes(option.value))}
          onChange={handleAreaChange}
          placeholder="Select Areas"
          className="mb-4"
          styles={customStyles}
        />
      </div>
      <LineChart data={data} selectedAreas={selectedAreas} />
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">Trend Analysis</h2>
        {generateInsights()}
      </div>

    </div>
  );
};

export default Line;
