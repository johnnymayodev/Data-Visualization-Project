import React, { useState, useEffect, useCallback, useRef } from "react";
import * as d3 from "d3";
import "../styling/BarChart2.css";

const BarChart2 = ({ data }) => {

  //state for chart data and selected filter
  const [filteredData, setFilteredData] = useState([]);
  const [selectedNationality, setSelectedNationality] = useState("All");

  const chartRef = useRef();

  //filtering based on nationality and transforming data
  useEffect(() => {
    const groupDataByNationality = d3.rollup(
      data,
      (entries) => d3.mean(entries, (d) => +d.Fastest_Laps),
      (d) => d.Nationality
    );

    const processedData = Array.from(groupDataByNationality, ([key, value]) => ({
      Nationality: key,
      AvgFastestLaps: value || 0,
    })).filter((d) => d.AvgFastestLaps > 0);

    //applying filter
    setFilteredData(
      selectedNationality === "All"
        ? processedData
        : processedData.filter((d) => d.Nationality === selectedNationality)
    );
  }, [data, selectedNationality]);

  //drawing d3 chart
  const drawChart = useCallback(() => {
    const container = chartRef.current.getBoundingClientRect();

    const margin = { top: 40, right: 20, bottom: 120, left: 70 };
    const width = container.width - margin.left - margin.right;
    const height = container.height - margin.top - margin.bottom;

    //clearing the older chart
    d3.select("#barchart2").selectAll("*").remove();

    //creating svg canvas
    const svg = d3
      .select("#barchart2")
      .attr("width", container.width)
      .attr("height", container.height)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    //x and y scales
    const xScale = d3
      .scaleBand()
      .domain(filteredData.map((d) => d.Nationality))
      .range([0, width])
      .padding(0.2);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(filteredData, (d) => d.AvgFastestLaps) || 0])
      .range([height, 0]);

    //x axis
    svg.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(xScale))
      .selectAll("text")
      .attr("transform", "rotate(45)")
      .attr("x", 10)
      .attr("y", 5)
      .style("text-anchor", "start")
      .style("font-size", "10px");

    svg.append("text")
      .attr("x", width / 2)
      .attr("y", height + 60)
      .attr("text-anchor", "middle")
      .style("font-size", "12px")
      .text("Nationality");

    //y axis
    svg.append("g").call(d3.axisLeft(yScale));

    svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -height / 2)
      .attr("y", -50)
      .attr("text-anchor", "middle")
      .style("font-size", "12px")
      .text("Average Fastest Lap");

    //bars
    svg.selectAll(".bar")
      .data(filteredData)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", (d) => xScale(d.Nationality))
      .attr("y", (d) => yScale(d.AvgFastestLaps))
      .attr("width", xScale.bandwidth())
      .attr("height", (d) => height - yScale(d.AvgFastestLaps))
      .attr("fill", "steelblue")
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
      {/*dropdown*/}
      <div className="select-wrapper">
        <label htmlFor="nationality-select">Filter by Nationality:</label>
        <select
          id="nationality-select"
          value={selectedNationality}
          onChange={(e) => setSelectedNationality(e.target.value)}
        >
          <option value="All">All</option>
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
      {/*barchart*/}
      <svg id="barchart2"></svg>
    </div>
  );
};

export default BarChart2;
