import React, { useState } from "react";
import "./StringCalculator.css"; // Import the CSS file

function stringAdd(numbers) {
  if (numbers === "") return 0;

  let delimiters = [',', '\n'];
  let numsSection = numbers;

  // Check for custom delimiter
  if (numbers.startsWith("//")) {
    const delimiterSection = numbers.match(/^\/\/(.*)\n/)[1];
    numsSection = numbers.slice(numbers.indexOf('\n') + 1);

    // Support multi-char delimiters in brackets: //[***]\n1***2***3
    const delimiterMatches = delimiterSection.match(/\[(.+?)\]/g);
    if (delimiterMatches) {
      delimiters = delimiterMatches.map(d => d.slice(1, -1));
    } else {
      // Single character delimiter: //;\n
      delimiters = [delimiterSection];
    }
  }

  // Build regex for all delimiters
  const delimiterRegex = new RegExp(delimiters.map(d => d.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|'));

  // Split and process numbers
  const numStrings = numsSection.split(delimiterRegex).filter(s => s !== "");
  const negatives = [];
  const sum = numStrings.reduce((acc, val) => {
    const num = parseInt(val, 10);
    if (isNaN(num)) return acc;
    if (num < 0) negatives.push(num);
    return acc + num;
  }, 0);

  if (negatives.length > 0) {
    throw new Error("negative numbers not allowed " + negatives.join(","));
  }

  return sum;
}


export default function StringCalculator() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleCalculate = () => {
    try {
      setError("");
      const sum = stringAdd(input);
      setResult(sum);
    } catch (e) {
      setResult(null);
      setError(e.message);
    }
  };

  return (
    <div className="sc-container">
      <h2 className="sc-title">String Calculator</h2>
      <input
        type="text"
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder='Enter numbers (e.g. "1,2,3" or "//;\n1;2")'
        className="sc-input"
      />
      <button onClick={handleCalculate} className="sc-button">
        Calculate
      </button>
      {result !== null && <div className="sc-result">Result: {result}</div>}
      {error && <div className="sc-error">{error}</div>}
    </div>
  );
}
