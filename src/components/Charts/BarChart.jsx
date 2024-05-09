import { Bar } from "react-chartjs-2";
import { BarChartData } from "../../fakeData/BarChartData";
/// https://www.youtube.com/watch?v=6q5d3Z1-5kQ
export default function BarChart() {
  // تحديد مدى الانحناء للخطوط
  BarChartData.datasets.forEach((dataset) => {
    dataset.tension = 0.4; // تحكم في مدى انحناء الخطوط هنا
  });

  let delayed;

  const options = {
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
      y: {
        grid: {
          drawBorder: false,
          display: false,
          drawOnChartArea: false,
          drawTicks: false,
        },
        ticks: {
          suggestedMin: 0,
          suggestedMax: 600,
          beginAtZero: true,
          padding: 15,
          font: {
            size: 14,
            family: "Open Sans",
            style: "normal",
            lineHeight: 2,
          },
          color: "#fff",
        },
      },
      x: {
        grid: {
          drawBorder: false,
          display: false,
          drawOnChartArea: false,
          drawTicks: false,
        },
        ticks: {
          display: false,
        },
      },
    },
  };

  return (
    <div className="w-full max-w-lg mx-auto bg-gray-500 shadow-md p-6 rounded-lg">
      <Bar options={options} data={BarChartData} />
    </div>
  );
}
