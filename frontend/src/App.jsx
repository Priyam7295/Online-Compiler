import React, { useState } from "react";
import Editor from "react-simple-code-editor";
import { highlight, languages } from "prismjs/components/prism-core";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-javascript";
import "prismjs/themes/prism.css";
import axios from "axios";
import "./App.css";

function App() {
  const cppCode=`
  // Include the input/output stream library
  #include <iostream> 
  using namespace std;
  // Define the main function
  int main() { 
      // Output "Welcome!" to the console
      cout << "Welcome to Crack the Code online Compiler!"; 
      
      // Return 0 to indicate successful execution
      return 0; 
  }`;

  const pyCode =`print("Welcome to Crack the Code online Compiler!")`;
  const [code, setCode] = useState(cppCode);
  const [output, setOutput] = useState("");

  const [input, setInput] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("cpp"); // Default to C++
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    const payload = {
      language: selectedLanguage,
      code,
      input,
    };

    try {
      const { data } = await axios.post("http://localhost:8000/run", payload);
      console.log(data);
      if (data.output) {
        setOutput(data.output);
        setError("");
      } else {
        setOutput("");
        setError(data.error);
      }
    } catch (error) {
      console.log(error.response);
      setError(
        "An error occurred while processing the request. Probably check Syntax"
      );
    }
  };

  const handleLanguageChange = (event) => {
    setSelectedLanguage(event.target.value);
    if (event.target.value === "py") {
      setCode(pyCode);
      
    }
    if (event.target.value === "cpp") {
      setCode(cppCode);
      
    }
  };

  return (
    <div className="container">
      <h1 className="title">Crack Online Code Compiler</h1>
      <div className="content">
        <div className="editor-section">
          <select
            className="select-box"
            value={selectedLanguage}
            onChange={handleLanguageChange}
          >
            <option value="cpp">C++</option>
            <option value="py">Python</option>
          </select>
          <div className="editor-container">
            <Editor
              className="editor"
              value={code}
              onValueChange={(code) => setCode(code)}
              highlight={(code) => highlight(code, languages.js)}
              padding={10}
              style={{
                fontFamily: '"Fira code", "Fira Mono", monospace',
                fontSize: 16, // Increased font size
                outline: "none",
                border: "none",
                backgroundColor: "#f7fafc",
                // height: '500px', // Adjust height as needed
                overflowY: "auto",
              }}
            />
          </div>
          <button onClick={handleSubmit} type="button" className="run-button">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="run-icon"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.91 11.672a.375.375 0 0 1 0 .656l-5.603 3.113a.375.375 0 0 1-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112Z"
              />
            </svg>
            Run
          </button>
          <div className="input_block">
            <h2>INPUTS:</h2>
            <textarea
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
              }}
            ></textarea>
          </div>
        </div>

        <div className="output-section">
          <div>
            <h2>OUTPUT</h2>
            {output && (
              <div className="output-box">
                <pre className="output-text">{output}</pre>
              </div>
            )}
          </div>
        <div>

          {error && (
            <div className="error-box">
              <pre className="error-text">{error}</pre>
            </div>
          )}
        </div>
        </div>
      </div>
    </div>
  );
}

export default App;
