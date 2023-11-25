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

const LineChart3 = ({ data, selectedMocodes }) => {
  const { currentMode } = useStateContext();

  // Filter data based on selected Mocodes
  const filteredData = selectedMocodes.length === 0 ? data : data.filter(item => selectedMocodes.includes(item[0]));

  // Group data by AreaName
  const groupedData = filteredData.reduce((acc, item) => {
    const key = item[0];

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

  Object.keys(groupedData).forEach((mocode, index) => {
    let chartData = groupedData[mocode].map((item) => ({  
      x: new Date(item[1], 0, 1),
      y: item[2],
    }));
console.log(chartData)

if (selectedMocodes.length == 0){
    chartData = [];
}
else {
    lineChartData.push(chartData);
}
    const series = {
      dataSource: chartData,
      xName: 'x',
      yName: 'y',
      name: mocode,
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
      legendSettings={{ background: 'white' }}
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

export default LineChart3;
