import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import "../styling/ScatterPlot.css"; // Import the CSS file

const ScatterPlot = ({ data }) => {
  const svgRef = useRef();

  useEffect(() => {
    if (!data || data.length === 0) return;

    const container = svgRef.current.getBoundingClientRect();
    const margin = { top: 10, right: 15, bottom: 40, left: 50 }; // Smaller margins

    // Adjust chart width and height to be smaller
    const width = container.width * 0.5 - margin.left - margin.right; // 50% width of container
    const height = width * 0.6 - margin.top - margin.bottom; // Maintain proportionate height

    const parsedData = data.map((d) => ({
      driver: d.Driver,
      nationality: d.Nationality,
      entries: parseFloat(d.Race_Entries),
      wins: parseFloat(d.Race_Wins),
      championships: parseFloat(d.Championships),
      pointsPerEntry: parseFloat(d.Points_Per_Entry),
      podiums: parseFloat(d.Podiums),
      polePositions: parseFloat(d.Pole_Positions),
    }));

    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3
      .select(svgRef.current)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Adjust x and y scales
    const xScale = d3
      .scaleLinear()
      .domain([0, d3.max(parsedData, (d) => d.entries) + 10]) // Add padding to x-axis
      .range([0, width]);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(parsedData, (d) => d.wins) + 10]) // Add padding to y-axis
      .range([height, 0]);

    // Add x-axis
    svg.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(xScale).ticks(5)); // Fewer ticks for smaller chart

    // Add y-axis
    svg.append("g").call(d3.axisLeft(yScale).ticks(5)); // Fewer ticks for smaller chart

    // Add axis labels
    svg
      .append("text")
      .attr("x", width / 2)
      .attr("y", height + margin.bottom - 10)
      .style("text-anchor", "middle")
      .style("font-size", "10px") // Smaller font size
      .text("Race Entries");

    svg
      .append("text")
      .attr("x", -height / 2)
      .attr("y", -margin.left + 15)
      .style("text-anchor", "middle")
      .style("font-size", "10px") // Smaller font size
      .attr("transform", "rotate(-90)")
      .text("Race Wins");

    // Tooltip div
    const tooltip = d3
      .select("body")
      .append("div")
      .attr("class", "tooltip")
      .style("position", "absolute")
      .style("visibility", "hidden")
      .style("background-color", "#fff")
      .style("border", "1px solid #ccc")
      .style("padding", "5px")
      .style("border-radius", "5px")
      .style("font-size", "12px");

    // Add circles
    svg
      .selectAll("circle")
      .data(parsedData)
      .enter()
      .append("circle")
      .attr("cx", (d) => xScale(d.entries))
      .attr("cy", (d) => yScale(d.wins))
      .attr("r", 3) // Smaller circle radius
      .attr("fill", "steelblue")
      .attr("stroke", "black")
      .on("mouseover", function (event, d) {
        // Show the tooltip with additional information
        tooltip
          .style("visibility", "visible")
          .html(`
            <strong>Driver:</strong> ${d.driver} <br/>
            <strong>Nationality:</strong> ${d.nationality} <br/>
            <strong>Race Entries:</strong> ${d.entries} <br/>
            <strong>Race Wins:</strong> ${d.wins} <br/>
            <strong>Championships:</strong> ${d.championships} <br/>
            <strong>Points per Entry:</strong> ${d.pointsPerEntry} <br/>
            <strong>Podiums:</strong> ${d.podiums} <br/>
            <strong>Pole Positions:</strong> ${d.polePositions} <br/>
          `);
      })
      .on("mousemove", function (event) {
        // Position the tooltip near the mouse
        tooltip
          .style("top", `${event.pageY + 10}px`)
          .style("left", `${event.pageX + 10}px`);
      })
      .on("mouseout", function () {
        // Hide the tooltip when the mouse moves out
        tooltip.style("visibility", "hidden");
      });

    // Add clipping to ensure circles stay within the chart
    svg
      .append("clipPath")
      .attr("id", "chart-clip")
      .append("rect")
      .attr("x", 0)
      .attr("y", 0)
      .attr("width", width)
      .attr("height", height);
  }, [data]);

  return <svg ref={svgRef} style={{ width: "100%", height: "100%" }}></svg>;
};

export default ScatterPlot;
