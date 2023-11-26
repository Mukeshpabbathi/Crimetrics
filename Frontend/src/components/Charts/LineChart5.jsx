import React from 'react';
import {
  ChartComponent,
  SeriesCollectionDirective,
  SeriesDirective,
  Inject,
  LineSeries,
  DateTime,
  Legend,
  Tooltip,
} from '@syncfusion/ej2-react-charts';
import { LinePrimaryXAxis, LinePrimaryYAxis } from '../../data/dummy';
import { useStateContext } from '../../contexts/ContextProvider';

const LineChart5 = ({ data, selectedCrimes,selectedSeason }) => {
  const { currentMode } = useStateContext();



  // Filter data based on selected areas
  const filteredDataInitial = selectedCrimes.length === 0 ? data : data.filter(item => selectedCrimes.includes(item[2]));
  const filteredData = selectedSeason.length === 0 ? filteredDataInitial : filteredDataInitial.filter(item => selectedSeason.includes(item[1]));

  // Group data by AreaName
  const groupedData = filteredData.reduce((acc, item) => {
    const key = [item[2],item[1]];

    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(item);
    return acc;
  }, {});

  console.log(groupedData)

  // Generate lineChartData and lineCustomSeries
  let lineChartData = [];
  const lineCustomSeries = [];

  Object.keys(groupedData).forEach((key, index) => {
    let chartData = groupedData[key].map((item) => ({  
      x: new Date(item[0], 0, 1),
      y: item[3],
    }));
console.log(chartData)
console.log("Crimes = " + selectedCrimes)
console.log("Season =" +selectedSeason)
if (selectedCrimes.length === 0 && selectedSeason.length === 0){
    chartData = [];
}
else {
    lineChartData.push(chartData);
}
    const series = {
      dataSource: chartData,
      xName: 'x',
      yName: 'y',
      name: key,
      width: '2',
      marker: { visible: true, width: 10, height: 10 },
      type: 'Line',
    };

    lineCustomSeries.push(series);
  });

  return (
    <ChartComponent
      id="line-chart"
      height="420px"
      primaryXAxis={LinePrimaryXAxis}
      primaryYAxis={{
        title: 'Crime Count',
      }}
      chartArea={{ border: { width: 0 } }}
      tooltip={{ enable: true }}
      background={currentMode === 'Dark' ? '#33373E' : '#fff'}
      legendSettings={{ background: 'white', visible: selectedCrimes.length > 0 }}
    >
      <Inject services={[LineSeries, DateTime, Legend, Tooltip]} />
      <SeriesCollectionDirective>
        {lineCustomSeries.map((item, index) => (
          <SeriesDirective key={index} {...item} />
        ))}
      </SeriesCollectionDirective>
    </ChartComponent>
  );
};

export default LineChart5;
