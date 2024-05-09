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
export const BarChartData = {
  labels: ["Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  datasets: [
    {
      label: "Sales",
      tension: 0.4,
      borderWidth: 0,
      borderRadius: 4,
      borderSkipped: false,
      backgroundColor: "#fff",
      data: [450, 200, 100, 220, 500, 100, 400, 230, 500],
      maxBarThickness: 6,
    },
  ],
};
