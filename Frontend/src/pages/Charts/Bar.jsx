import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';  // Import Bar from react-chartjs-2
import { ChartsHeader } from '../../components';
import { useStateContext } from '../../contexts/ContextProvider';

const BarChart = () => {
  const { currentMode } = useStateContext();
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/seasonal-crime-patterns');
        const data = await response.json();
        console.log(data);

        // Format your data to match Chart.js expectations
        const formattedData = formatDataForChart(data);
        console.log(formattedData);
        setChartData(formattedData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []); // Empty dependency array to trigger the effect only once

  const formatDataForChart = (data) => {
    const labels = [...new Set(data.map((entry) => entry[1]))];
    const datasets = [];

    // Iterate through the crime types in your data
    data.forEach((entry) => {
      const dataset = {
        label: entry[2],
        data: data
          .filter((item) => item[2] === entry[2])
          .map((item) => item[3]),
        backgroundColor: 'green', // Replace with your color logic
      };

      datasets.push(dataset);
    });

    return {
      labels,
      datasets,
    };
  };

  return (
    <div className="m-4 md:m-10 mt-24 p-10 bg-white dark:bg-secondary-dark-bg rounded-3xl">
      <ChartsHeader category="Bar" title="Seasonal Crime Patterns and Types of Crimes" />
      <div className="w-full">
        {chartData && (
          <Bar
            data={chartData}
            options={{
              scales: {
                x: {
                  type: 'category',
                  stacked: true,
                },
                y: {
                  type: 'linear',
                  stacked: true,
                },
              },
              plugins: {
                legend: {
                  display: true,
                  position: 'bottom',
                  labels: {
                    color: currentMode === 'Dark' ? '#fff' : '#333',
                  },
                },
              },
            }}
          />
        )}
      </div>
    </div>
  );
};

export default BarChart;
