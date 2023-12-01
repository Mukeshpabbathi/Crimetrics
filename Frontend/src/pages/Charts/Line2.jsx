import React, { useState, useEffect } from 'react';
import { ChartsHeader, LineChart2 } from '../../components';
import axios from 'axios';
import Select from 'react-select';

const Line2 = () => {
  const [data, setData] = useState([]);
  const [selectedareacode, setSelectedareacode] = useState([]);
  const [selectedcrimecode, setSelectedcrimecode] = useState([]);

  const fetchData = () => {
    axios.get('http://localhost:3001/api/Crime-Severity-Assessment')
      .then(response => {
        setData(response.data);
        console.log('Fetched my data:', response.data);
      })
      .catch(error => console.error(error));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const areaOptions = Array.from(new Set(data.map(item => item[4]))).map(division => ({
    value: division,
    label: division,
  }));

  const crimeOptions = Array.from(new Set(data.map(item => item[5]))).map(description => ({
    value: description,
    label: description,
  }));


  const handleareacodeChange = selectedOptions => {
    setSelectedareacode(selectedOptions.value);
  };
  const handlecrimecodeChange = selectedOptions => {
    setSelectedcrimecode(selectedOptions.value);
  };
  const customStyles = {
    control: (provided) => ({
      ...provided,
      width: 400, // Adjust the width as needed
    }),
  };


  return (
    <div className="m-4 md:m-10 mt-24 p-10 bg-white dark:bg-secondary-dark-bg rounded-3xl">
      <ChartsHeader category="" title="Crime Severity Assessment" />
      <div className="flex">
        <Select
          options={areaOptions}
          //value={crimecount.filter(option => selectedareacode.includes(option.value))}
          onChange={handleareacodeChange}
          placeholder="Select Police Division"
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
      <LineChart2 data={data} selectedareacode={selectedareacode} selectedcrimecode={selectedcrimecode}  />
      <h2 className="text-xl font-semibold mb-2">Description</h2>
      <p style={{ marginBottom: '10px' }}>
        The chart provides insights of top 5 crime categories happening under each police jurisdiction over the years.
        The information assists law enforcement in prioritizing their efforts based on the most prevalent crimes.
        By focusing on the top 5 crime categories, authorities can deploy resources and personnel more strategically, 
        addressing the most pressing issues that directly impact the community. By recognizing the types of crimes 
        that are more prevalent in a given jurisdiction, law enforcement can collaborate with local communities to 
        implement targeted awareness campaigns and outreach programs to reduce the crime rate.
      </p>
    </div>
  );
};

export default Line2;
