const ctx = document.createElement("canvas").getContext("2d");

// Gradient 1
const gradientStroke1 = ctx.createLinearGradient(0, 230, 0, 50);
gradientStroke1.addColorStop(1, "rgba(0,0,255,0.2)"); // اللون الأزرق
gradientStroke1.addColorStop(0.5, "rgba(255,255,255,0.0)"); // اللون الأبيض (شفاف)
gradientStroke1.addColorStop(0, "rgba(255,255,255,0)"); // اللون الأزرق


// Gradient 2
const gradientStroke2 = ctx.createLinearGradient(0, 230, 0, 50);
gradientStroke2.addColorStop(1, "rgba(20,23,39,0.2)");
gradientStroke2.addColorStop(0.5, "rgba(72,72,176,0.0)");
gradientStroke1.addColorStop(0, "rgba(255,255,255,0)"); // اللون الأزرق

// Gradient 3
const gradientStroke3 = ctx.createLinearGradient(0, 230, 0, 50);
gradientStroke3.addColorStop(1, "rgba(50,168,82,0.2)");
gradientStroke3.addColorStop(0.5, "rgba(30,105,210,0.0)");
gradientStroke1.addColorStop(0, "rgba(255,255,255,0)"); // اللون الأزرق

// Gradient 4
const gradientStroke4 = ctx.createLinearGradient(0, 230, 0, 50);
gradientStroke4.addColorStop(1, "rgba(255,0,0,0.2)");
gradientStroke4.addColorStop(0.5, "rgba(255,255,0,0.0)");
gradientStroke1.addColorStop(0, "rgba(255,255,255,0)"); // اللون الأزرق
export const lineChartData = {
  labels: ["Sun", "Sat", "Mon", "Tue", "Wed", "Thu", "Fri"],
  datasets: [
    {
      label: "الاول",
      tension: 0.4,
      borderWidth: 0,
      pointRadius: 0,
      borderColor: "#3A416F",
      borderWidth: 3,
      backgroundColor: gradientStroke1,
      fill: true,
      maxBarThickness: 7,
      data: [3000, 5000, 800, 1100, 7000, 500, 4000],
      //   borderColor: "red",
    },
    {
      label: "الثاني",
      tension: 0.4,
      borderWidth: 0,
      pointRadius: 0,
      borderColor:  "#cb0c9f",
      borderWidth: 3,
      backgroundColor: gradientStroke2,
      fill: true,
      maxBarThickness: 6,
      data: [2000, 6000, 9000, 1200, 7000, 300, 3000],
      //   borderColor: "rgb(75, 192, 192)",
    },
    {
      label: "الثالث",
      tension: 0.4,
      borderWidth: 0,
      pointRadius: 0,
      borderColor: "#3A82dF",
      borderWidth: 3,
      backgroundColor: gradientStroke3,
      fill: true,
      maxBarThickness: 6,
      data: [1000, 8000, 700, 1300, 7000, 400, 2000],
    },
    {
      label: "الرابع",
      tension: 0.4,
      borderWidth: 0,
      pointRadius: 0,
      borderColor: "#3A777F",
      borderWidth: 3,
      backgroundColor: gradientStroke4,
      fill: true,
      maxBarThickness: 6,
      data: [1000, 8000, 9700, 1300, 7000, 400, 1200],
    },
  ],
};
