import React from 'react';
import { Pie, Bar } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js/auto';

/**
 * @function
 * @description Creates a pie chart with the data passed as an argument.
 * @since 09.29.22 by Paola Sanchez
 * @author Paola Sanchez
 * @requires Pie
 * @param {object} pieData - Object with data like colors, labels, and values needed for the chart.
 */
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

/**
 * @function
 * @description Creates a bar chart with the data passed as an argument
 * @since 09.29.22 by Paola Sanchez
 * @author Paola Sanchez
 * @requires Bar
 * @param {object} barData - Object with data like colors, labels, and values needed for the chart.
 */
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