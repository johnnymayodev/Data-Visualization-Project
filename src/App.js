import React, { useState } from "react";
import FileUpload from "./components/FileUpload";
import ScatterPlot from "./components/ScatterPlot";
import PieChart from "./components/PieChart";
import BarChart2 from "./components/BarChart2";
import "./App.css";

function App() {
  const [data, setData] = useState([]);

  return (
    <div className="App">
      <div className="file-upload-container">
        <FileUpload set_data={setData} />
      </div>
      {data.length > 0 && (
        <div className="charts-container">
          {/* Top row: Two bar charts */}
          <div className="chart chart1">
            <h3>Bar Chart 1</h3>
            <p>Placeholder for Bar Chart 1</p>
          </div>
          <div className="chart chart2">
            <BarChart2 data={data} />
          </div>

          {/* Bottom row: Scatter Plot and Pie Chart */}
          <div className="chart chart3">
            <ScatterPlot data={data} />
          </div>
          <div className="chart chart4">
            <PieChart data={data} />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
