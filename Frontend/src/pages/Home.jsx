import React, { useState, useEffect } from 'react';
import { MdOutlineSupervisorAccount } from 'react-icons/md';
import { FiBarChart } from 'react-icons/fi';
import { useStateContext } from '../contexts/ContextProvider';
import './Home.css';




const Home = () => {
  const { currentColor, currentMode } = useStateContext();

  const [tableData, setTableData] = useState(null);
  const [totalCount, setTotalCount] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/getNumTuples');

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          throw new Error('Invalid response format, expected JSON');
        }

        const data = await response.json();
        // Calculate and set the total count
        const total = Object.values(data).reduce((acc, count) => acc + count, 0);
        setTotalCount(total);
      } catch (error) {
        console.error('Error fetching data:', error.message);
      }
    };

    fetchData();
  }, []); 

  const handleButtonClick = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/getNumTuples');

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Invalid response format, expected JSON');
      }

      const data = await response.json();
      setTableData(data);

      // Calculate and set the total count
      const total = Object.values(data).reduce((acc, count) => acc + count, 0);
      setTotalCount(total);
    } catch (error) {
      console.error('Error fetching data:', error.message);
    }
  };


  return (
    <div className="mt-24">
      <h1 className="text-4xl font-bold mb-8 text-center text-gray-800 dark:text-white">
        Welcome to Crimetrics
      </h1>
      <div className="flex flex-wrap lg:flex-nowrap justify-center ">
        
        <div className="flex m-3 flex-wrap justify-center gap-4 items-center">

          <div className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg md:w-56 h-44 p-4 pt-9 rounded-2xl shadow-md">
            
            <button
                type="button"
                style={{ color: '#03C9D7', backgroundColor: '#E5FAFB' }}
                className="text-2xl opacity-0.9 rounded-full  p-4 hover:drop-shadow-xl"
              >
                <MdOutlineSupervisorAccount />
              </button>
              <p className="text-lg font-semibold mb-2">Crime Trend Analysis</p>
          </div>

          <div className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg md:w-56 h-44 p-4 pt-9 rounded-2xl shadow-md">
            
          <button
                type="button"
                style={{ color: '#03C9D7', backgroundColor: '#E5FAFB' }}
                className="text-2xl opacity-0.9 rounded-full  p-4 hover:drop-shadow-xl"
              >
                <MdOutlineSupervisorAccount />
              </button>
            <p className="text-lg font-semibold mb-2">Crime Category</p>
            
          </div>

          <div className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg md:w-56 h-44 p-4 pt-9 rounded-2xl shadow-md">
          <button
                type="button"
                style={{ color: '#03C9D7', backgroundColor: '#E5FAFB' }}
                className="text-2xl opacity-0.9 rounded-full  p-4 hover:drop-shadow-xl"
              >
                <MdOutlineSupervisorAccount />
              </button>
            <p className="text-lg font-semibold mb-2">Modus Operandi Analysis</p>
            
          </div>

          <div className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg md:w-56 h-44 p-4 pt-9 rounded-2xl shadow-md">
          <button
                type="button"
                style={{ color: '#03C9D7', backgroundColor: '#E5FAFB' }}
                className="text-2xl opacity-0.9 rounded-full  p-4 hover:drop-shadow-xl"
              >
                <MdOutlineSupervisorAccount />
              </button>
            <p className="text-lg font-semibold mb-2">Age Distribution of Victims</p>
            
          </div>

          <div className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg md:w-56 h-44 p-4 pt-9 rounded-2xl shadow-md">
          <button
                type="button"
                style={{ color: '#03C9D7', backgroundColor: '#E5FAFB' }}
                className="text-2xl opacity-0.9 rounded-full  p-4 hover:drop-shadow-xl"
              >
                <MdOutlineSupervisorAccount />
              </button>
            <p className="text-lg font-semibold mb-2">Seasonal Crime Patterns</p>
            
          </div>
        </div>
      </div>
      <div className="flex flex-wrap lg:flex-nowrap justify-center ">
      <div className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg h-44 rounded-xl w-full lg:w-80 p-8 pt-9 m-3 bg-hero-pattern bg-no-repeat bg-cover bg-center">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-bold text-gray-400">Total Number of Tuples</p>
              <p className="text-2xl">{totalCount !== null ? `${totalCount}` : 'Loading...'}</p>
            </div>
            <button
              type="button"
              style={{ backgroundColor: currentColor }}
              className="text-2xl opacity-0.9 text-white hover:drop-shadow-xl rounded-full  p-4"
            >
              <FiBarChart />
            </button>
          </div>
          <div className="mt-6">
          <button
  className="button bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
  onClick={handleButtonClick}
>
  Count
</button>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap lg:flex-nowrap justify-center flex-container">
      {tableData !== null && (
        <div className="table-container">
          <h2>Number of Tuples in Each Table</h2>
          <table className="table">
            <thead>
              <tr>
                <th>Table Name</th>
                <th>Number of Tuples</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(tableData).map(([tableName, numRows]) => (
                <tr key={tableName}>
                  <td>{tableName}</td>
                  <td>{numRows}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* <div className="total-count-container">
          <h2>Total Count</h2>
          <p className="total-count">{totalCount}</p>
          </div> */}
        </div>
        
      )}
    </div>
    </div>
    
  );
};

export default Home;
