import React, { useState} from "react";
import "./App.css"; // Import your styles

function App() {
  const [rawData, setRawData] = useState("");
  const [students, setStudents] = useState([]);
  const [minGroupSize, setMinGroupSize] = useState(0);
  const [maxGroupSize, setMaxGroupSize] = useState(0);
  const [groups, setGroups] = useState([]);

  function handlePaste(e) {
    setRawData(e.target.value);
  }

  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  function parseAndDisplayStudents() {
    const rows = rawData.split("\n");
    const studentsArr = rows.map((row) => {
      const cells = row.split("\t");
      return {
        name: cells[0],
        pronoun: cells[1],
        grade: cells[2],
      };
    });
    setStudents(studentsArr);
    shuffleArray(studentsArr);
    generateGroups(studentsArr);
  }

  function generateGroups() {
    if (students.length === 0) {
      return;
    }

    shuffleArray(students);

    const groupArr = [];
    const remainingStudents = [...students];
    const totalGroups = Math.ceil(remainingStudents.length / maxGroupSize);

    for (let i = 0; i < totalGroups; i++) {
      const groupSize = Math.min(
        Math.floor(Math.random() * (maxGroupSize - minGroupSize + 1) + minGroupSize),
        remainingStudents.length
      );
      const group = remainingStudents.splice(0, groupSize);
      if (group.length > 0) {
        groupArr.push(group);
      }
    }

    setGroups(groupArr);
  }

  return (
    <div className="App container">
      <h1>Group Generator</h1>
      <textarea
        className="form-control"
        onChange={handlePaste}
        placeholder="Paste cells from Google Sheet here..."
        rows="5"
      />
      <button className="btn btn-primary mt-3" onClick={parseAndDisplayStudents}>
        Display Students
      </button>
      <div className="mt-3">
        <label>
          Min group size:
          <input
            className="ml-2"
            type="number"
            value={minGroupSize}
            onChange={(e) => setMinGroupSize(Number(e.target.value))}
          />
        </label>
        <label className="ml-3">
          Max group size:
          <input
            className="ml-2"
            type="number"
            value={maxGroupSize}
            onChange={(e) => setMaxGroupSize(Number(e.target.value))}
          />
        </label>
      </div>
      <button className="btn btn-success mt-3" onClick={generateGroups}>
        Generate Groups
      </button>
      <div className="groups mt-3">
        <h2>Groups</h2>
        <div className="row">
          {groups.map((group, index) => (
            <div className="col-md-4 mb-3" key={index}>
              <div className="card">
                <div className="card-header">
                  Group Number {index + 1}
                </div>
                <ul className="list-group list-group-flush">
                  {group.map((student, index) => (
                    <li key={`${index}-${student.name}`} className="list-group-item">
                      {student.name}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="students">
        <h2>Students</h2>
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Name</th>
              <th>Grade</th>
              <th>Pronoun</th>
            </tr>
          </thead>
          <tbody>
            {students.map(student => (
              <tr key={student.name}>
                <td>{student.name}</td>
                <td>{student.grade}</td>
                <td>{student.pronoun}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
