import React, { useState } from "react";
import FileUpload from "./components/FileUpload";
import BarChart1 from "./components/BarChart1";
import BarChart2 from "./components/BarChart2";

import ScatterPlot from "./components/ScatterPlot";
import PieChart from "./components/PieChart";
import "./App.css";

function App() {
  const [data, setData] = useState([]);

  return (
    <div className="App">
      {/* Conditional rendering: Show FileUpload if no data */}
      {!data.length && (
        <div className="file-upload-container">
          <FileUpload set_data={setData} />
        </div>
      )}

      {/* Show visualizations if data is uploaded */}
      {data.length > 0 && (
        <div className="charts-container">
         
          {/* top graphs */}
          
          <div className="chart chart1">
            <BarChart1 data={data} />
          </div>
          <div className="chart chart2">
            <BarChart2 data={data} />
          </div>


          {/* bottom graphs */}
          
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