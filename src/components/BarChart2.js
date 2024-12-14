import React, { useState, useEffect, useCallback, useRef } from "react";
import * as d3 from "d3";
import "../styling/BarChart2.css";

const BarChart2 = ({ data }) => {
  const [filteredData, setFilteredData] = useState([]);
  const [selectedNationality, setSelectedNationality] = useState("All");
  const chartRef = useRef();

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

    const filtered = formattedData.filter((d) => d.AvgFastestLaps > 0);

    if (selectedNationality === "All") {
      setFilteredData(filtered);
    } else {
      setFilteredData(
        filtered.filter((d) => d.Nationality === selectedNationality)
      );
    }
  }, [data, selectedNationality]);

  const drawChart = useCallback(() => {
    const container = chartRef.current.getBoundingClientRect();
    const margin = { top: 40, right: 20, bottom: 120, left: 70 }; // Adjusted bottom margin for x-axis labels
    const width = container.width - margin.left - margin.right;
    const height = container.height - margin.top - margin.bottom;

    d3.select("#barchart2").selectAll("*").remove();

    const svg = d3
      .select("#barchart2")
      .attr("width", container.width)
      .attr("height", container.height)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const xScale = d3
      .scaleBand()
      .domain(filteredData.map((d) => d.Nationality))
      .range([0, width])
      .padding(0.2);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(filteredData, (d) => d.AvgFastestLaps) || 0])
      .range([height, 0]);

    // X-Axis
    svg.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(xScale))
      .selectAll("text")
      .attr("transform", "rotate(45)")
      .attr("x", 10)
      .attr("y", 5)
      .style("text-anchor", "start")
      .style("font-size", "10px");

    // X-Axis Label
    svg.append("text")
      .attr("x", width / 2)
      .attr("y", height + 60)
      .attr("text-anchor", "middle")
      .style("font-size", "12px")
      .text("Nationality");

    // Y-Axis
    svg.append("g").call(d3.axisLeft(yScale));

    // Y-Axis Label
    svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -height / 2)
      .attr("y", -50)
      .attr("text-anchor", "middle")
      .style("font-size", "12px")
      .text("Lap Time");

    // Bars
    svg.selectAll(".bar")
      .data(filteredData)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", (d) => xScale(d.Nationality))
      .attr("y", (d) => yScale(d.AvgFastestLaps))
      .attr("width", xScale.bandwidth())
      .attr("height", (d) => height - yScale(d.AvgFastestLaps))
      .on("mouseover", function () {
        d3.select(this).style("fill", "orange");
      })
      .on("mouseout", function () {
        d3.select(this).style("fill", "steelblue");
      });
  }, [filteredData]);

  useEffect(() => {
    drawChart();
  }, [filteredData, drawChart]);

  return (
    <div className="barchart-container" ref={chartRef}>
      {/* Dropdown for selecting nationality */}
      <div className="select-wrapper">
        <label htmlFor="nationality-select"></label>
        <select
          id="nationality-select"
          value={selectedNationality}
          onChange={(e) => setSelectedNationality(e.target.value)}
        >
          <option value="All">Nationality</option>
          {Array.from(new Set(data.map((d) => d.Nationality)))
            .filter((n) => n)
            .sort()
            .map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
        </select>
      </div>
      {/* Chart Container */}
      <svg id="barchart2"></svg>
    </div>
  );
};

export default BarChart2;
