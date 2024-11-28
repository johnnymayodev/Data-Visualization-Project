import React, { Component } from "react";

class FileUpload extends Component {
  constructor(props) {
    super(props);
    this.state = {
      file: null,
      jsonData: null, 
    };
  }

  handleFileSubmit = (event) => {
    event.preventDefault();
    const { file } = this.state;

    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target.result;
        const json = this.csvToJson(text);
        this.setState({ jsonData: json });
        if (this.props.set_data) {
          this.props.set_data(json); 
        }
      };
      reader.readAsText(file);
    }
  };

  csvToJson = (csv) => {
    const lines = csv.trim().split("\n");
    const headers = lines[0].match(/(".*?"|[^",]+)(?=\s*,|\s*$)/g); 

    const result = [];

    for (let i = 1; i < lines.length; i++) {
      const currentLine = lines[i].match(/(".*?"|[^",]+)(?=\s*,|\s*$)/g); 
      const obj = {};

      headers.forEach((header, index) => {
        let value = currentLine[index]?.trim();

        if (value) {
          value = value.replace(/^"|"$/g, ""); 
        }

        obj[header.trim()] = value;
      });

      if (Object.keys(obj).length) {
        result.push(obj);
      }
    }

    return result;
  };

  render() {
    return (
      <div style={{ backgroundColor: "#f0f0f0", padding: 20 }}>
        <h2>Upload a CSV File</h2>
        <form onSubmit={this.handleFileSubmit}>
          <input
            type="file"
            accept=".csv"
            onChange={(event) => this.setState({ file: event.target.files[0] })}
          />
          <button type="submit">Upload</button>
        </form>
      </div>
    );
  }
}

export default FileUpload;
