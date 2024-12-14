import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import "../styling/ScatterPlot.css"; // Import the CSS file

const ScatterPlot = ({ data }) => {
  const svgRef = useRef();

  useEffect(() => {
    if (!data || data.length === 0) return;

    const container = svgRef.current.getBoundingClientRect();
    const margin = { top: 20, right: 30, bottom: 50, left: 70 };

    // Adjust chart width and height
    const width = container.width - margin.left - margin.right;
    const height = (container.width * 0.6) - margin.top - margin.bottom; // Proportional height

    const parsedData = data.map((d) => ({
      driver: d.Driver,
      nationality: d.Nationality,
      entries: parseFloat(d.Race_Entries),
      wins: parseFloat(d.Race_Wins),
      championships: parseInt(d.Championships, 10),
      pointsPerEntry: parseFloat(d.Points_Per_Entry),
      podiums: parseInt(d.Podiums, 10),
      polePositions: parseInt(d.Pole_Positions, 10),
    }));


    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3
      .select(svgRef.current)
      .attr("width", container.width)
      .attr("height", container.width * 0.7) // Increased proportional height
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
      .call(d3.axisBottom(xScale));

    // Add y-axis
    svg.append("g").call(d3.axisLeft(yScale));

    // Add axis labels
    svg
      .append("text")
      .attr("x", width / 2)
      .attr("y", height + margin.bottom - 15)
      .style("text-anchor", "middle")
      .text("Race Entries");

    svg
      .append("text")
      .attr("x", -height / 2)
      .attr("y", -margin.left + 20)
      .style("text-anchor", "middle")
      .attr("transform", "rotate(-90)")
      .text("Race Wins");
      const tooltip = d3
      .select("body")
      .append("div")
      .style("position", "absolute")
      .style("background", "#fff")
      .style("padding", "5px")
      .style("border", "1px solid #ccc")
      .style("border-radius", "5px")
      .style("pointer-events", "none")
      .style("visibility", "hidden");
    // Add circles
    svg
      .selectAll("circle")
      .data(parsedData)
      .enter()
      .append("circle")
      .attr("cx", (d) => xScale(d.entries))
      .attr("cy", (d) => yScale(d.wins))
      .attr("r", 6)
      .attr("fill", "steelblue")
      .attr("stroke", "black")
      .attr("clip-path", "url(#chart-clip)")
      .on("mouseover", (event, d) => {
        tooltip
          .style("visibility", "visible")
          .html(
            `<strong>Driver:</strong> ${d.driver}<br>` +
              `<strong>Nationality:</strong> ${d.nationality}<br>` +
              `<strong>Race Entries:</strong> ${d.entries}<br>` +
              `<strong>Race Wins:</strong> ${d.wins}<br>` +
              `<strong>Championships:</strong> ${d.championships}<br>` +
              `<strong>Points per Entry:</strong> ${d.pointsPerEntry.toFixed(2)}<br>` +
              `<strong>Podiums:</strong> ${d.podiums}<br>` +
              `<strong>Pole Positions:</strong> ${d.polePositions}`
          );
      })
      .on("mousemove", (event) => {
        tooltip
          .style("top", `${event.pageY + 10}px`)
          .style("left", `${event.pageX + 10}px`);
      })
      .on("mouseout", () => {
        tooltip.style("visibility", "hidden");
      });
      // Clip to prevent overflow

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
