import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css"; // rename your index.css file to App.css

function App() {
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState("");
  const [newFile, setNewFile] = useState("");
  const [prompt, setPrompt] = useState("");
  const [completion, setCompletion] = useState("");

  useEffect(() => {
    async function fetchFiles() {
      try {
        const response = await axios.get("http://localhost:3000/files");
        setFiles(response.data);
        if (!selectedFile && response.data.length > 0) {
          setSelectedFile(response.data[0]);
        }
      } catch (error) {
        console.error(error);
      }
    }
    fetchFiles();
  }, [selectedFile]);

  const createFile = async () => {
    try {
      await axios.post("http://localhost:3000/create", { filename: newFile });
      alert(`File '${newFile}.jsonl' created.`);
      setNewFile("");
    } catch (error) {
      console.error(error);
    }
  };

  const addLine = async () => {
    try {
      await axios.post("http://localhost:3000/add-line", {
        filename: selectedFile,
        prompt,
        completion,
      });
      setPrompt("");
      setCompletion("");
    } catch (error) {
      console.error(error);
    }
  };

  const saveFile = async () => {
    try {
      await axios.post("http://localhost:3000/add-to-collection", {
        filename: selectedFile,
      });
      alert(`File '${selectedFile}' saved and added to collection.`);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    // The HTML structure is kept the same, but with JSX syntax and controlled components for form inputs
    <div className="container">
      <div className="row section">
        <div className="input-field col s12">
          <select
            id="file-selector"
            className="browser-default"
            value={selectedFile}
            onChange={(e) => setSelectedFile(e.target.value)}
          >
            {files.map((file, index) => (
              <option key={index} value={file}>
                {file}
              </option>
            ))}
          </select>
          <button
            className="btn waves-effect waves-light"
            type="button"
            onClick={() => alert(`Current file set to '${selectedFile}'.`)}
          >
            Set Current File
          </button>
        </div>
      </div>

      <div className="row section">
        <form id="create-form" className="col s12">
          <div className="row">
            <div className="input-field col s6">
              <input
                type="text"
                id="filename"
                name="filename"
                value={newFile}
                onChange={(e) => setNewFile(e.target.value)}
              />
              <label htmlFor="filename">Filename:</label>
            </div>
            <button
              className="btn waves-effect waves-light"
              type="button"
              onClick={createFile}
            >
              Create File
            </button>
          </div>
        </form>
      </div>

      <form id="add-form" className="section">
        <div className="row">
          <div className="input-field col s12">
            <textarea
              id="prompt"
              name="prompt"
              className="materialize-textarea"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
            <label htmlFor="prompt">Prompt:</label>
          </div>

          <div className="input-field col s12">
            <textarea
              id="completion"
              name="completion"
              className="materialize-textarea"
              value={completion}
              onChange={(e) => setCompletion(e.target.value)}
            />
            <label htmlFor="completion">Completion:</label>
          </div>
        </div>
        <button
          className="btn waves-effect waves-light"
          type="button"
          onClick={addLine}
        >
          Add Line
        </button>
      </form>

      <form id="save-form">
        <button
          className="waves-effect waves-light"
          type="button"
          onClick={saveFile}
        >
          Save File and Add to Collection
        </button>
      </form>
    </div>
  );
}

export default App;
