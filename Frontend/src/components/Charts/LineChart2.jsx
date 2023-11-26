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
import { LinePrimaryXAxis, LinePrimaryYAxis } from '../../data/dummy'; // Import your dummy data and axes configurations
import { useStateContext } from '../../contexts/ContextProvider';

const LineChart2 = ({ data, selectedCrimeCodes }) => {
  const { currentMode } = useStateContext();

  // Filter data based on selected crime codes
  const filteredData = data.filter(item => selectedCrimeCodes.includes(item.crimeCode));

  // Group data by policeAreaCode and crimeYear
  const groupedData = filteredData.reduce((acc, item) => {
    const key = [item.policeAreaCode, item.crimeYear];

    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(item);
    return acc;
  }, {});

  // Generate lineChartData and lineCustomSeries
  const lineChartData = [];
  const lineCustomSeries = [];

  Object.keys(groupedData).forEach((key, index) => {
    const [policeAreaCode, crimeYear] = key;
    
    let chartData = groupedData[key].map((item) => ({
      x: new Date(crimeYear, 0, 1),
      y: item.crimesCount,
    }));

    if (selectedCrimeCodes.length === 0) {
      chartData = [];
    } else {
      lineChartData.push(chartData);
    }

    const series = {
      dataSource: chartData,
      xName: 'x',
      yName: 'y',
      name: `Area ${policeAreaCode}`,
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

export default LineChart2;