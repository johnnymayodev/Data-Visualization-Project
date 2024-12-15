import React, { useEffect, useState } from "react";
import "../styling/BarChart1.css";

const BarChart1 = ({ data }) => {
  const [chartData, setChartData] = useState([]);
  const [maxValue, setMaxValue] = useState(0);
  const [yearRange, setYearRange] = useState([1950, 2023]);

  const handleYearChange = (e) => {
    const { name, value } = e.target;
    setYearRange((prevRange) => {
      if (name === "min") {
        return [parseInt(value, 10), prevRange[1]];
      } else {
        return [prevRange[0], parseInt(value, 10)];
      }
    });
  };

  // making name shorter
  const abbreviateName = (name) => {
    const nameParts = name.split(" ");
    return nameParts
      .map((part, index) => {
        if (index === nameParts.length - 1) return part; 
        return `${part[0]}.`;
      })
      .join(" ");
  };

  useEffect(() => {
    if (!data || data.length === 0) return;

    // Filter drivers based on active years
    const filteredData = data.filter((driver) => {
      const activeYears = JSON.parse(driver.Seasons.replace(/'/g, '"'));
      return activeYears.some((year) => year >= yearRange[0] && year <= yearRange[1]);
    });

    // Aggregate race wins for each driver
    const winsByDriver = {};
    filteredData.forEach((driver) => {
      if (!winsByDriver[driver.Driver]) {
        winsByDriver[driver.Driver] = 0;
      }
      winsByDriver[driver.Driver] += driver.Race_Wins;
    });

    //putting data into an array 
    const chartDataArray = Object.entries(winsByDriver)
      .map(([driver, wins]) => ({ driver, wins }))
      .sort((a, b) => b.wins - a.wins);

    setChartData(chartDataArray);
    const max = chartDataArray.length > 0 ? Math.max(...chartDataArray.map((entry) => entry.wins)) : 0;
    setMaxValue(max);
  }, [data, yearRange]);

  return (
    <div className="bar-chart-1">
      <div className="scroll-container">
        <h2>Ranking Drivers by Wins</h2>
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

      {/* chart visualization */}
      <div className="chart-scroller">
        <svg width={chartData.length * 70 + 50} height="400">
          {/* Chart Title */}
          <text
            x="50%"
            y="30"
            textAnchor="middle"
            style={{ fontSize: "16px", fontWeight: "bold" }}
          >
            Ranking Drivers by Wins
          </text>

          {/* y axis label */}
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
              <rect
                x="0"
                y={300 - (entry.wins / maxValue) * 250}
                height={(entry.wins / maxValue) * 250}
                width="50"
                fill="steelblue"
              >
                <title>{entry.driver}</title> {/*tooltip*/}
              </rect>

              {/*driver label*/}
              <text
                x="25"
                y="320"
                textAnchor="middle"
                style={{ fontSize: "10px" }}
              >
                {abbreviateName(entry.driver)}
              </text>

              {/*wins label*/}
              <text
                x="25"
                y={300 - (entry.wins / maxValue) * 250 - 5}
                textAnchor="middle"
                style={{ fontSize: "10px", fontWeight: "bold" }}
              >
                {String(entry.wins).padStart(3, "0")}
              </text>
            </g>
          ))}

          {/* x axis line*/}
          <line x1="40" y1="300" x2={chartData.length * 70 + 40} y2="300" stroke="black" />

          {/* x axis label */}
          <text
            x={chartData.length * 35 + 50}
            y="340"
            textAnchor="middle"
            style={{ fontSize: "12px", fontWeight: "bold" }}
          >
            Drivers
          </text>
        </svg>
      </div>
      <h4>Drivers</h4>
    </div>
  );
};

export default BarChart1;
