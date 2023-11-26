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
    setSelectedAgeGroup(selectedOptions.map(option => option.value));
  };
  const customStyles = {
    control: (provided) => ({
      ...provided,
      width: 400, // Adjust the width as needed
    }),
  };

  const generateAgeDistributionInsights = () => {
    if (selectedCrimes.length === 0 && selectedAgeGroup.length === 0) {
      return <p>Please select crimes and age groups to view analysis.</p>;
    }
  
    const insights = [];
  
    if (selectedCrimes.length === 1 && selectedAgeGroup.length === 0) {
      const singleCrime = selectedCrimes[0];
      const crimeData = data.filter(item => item[0] === singleCrime);
  
      if (crimeData.length === 0) {
        return <p>No data available for the selected crime.</p>;
      }
  
      insights.push(
        <p key={`crime-${singleCrime}`}>
          The line chart above illustrates the age distribution of victims for {singleCrime}. Here are key insights:
          <ul className="list-disc pl-6 mt-2">
            {crimeData.map(item => (
              <li key={`${singleCrime}-${item[1]}`}>
                In {item[1]}, the total victim count for {singleCrime} was {item[3]}.
              </li>
            ))}
          </ul>
        </p>
      );
    }
  
    if (selectedCrimes.length === 0 && selectedAgeGroup.length === 1) {
      const singleAgeGroup = selectedAgeGroup[0];
      const ageGroupData = data.filter(item => item[2] === singleAgeGroup);
  
      if (ageGroupData.length === 0) {
        return <p>No data available for the selected age group.</p>;
      }
  
      insights.push(
        <p key={`ageGroup-${singleAgeGroup}`}>
          The line chart above illustrates the age distribution of victims for {singleAgeGroup}. Here are key insights:
          <ul className="list-disc pl-6 mt-2">
            {ageGroupData.map(item => (
              <li key={`${singleAgeGroup}-${item[1]}`}>
                In {item[1]}, the total victim count for {singleAgeGroup} victims was {item[3]}.
              </li>
            ))}
          </ul>
        </p>
      );
    }
    if (selectedCrimes.length > 0 && selectedAgeGroup.length === 1) {
      const singleAgeGroup = selectedAgeGroup[0];
      const ageGroupData = data.filter(item => selectedCrimes.includes(item[0]) && item[2] === singleAgeGroup);
  
      if (ageGroupData.length === 0) {
        insights.push(
          <p key={`no-data-${singleAgeGroup}`}>No data available for the selected crimes and {singleAgeGroup} age group.</p>
        );
        return insights;
      }
  
      const ageGroupInsights = (
        <div key={`ageGroup-${singleAgeGroup}`}>
          <p>
            The line chart above illustrates the age distribution of victims for {singleAgeGroup}. Here are key insights:
          </p>
          <ul className="list-disc pl-6 mt-2">
            {ageGroupData.map(item => (
              <li key={`${singleAgeGroup}-${item[0]}-${item[1]}`}>
                In {item[1]}, the total victim count for {singleAgeGroup} victims of {item[0]} was {item[3]}.
              </li>
            ))}
          </ul>
        </div>
      );
  
      insights.push(ageGroupInsights);
  
    }
    if (selectedCrimes.length === 1 && selectedAgeGroup.length > 1) {
      const singleCrime = selectedCrimes[0];
      const selectedAgeGroups = selectedAgeGroup;
  
      const insightsForSelectedCrimeAndAgeGroups = selectedAgeGroups.map(ageGroup => {
        const ageGroupData = data.filter(item => item[0] === singleCrime && item[2] === ageGroup);
  
        if (ageGroupData.length === 0) {
          return (
            <p key={`no-data-${singleCrime}-${ageGroup}`}>
              No data available for {singleCrime} and {ageGroup} age group.
            </p>
          );
        }
  
        return (
          <div key={`crime-ageGroup-${singleCrime}-${ageGroup}`}>
            <p>
              The line chart above illustrates the age distribution of victims for {singleCrime} and {ageGroup}. Here are key insights:
            </p>
            <ul className="list-disc pl-6 mt-2">
              {ageGroupData.map(item => (
                <li key={`${singleCrime}-${ageGroup}-${item[1]}`}>
                  In {item[1]}, the total victim count for {ageGroup} victims of {singleCrime} was {item[3]}.
                </li>
              ))}
            </ul>
          </div>
        );
      });
  
      insights.push(...insightsForSelectedCrimeAndAgeGroups);
  
    } 
  
    if (selectedCrimes.length > 1 && selectedAgeGroup.length > 1) {
      const years = Array.from(new Set(data.map(item => item[1])));
      selectedAgeGroup.forEach(ageGroup => {
        const ageGroupData = data.filter(item => selectedCrimes.includes(item[0]) && item[2] === ageGroup);
  
        if (ageGroupData.length === 0) {
          insights.push(
            <p key={`no-data-${ageGroup}`}>No data available for the selected crimes and {ageGroup} age group.</p>
          );
          return;
        }
  
        const ageGroupInsights = (
          <div key={`ageGroup-${ageGroup}`}>
            <p>
              The line chart above illustrates the age distribution of victims for {ageGroup}. Here are key insights:
            </p>
            <ul className="list-disc pl-6 mt-2">
              {years.map(year => {
                const yearData = ageGroupData.filter(item => item[1] === year);
                if (yearData.length === 0) return null;
  
                const maxVictimCrime = yearData.reduce((max, crime) =>
                  crime[3] > max[3] ? crime : max
                );
                const minVictimCrime = yearData.reduce((min, crime) =>
                  crime[3] < min[3] ? crime : min
                );
  
                return (
                  <li key={`${ageGroup}-${year}`}>
                    In {year} for {ageGroup} victims:
                    {maxVictimCrime[0] !== minVictimCrime[0] && (
                      <p>
                        {maxVictimCrime[0]} had the highest total victim count ({maxVictimCrime[3]}), while{' '}
                        {minVictimCrime[0]} had the lowest ({minVictimCrime[3]}).
                      </p>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        );
  
        insights.push(ageGroupInsights);
      });
    }
  
    return insights;
  };
  
  


  return (
    <div className="m-4 md:m-10 mt-24 p-10 bg-white dark:bg-secondary-dark-bg rounded-3xl">
      <ChartsHeader category="" title="Age Distribution of Victims" />
      <div className="flex">
        <Select
          isMulti
          options={CrimeOptions}
          value={CrimeOptions.filter(option => selectedCrimes.includes(option.value))}
          onChange={handleCrimeChange}
          placeholder="Select Crimes"
          className="mr-4 mb-4"
          styles={customStyles}
        />
        <Select
          isMulti
          options={AgeGroupOptions}
          value={AgeGroupOptions.filter(option => selectedAgeGroup.includes(option.value))}
          onChange={handleAgeGroupChange}
          placeholder="Select Age Group"
          styles={customStyles}
        />
        
      </div>
      <LineChart4 data={data} selectedCrimes={selectedCrimes} selectedAgeGroup={selectedAgeGroup} />
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">Age Distribution Analysis</h2>
        {generateAgeDistributionInsights()}
      </div>
    </div>
    
  );
};

export default Line4;
