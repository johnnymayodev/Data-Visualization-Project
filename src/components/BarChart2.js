import React, { useState, useEffect, useCallback } from "react";
import * as d3 from "d3";
import "../styling/BarChart2.css"; // Importing the CSS

const BarChart2 = ({ data }) => {
  const [filteredData, setFilteredData] = useState([]);
  const [selectedNationality, setSelectedNationality] = useState("All");

  // Aggregate data when data or selectedNationality changes
  useEffect(() => {
    const groupedData = d3.rollup(
      data,
      (v) => d3.mean(v, (d) => +d.Fastest_Laps),
      (d) => d.Nationality
    );

    const formattedData = Array.from(groupedData, ([key, value]) => ({
      Nationality: key,
      AvgFastestLaps: value || 0,
    }));

    if (selectedNationality === "All") {
      setFilteredData(formattedData);
    } else {
      setFilteredData(
        formattedData.filter((d) => d.Nationality === selectedNationality)
      );
    }
  }, [data, selectedNationality]);

  // Memoize the drawChart function to avoid unnecessary re-renders
  const drawChart = useCallback(() => {
    const margin = { top: 40, right: 20, bottom: 100, left: 70 }; // Increased left margin for label
    const width = 800 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    d3.select("#barchart2").selectAll("*").remove(); // Clear the chart

    const svg = d3
      .select("#barchart2")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const xScale = d3
      .scaleBand()
      .domain(filteredData.map((d) => d.Nationality))
      .range([0, width])
      .padding(0.2);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(filteredData, (d) => d.AvgFastestLaps)])
      .range([height, 0]);

    const barWidth = selectedNationality === "All" ? xScale.bandwidth() : 100;

    const xAxis = svg
      .append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(xScale));

    xAxis.selectAll("text")
      .attr("transform", "rotate(270)") // Rotate text upside down
      .attr("x", -10) // Adjust x-offset for proper placement
      .attr("y", -5) // Adjust y-offset to bring text closer to axis
      .style("text-anchor", "end")
      .style("font-size", "10px");

    svg.append("g").call(d3.axisLeft(yScale));

    // Adding the 'Lap Time' label outside the y-axis
    svg
      .append("text")
      .attr("transform", "rotate(-90)") // Rotate the text to be vertical
      .attr("x", -height / 2) // Position it at the center of the y-axis
      .attr("y", -margin.left + 20) // Add some padding from the left
      .style("text-anchor", "middle") // Center the text horizontally
      .style("font-size", "12px")
      .text("Lap Time");

    svg
      .selectAll(".bar")
      .data(filteredData)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", (d) => {
        if (selectedNationality === "All") {
          return xScale(d.Nationality); // Default behavior for multiple nationalities
        } else {
          return (width - barWidth) / 2; // Centered bar for single nationality
        }
      })
      .attr("y", (d) => yScale(d.AvgFastestLaps))
      .attr("width", barWidth)
      .attr("height", (d) => height - yScale(d.AvgFastestLaps));
  }, [filteredData, selectedNationality]);

  // Call drawChart when filteredData changes
  useEffect(() => {
    drawChart();
  }, [filteredData, drawChart]);

  // Get the nationalities with avg fast lap time > 0 and sort them alphabetically
  const availableNationalities = Array.from(
    new Set(data.map((d) => d.Nationality))
  )
    .map((nationality) => {
      const avgFastestLap = d3.mean(
        data.filter((d) => d.Nationality === nationality),
        (d) => +d.Fastest_Laps
      );
      return { nationality, avgFastestLap };
    })
    .filter((d) => d.avgFastestLap > 0) // Only include nationalities with avg fast lap > 0
    .sort((a, b) => a.nationality.localeCompare(b.nationality)); // Sort alphabetically

  return (
    <div className="barchart-container">
      <div className="select-wrapper">
        <label htmlFor="nationality-select">Filter by Nationality:</label>
        <select
          id="nationality-select"
          value={selectedNationality}
          onChange={(e) => setSelectedNationality(e.target.value)}
        >
          <option value="All">All</option>
          {availableNationalities.map((nat) => (
            <option key={nat.nationality} value={nat.nationality}>
              {nat.nationality}
            </option>
          ))}
        </select>
      </div>
      <svg id="barchart2"></svg>
    </div>
  );
};

export default BarChart2;
