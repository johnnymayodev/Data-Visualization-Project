import React, { Component } from "react";

//handling csv file upload and converting to json
class FileUpload extends Component {
  constructor(props) {
    super(props);
    this.state = {
      file: null,       
      jsonData: null,   
    };
  }

  //handing uploaded files 
  handleFileSubmit = (event) => {
    event.preventDefault();
    const { file } = this.state;

    if (file) {
      const reader = new FileReader();

      //reading contents and converting to json
      reader.onload = (e) => {
        const csvText = e.target.result;
        const json = this.csvToJson(csvText);

        this.setState({ jsonData: json });

        if (this.props.set_data) {
          this.props.set_data(json);
        }
      };

      reader.readAsText(file); //reading file as plain text
    }
  };

  // data processing csv to json
  csvToJson = (csv) => {
    const lines = csv.trim().split("\n"); //split to lines
    const headers = lines[0].match(/(".*?"|[^",]+)(?=\s*,|\s*$)/g); //extract headers

    const result = [];

    for (let i = 1; i < lines.length; i++) {
      const currentLine = lines[i].match(/(".*?"|[^",]+)(?=\s*,|\s*$)/g);
      const obj = {};

      headers.forEach((header, index) => {
        let value = currentLine[index]?.trim();

        //remove surrounding quotes
        if (value) {
          value = value.replace(/^"|"$/g, "");
        }

        obj[header.trim()] = value;
      });

      //adding non empty rows only
      if (Object.keys(obj).length) {
        result.push(obj);
      }
    }

    return result;
  };

  render() {
    return (
      <div style={{ backgroundColor: "#f0f0f0", padding: 20 }}>
        {/*header text*/}
        <h2>Upload a CSV File</h2>

        <form onSubmit={this.handleFileSubmit}>
          {/*file input*/}
          <input
            type="file"
            accept=".csv"
            onChange={(event) =>
              this.setState({ file: event.target.files[0] })
            }
          />
          {/*upload button*/}
          <button type="submit">Upload</button>
        </form>
      </div>
    );
  }
}

export default FileUpload;
