import { useState, useEffect } from 'react';
import Chart from 'react-apexcharts';
import {
  useGetAggregationSnapshotsQuery,
  useGetMinMaxDatesQuery,
} from '../store/api/SnapshotApi';
import { pieChartData } from './Charts/PieChart';

export const ChartWrapper = () => {
  const [minDatetime, setMinDatetime] = useState('2024-06-14T13:59');
  const [maxDatetime, setMaxDatetime] = useState('2024-06-18T14:02');

  const { data: minMaxDates, isLoading: loadingMinMax } =
    useGetMinMaxDatesQuery();

  const { data: aggregateSnapshotData, isLoading: loadingSnapshots } =
    useGetAggregationSnapshotsQuery({
      maxDatetime,
      minDatetime,
    });

  useEffect(() => {
    if (minMaxDates) {
      setMinDatetime(minMaxDates.minDate);
      setMaxDatetime(minMaxDates.maxDate);
    }
  }, [minMaxDates]);

  if (loadingMinMax || loadingSnapshots) {
    return <div className='text-center'>Loading...</div>;
  }

  if (!aggregateSnapshotData) {
    return <div className='text-center'>No data available</div>;
  }

  const {
    count = 0,
    errorRate = 0,
    avgRuntimeMillis = 0,
  } = aggregateSnapshotData || {};

  const pieChart = pieChartData(aggregateSnapshotData);

  return (
    <div className='p-4 text-black rounded-lg shadow-md'>
      <h2 className='text-xl font-semibold mb-4 text-black'>Dashboard Chart</h2>

      {/* Date Inputs */}
      <div className='flex items-center mb-4 space-x-4'>
        <div className='flex flex-col'>
          <label className='text-black text-sm mb-1' htmlFor='min-datetime'>
            Start Date:
          </label>
          <input
            type='datetime-local'
            id='min-datetime'
            value={minDatetime}
            onChange={(e) => setMinDatetime(e.target.value)}
            className='border border-gray-300 rounded p-1 w-48'
          />
        </div>
        <div className='flex flex-col'>
          <label className='text-black text-sm mb-1' htmlFor='max-datetime'>
            End Date:
          </label>
          <input
            type='datetime-local'
            id='max-datetime'
            value={maxDatetime}
            onChange={(e) => setMaxDatetime(e.target.value)}
            className='border border-gray-300 rounded p-1 w-48'
          />
        </div>
      </div>

      {/* Chart and other components remain unchanged */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
        <div className='text-center'>
          <h3 className='text-lg font-medium text-black'>Total API Calls</h3>
          <h1 className='text-4xl text-black'>{count}</h1>
        </div>
        <div className='text-center'>
          <h3 className='text-lg font-medium text-black'>Error Rate</h3>
          <h1 className='text-4xl text-red-600'>{errorRate.toFixed(2)}%</h1>
        </div>
      </div>
      <div className='flex flex-col md:flex-row justify-between'>
        <div className='text-center mb-4 md:mb-0'>
          <h3 className='text-lg font-medium text-black'>Average Runtime</h3>
          <h1 className='text-2xl text-black'>
            {avgRuntimeMillis.toFixed(2)} ms
          </h1>
        </div>
        <div className='text-center'>
          <h3 className='text-lg font-medium text-black'>
            Status Code Distribution
          </h3>
          <Chart
            options={pieChart.options}
            series={pieChart.series}
            type='pie'
            width='300'
          />
        </div>
      </div>
    </div>
  );
};
