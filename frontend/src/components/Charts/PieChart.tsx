import { SnapshotSchema } from '../../@types/SnapshotSchema';

export const pieChartData = (aggregateSnapshotData: SnapshotSchema) => {
  const {
    count = 0,
    successfulRate = 0,
    errorRate = 0,
  } = aggregateSnapshotData || {};

  const successfulCalls = Math.round((successfulRate * count) / 100);
  const errorCalls = Math.round((errorRate * count) / 100);

  const otherCalls = count - successfulRate - errorRate;

  const validOtherCalls = otherCalls < 0 ? 0 : otherCalls;

  return {
    series: [successfulCalls, 0, errorCalls, validOtherCalls],
    options: {
      chart: {
        type: 'pie' as const,
      },
      labels: [
        '2xx Success',
        '4xx Client Errors',
        '5xx Server Errors',
        'Other',
      ],
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 150, // Adjusted smaller size for mobile view
            },
            legend: {
              position: 'bottom',
            },
          },
        },
      ],
    },
  };
};
