import { Line } from "react-chartjs-2";
import { Chart as ChartJs } from "chart.js/auto";
import { lineChartData } from "../../fakeData/lineChartData";

export default function LineChart() {
  // تحديد مدى الانحناء للخطوط
  lineChartData.datasets.forEach((dataset) => {
    dataset.tension = 0.4; // تحكم في مدى انحناء الخطوط هنا
  });

  let delayed;

  const options = {
    animation: {
      onComplete: () => {
        delayed = true;
      },
      delay: (context) => {
        let delay = 0;
        if (context.type === "data" && context.mode === "default" && !delayed) {
          delay = context.dataIndex * 300 + context.datasetIndex * 100;
        }
        return delay;
      },
    },
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    interaction: {
      intersect: false,
      mode: "index",
    },
    scales: {
      x: {
        grid: {
          drawBorder: false,
          display: false,
          drawOnChartArea: false,
          drawTicks: false,
          borderDash: [5, 5],
        },
        ticks: {
          display: true,
          color: "#b2b9bf",
          padding: 20,
          font: {
            size: 11,
            family: "Open Sans",
            style: "normal",
            lineHeight: 2,
            // lineWidth: 5,
          },
        },
      },
      y: {
        grid: {
          drawBorder: false,
          display: true,
          drawOnChartArea: true,
          drawTicks: false,
          borderDash: [5, 5],
          // lineWidth: 0,
        },
        ticks: {
          display: true,
          padding: 10,
          color: "#b2b9bf",
          font: {
            size: 11,
            family: "Open Sans",
            style: "normal",
            lineHeight: 2,
          },
        },
      },
    },
  };

  return (
    <div className="w-full h-72 bg-white dark:bg-gray-800 shadow-md px-1 md:p-2 rounded-lg">
      <Line options={options} data={lineChartData} />
    </div>
  );
}
