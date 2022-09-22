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
        animation: {
          animateRotate: true,
        }
      }}
    />
  )
}

export const BarChart = ({ barData }) => {

  return (
    <Bar
      data={barData}
      options={{
        responsive: true,
        maintainAspectRatio: false,
        animation: {
          animateRotate: true,
        }
      }}
    />
  )
}

/*
        rotation: (-0.5*Math.PI) - (25/180 * Math.PI),
        animation: {
          animateRotate: true,
          render: false,
          easing="linear"
          duration={500}
          maxPointCountSupported={100}
      },*/