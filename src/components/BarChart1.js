import React, { useEffect, useState } from "react";
import "../styling/BarChart1.css";

const BarChart1 = ({ data }) => {
  const [chartData, setChartData] = useState([]);
  const [maxValue, setMaxValue] = useState(0);
  const [yearRange, setYearRange] = useState([1950, 2023]); // Default year range

  const handleYearChange = (e) => {
    const { name, value } = e.target;
    setYearRange((prev) =>
      name === "min" ? [parseInt(value), prev[1]] : [prev[0], parseInt(value)]
    );
  };
  const abbreviateName = (name) =>
    name
      .split(" ")
      .map((n, i) => (i === name.split(" ").length - 1 ? n : `${n[0]}.`))
      .join(" ");
  
  useEffect(() => {
    if (data.length === 0) return;

    // Parse data and filter by year range
    const filteredData = data.filter((driver) => {
      const activeYears = JSON.parse(driver.Seasons.replace(/'/g, '"')); // Parse seasons as an array
      return activeYears.some((year) => year >= yearRange[0] && year <= yearRange[1]);
    });

    // Aggregate Race_Wins by Driver
    const aggregatedData = filteredData.reduce((acc, driver) => {
      if (!acc[driver.Driver]) {
        acc[driver.Driver] = 0;
      }
      acc[driver.Driver] += driver.Race_Wins;
      return acc;
    }, {});

    // Transform into array for sorting and rendering
    const chartDataArray = Object.entries(aggregatedData)
      .map(([driver, wins]) => ({ driver, wins }))
      .sort((a, b) => b.wins - a.wins); // Sort by wins descending

    setChartData(chartDataArray);
    setMaxValue(Math.max(...chartDataArray.map((entry) => entry.wins), 0));
  }, [data, yearRange]);

  return (
    <div className="bar-chart-1">
      {/* Scroll Bar */}
      <div className="scroll-container">
        <label>
          Year Range: {yearRange[0]} - {yearRange[1]}
        </label>
        <input
          type="range"
          name="min"
          min="1950"
          max="2023"
          value={yearRange[0]}
          onChange={handleYearChange}
        />
        <input
          type="range"
          name="max"
          min="1950"
          max="2023"
          value={yearRange[1]}
          onChange={handleYearChange}
        />
      </div>

      {/* Horizontal Scroller */}
      <div className="chart-scroller">
        <svg width={chartData.length * 70 + 50} height="350">
          {/* Y-axis label */}
          <text
            transform="rotate(-90)"
            x="-175"
            y="20"
            textAnchor="middle"
            style={{ fontSize: "12px", fontWeight: "bold" }}
          >
            Wins
          </text>

          {chartData.map((entry, index) => (
            <g key={entry.driver} transform={`translate(${index * 70 + 50}, 0)`}>
              {/* Bar */}
              <rect
  x="0"
  y={300 - (entry.wins / maxValue) * 250} // Adjust based on your scaling
  width="50"
  height={(entry.wins / maxValue) * 250}
  fill="teal"
>
  <title>{entry.driver}</title> {/* Full driver name as a tooltip */}
</rect>

              {/* Driver Label */}
              <text
  x="25" // Adjust as per your alignment
  y="320" // Adjust as per your positioning
  textAnchor="middle"
  style={{ fontSize: "10px" }}
>
  {abbreviateName(entry.driver)}
</text>

              {/* Wins Label */}
              <text
                x="25"
                y={300 - (entry.wins / maxValue) * 250 - 5}
                textAnchor="middle"
                style={{ fontSize: "10px", fontWeight: "bold" }}
              >
                {entry.wins.toString().padStart(3, "0")}
              </text>
            </g>
          ))}
          {/* Axis Line */}
          <line x1="40" y1="300" x2={chartData.length * 70 + 40} y2="300" stroke="black" />
          {/* X-axis label */}
          <text
            x={chartData.length * 35 + 40}
            y="340"
            textAnchor="middle"
            style={{ fontSize: "12px", fontWeight: "bold" }}
          >
            Drivers
          </text>
        </svg>
      </div>
    </div>
  );
};

export default BarChart1;
