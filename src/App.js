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
      <FileUpload set_data={setData} />
      {data.length > 0 && (
        <div className="charts">
          <ScatterPlot data={data} />
          <PieChart data={data} />
          <BarChart2 data={data} />
        </div>
      )}
    </div>
  );
}

export default App;
