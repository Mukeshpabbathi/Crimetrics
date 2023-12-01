import React, { useState, useEffect } from 'react';
import { ChartsHeader, LineChart6 } from '../../components';
import axios from 'axios';
import Select from 'react-select';

const Line6 = () => {
  const [data, setData] = useState([]);
  const [selectedareacode, setSelectedareacode] = useState([]);

  const fetchData = () => {
    axios.get('http://localhost:3001/api/Law-Enforcement-Performance-Ratio')
      .then(response => {
        setData(response.data);
        console.log('Fetched my data:', response.data);
      })
      .catch(error => console.error(error));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const areaOptions = Array.from(new Set(data.map(item => item[3]))).map(division => ({
    value: division,
    label: division,
  }));


  const handleareacodeChange = selectedOptions => {
    setSelectedareacode(selectedOptions.map(option => option.value));
  };

  const generateInsights = () => {
    if (selectedareacode.length === 0) {
      return <p>Please select one or more premises jurisdictions to view analysis.</p>;
    }
    if (selectedareacode.length === 1) {
      const division = selectedareacode[0];
      const areaData = data.filter(item => item[3] === division);
  
      const insights = areaData.map(item => (
        <li key={`${division}-${item[4]}`}>
          In {item[4]}:
          <ul className="list-disc pl-6 mt-2">
            <li>
              The closing rate of {division} jurisdiction  was {item[5]}%.
            </li>
          </ul>
        </li>
      ));
  
      return (
        <p>
          The line chart above illustrates the Performance analysis for {division} over the past four years. Here are key insights:
          <ul className="list-disc pl-6 mt-2">
            {insights}
          </ul>
        </p>
      );
    }
  
    // Get the years available in the dataset
    const years = Array.from(new Set(data.map(item => item[4])));
  
    const insights = years.map(year => {
      const yearInsights = selectedareacode.map((division, index) => {
        const areaData = data.filter(item => item[3] === division && item[4] === year);
        const performance = areaData.length > 0 ? areaData[0][5] : 0;
  
        return {
          division,
          performance,
        };
      });
  
      const maxPerformanceArea= yearInsights.reduce((max, area) => (area.performance > max.performance ? area : max));
      const minPerformanceArea = yearInsights.reduce((min, area) => (area.performance < min.performance ? area : min));
  
      return (
        <li key={year}>
          In {year}:
          {/* <ul className="list-disc pl-6 mt-2">
            {yearInsights.map(area => (
              <li key={area.areaCode}>
                {area.areaCode} had {area.crimeCount} crimes.
              </li>
            ))}
          </ul> */}
          {maxPerformanceArea.division !== minPerformanceArea.division && (
            <p>
              {maxPerformanceArea.division} jurisdiction had the highest crime closing rate({maxPerformanceArea.performance}%), while {minPerformanceArea.division} jurisdiction had least crimes closure percentage({minPerformanceArea.performance}%).
            </p>
          )}
        </li>
      );
    });
  
    return (
      <p>
        The line chart above illustrates the performance analysis for the selected jurisdictions over the past four years. Here are key insights:
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
      <ChartsHeader category="" title="Law Enforcement Performance Ratio" />
      <div className="flex">
        <Select
          isMulti
          options={areaOptions}
          value={areaOptions.filter(option => selectedareacode.includes(option.value))}
          onChange={handleareacodeChange}
          placeholder="Select Premises Jurisdiction"
          className="mr-4 mb-4"
          styles={customStyles}
        />
          {/* <Select
            options={crimeOptions}
            //value={crimecount.filter(option => selectedareacode.includes(option.value))}
            onChange={handlecrimecodeChange}
            placeholder="Select Crime"
            styles={customStyles}
          /> */}
      </div>
      <LineChart6 data={data} selectedareacode={selectedareacode}  />
      <div className="mt-6">
      <h2 className="text-xl font-semibold mb-2">Description</h2>
        <p style={{ marginBottom: '10px' }}>
        Performance Ratio analysis displays the success rate of closing crimes for each police jurisdiction 
        and the trend over the past four years. This offers a comprehensive view of law enforcement effectiveness, 
        helping identify successes, areas for improvement, and informing strategic decisions to enhance overall crime 
        resolution outcomes. Jurisdictions with lower success rates may benefit from targeted interventions, resource adjustments, 
        or process enhancements to enhance their case resolution capabilities.
        adapt 
        </p>
        <h2 className="text-xl font-semibold mb-2">Performance Analysis</h2>
        {generateInsights()}
      </div>
    </div>
  );
};

export default Line6;
