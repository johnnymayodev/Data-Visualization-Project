import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import "../styling/PieChart.css";

const PieChart = ({ data }) => {
  const svgRef = useRef();

  useEffect(() => {
    if (!data || data.length === 0) return;

    const width = 500;
    const height = 400;
    const radius = Math.min(width, height) / 2;

    const activeCounts = data.reduce(
      (acc, d) => {
        const isActive = d.Active.trim().toUpperCase() === "TRUE";
        acc[isActive ? "Active" : "Non-Active"] += 1;
        return acc;
      },
      { Active: 0, "Non-Active": 0 }
    );

    const pieData = Object.entries(activeCounts).map(([key, value]) => ({
      label: key,
      value,
    }));

    const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3
      .select(svgRef.current)
      .attr("width", width + 150)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${width / 2}, ${height / 2})`);

    const pie = d3.pie().value((d) => d.value);
    const arc = d3.arc().innerRadius(0).outerRadius(radius);

    const arcs = svg.selectAll("arc").data(pie(pieData)).enter();

    arcs
      .append("path")
      .attr("d", arc)
      .attr("fill", (d) => colorScale(d.data.label))
      .attr("stroke", "black")
      .attr("stroke-width", 1);

    arcs
      .append("text")
      .attr("transform", (d) => `translate(${arc.centroid(d)})`)
      .attr("text-anchor", "middle")
      .style("font-size", "14px")
      .text((d) => `${d.data.value}`);

    const legend = svg.append("g").attr("transform", `translate(${radius + 40}, ${-radius + 20})`);

    legend
      .selectAll("rect")
      .data(pieData)
      .enter()
      .append("rect")
      .attr("x", 0)
      .attr("y", (d, i) => i * 20)
      .attr("width", 15)
      .attr("height", 15)
      .attr("fill", (d) => colorScale(d.label));

    legend
      .selectAll("text")
      .data(pieData)
      .enter()
      .append("text")
      .attr("x", 20)
      .attr("y", (d, i) => i * 20 + 12)
      .style("font-size", "14px")
      .style("text-anchor", "start")
      .text((d) => `${d.label}: ${d.value}`);
  }, [data]);

  return <svg ref={svgRef}></svg>;
};

export default PieChart;
