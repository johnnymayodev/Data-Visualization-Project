import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import "../styling/ScatterPlot.css"; // Import the CSS file

const ScatterPlot = ({ data }) => {
  const svgRef = useRef();

  useEffect(() => {
    if (!data || data.length === 0) return;

    const margin = { top: 20, right: 30, bottom: 50, left: 50 };
    const width = 800 - margin.left - margin.right;
    const height = 600 - margin.top - margin.bottom;

    const parsedData = data.map((d) => ({
      driver: d.Driver,
      entries: parseFloat(d.Race_Entries),
      wins: parseFloat(d.Race_Wins),
    }));

    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3
      .select(svgRef.current)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const xScale = d3
      .scaleLinear()
      .domain([0, d3.max(parsedData, (d) => d.entries) + 5])
      .range([0, width]);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(parsedData, (d) => d.wins) + 5])
      .range([height, 0]);

    // Add axes
    svg
      .append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(xScale));

    svg.append("g").call(d3.axisLeft(yScale));

    // Add labels for axes
    svg
      .append("text")
      .attr("x", width / 2)
      .attr("y", height + margin.bottom - 10)
      .style("text-anchor", "middle")
      .text("Race Entries");

    svg
      .append("text")
      .attr("x", -height / 2)
      .attr("y", -margin.left + 15)
      .style("text-anchor", "middle")
      .attr("transform", "rotate(-90)")
      .text("Race Wins");

    // Add points
    svg
      .selectAll("circle")
      .data(parsedData)
      .enter()
      .append("circle")
      .attr("cx", (d) => xScale(d.entries))
      .attr("cy", (d) => yScale(d.wins))
      .attr("r", 5)
      .attr("fill", "steelblue")
      .attr("stroke", "black");

    // Add tooltips
    const tooltip = d3
      .select("body")
      .append("div")
      .attr("class", "tooltip");

    svg
      .selectAll("circle")
      .on("mouseover", (event, d) => {
        tooltip
          .html(
            `<strong>Driver:</strong> ${d.driver}<br/><strong>Entries:</strong> ${d.entries}<br/><strong>Wins:</strong> ${d.wins}`
          )
          .style("left", `${event.pageX + 10}px`)
          .style("top", `${event.pageY - 20}px`)
          .style("opacity", 1);
      })
      .on("mouseout", () => {
        tooltip.style("opacity", 0);
      });
  }, [data]);

  return <svg ref={svgRef}></svg>;
};

export default ScatterPlot;
