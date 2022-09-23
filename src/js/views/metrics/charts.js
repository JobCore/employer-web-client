import React from 'react';
import { Pie, Bar } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js/auto';

export const PieChart = ({ pieData }) => {
  return (
    <Pie
      data={pieData}
      options={{
        responsive: true,
        maintainAspectRatio: false,
        cutout: "0%",
        animation: {
          animateScale: true,
          animateRotate: true,
        }
      }}
    />
  )
}

export const BarChart = ({ barData }) => {
  
  let delayed;
  return (
    <Bar
      data={barData}
      options={{
        responsive: true,
        maintainAspectRatio: false,
        animation: {
          onComplete: () => {
            delayed = true;
          },
          delay: (context) => {
            let delay = 0;
            if (context.type === 'data' && context.mode === 'default' && !delayed) {
              delay = context.dataIndex * 150 + context.datasetIndex * 100;
            }
            return delay;
          },
        }
      }}
    />
  )
}