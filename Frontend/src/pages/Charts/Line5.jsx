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
    setSelectedSeason(selectedOptions.map(option => option.value));
  };
  const customStyles = {
    control: (provided) => ({
      ...provided,
      width: 400, // Adjust the width as needed
    }),
  };

  const generateSeasonalCrimeInsights = () => {
    if (selectedCrimes.length === 0 && selectedSeason.length === 0) {
      return <p>Please select crimes and seasons to view analysis.</p>;
    }
  
    const insights = [];
  
    if (selectedCrimes.length === 1 && selectedSeason.length === 0) {
      const singleCrime = selectedCrimes[0];
      const crimeData = data.filter(item => item[2] === singleCrime);
  
      if (crimeData.length === 0) {
        return <p>No data available for the selected crime.</p>;
      }
  
      insights.push(
        <p key={`crime-${singleCrime}`}>
          The line chart above illustrates the seasonal patterns for {singleCrime}. Here are key insights:
          <ul className="list-disc pl-6 mt-2">
            {crimeData.map(item => (
              <li key={`${singleCrime}-${item[1]}`}>
                In {item[1]} {item[0]}, the total crime count was {item[3]}.
              </li>
            ))}
          </ul>
        </p>
      );
    }
    if (selectedCrimes.length === 0 && selectedSeason.length === 1) {
      const singleSeason = selectedSeason[0];
      const seasonData = data.filter(item => item[1] === singleSeason && item[2] === 1);
    
      if (seasonData.length === 0) {
        return (
          <p key={`no-data-${singleSeason}`}>
            No data available for the selected season.
          </p>
        );
      }
    }
    
    if (selectedCrimes.length === 1 && selectedSeason.length === 1) {
      const insightsForSelectedCrimesAndSeasons = selectedCrimes.map(crime => {
        return selectedSeason.map(season => {
          const crimeSeasonData = data.filter(item => item[2] === crime && item[1] === season);
    
          if (crimeSeasonData.length === 0) {
            return (
              <p key={`no-data-${crime}-${season}`}>
                No data available for {crime} and {season}.
              </p>
            );
          }
    
          return (
            <div key={`crime-season-${crime}-${season}`}>
              <p>
                The line chart above illustrates the seasonal patterns for {crime} during {season}. Here are key insights:
              </p>
              <ul className="list-disc pl-6 mt-2">
                {crimeSeasonData.map(item => (
                  <li key={`${crime}-${season}-${item[0]}`}>
                    In {item[0]}, the total crime count was {item[3]}.
                  </li>
                ))}
              </ul>
            </div>
          );
        });
      });
    
      insights.push(...insightsForSelectedCrimesAndSeasons);
    }
    
    if (selectedCrimes.length > 0 && selectedSeason.length > 1) {
      const years = Array.from(new Set(data.map(item => item[0])));
      selectedCrimes.forEach(crimeType => {
        const crimeTypeData = data.filter(item => selectedSeason.includes(item[1]) && item[2] === crimeType);
    
        if (crimeTypeData.length === 0) {
          insights.push(
            <p key={`no-data-${crimeType}`}>No data available for {crimeType} crime and the selected seasons.</p>
          );
          return;
        }
    
        const crimeTypeInsights = (
          <div key={`crimeType-${crimeType}`}>
            <p>
              The line chart above illustrates the impact on {crimeType} crime inn different seasons. Here are key insights:
            </p>
            <ul className="list-disc pl-6 mt-2">
              {years.map(year => {
                const yearData = crimeTypeData.filter(item => item[0] === year);
                if (yearData.length === 0) return null;
        
                const maxVictimSeason = yearData.reduce((max, season) =>
                  season[3] > max[3] ? season : max
                );
                const minVictimSeason = yearData.reduce((min, season) =>
                  season[3] < min[3] ? season : min
                );
                console.log(maxVictimSeason)
                return (
                  <li key={`${crimeType}-${year}`}>
                    In {year} for {crimeType} crime:
                    {maxVictimSeason[1] !== minVictimSeason[1] && (
                      <p>
                        {maxVictimSeason[1]} had the highest total crime rate with total count ({maxVictimSeason[3]}), while{' '}
                        {minVictimSeason[1]} had the lowest crime rate ({minVictimSeason[3]}).
                      </p>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        );
        
    
        insights.push(crimeTypeInsights);
      });
    };
    
  
    return insights;
  };
  

  


  return (
    <div className="m-4 md:m-10 mt-24 p-10 bg-white dark:bg-secondary-dark-bg rounded-3xl">
      <ChartsHeader category="" title="Seasonal Crime Patterns" />
      <div className="flex">
        <Select
          isMulti
          options={CrimeOptions}
          value={CrimeOptions.filter((option) => selectedCrimes.includes(option.value))}
          onChange={handleCrimeChange}
          placeholder="Select Crimes"
          className="mr-4 mb-4"
          styles={customStyles}
        />
        <Select
          isMulti
          options={SeasonOptions}
          value={SeasonOptions.filter((option) => selectedSeason.includes(option.value))}
          onChange={handleSeasonChange}
          placeholder="Select Seasons"
          styles={customStyles}
        />
      </div>
      <LineChart5 data={data} selectedCrimes={selectedCrimes} selectedSeason={selectedSeason} />
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">Description</h2>
        <p style={{ marginBottom: '10px' }}>
        This chart explores the relationship between the types of crime and the season they occur. 
        This graph helps to understand how certain types of crime are more likely to occur in specific 
        seasons and how these crimes have evolved over the years. This information helps in allocating resources more efficiently during 
        high-risk periods, allowing police to enhance patrols and implement preventive measures when certain 
        crimes are more likely to occur. 
        </p>
        <h2 className="text-xl font-semibold mb-2">Seasonal Crime Analysis</h2>
        {generateSeasonalCrimeInsights()}
      </div>
    </div>
  );
};

export default Line5;
