import React, { useState} from "react";
import "./App.css"; // Import your styles

function App() {
  const [rawData, setRawData] = useState("");
  const [students, setStudents] = useState([]);
  const [minGroupSize, setMinGroupSize] = useState(0);
  const [maxGroupSize, setMaxGroupSize] = useState(0);
  const [groups, setGroups] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [lockedGroups, setLockedGroups] = useState([]);
  const [lockedStudents, setLockedStudents] = useState([]);
  

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
  
    const unlockedStudents = students.filter(
      (student, index) => !lockedStudents.includes(index)
    );
    shuffleArray(unlockedStudents);
  
    const totalGroups = Math.ceil(unlockedStudents.length / maxGroupSize);
  
    // Initialize groupArr with empty arrays for unlocked groups
    const groupArr = Array(totalGroups)
      .fill(null)
      .map((_, i) => (lockedGroups.includes(i) ? groups[i] : []));
  
    const remainingStudents = [...unlockedStudents];
  
    for (let i = 0; i < totalGroups; i++) {
      if (lockedGroups.includes(i)) continue;
  
      const groupSize = Math.min(
        Math.floor(Math.random() * (maxGroupSize - minGroupSize + 1) + minGroupSize),
        remainingStudents.length
      );
      const group = remainingStudents.splice(0, groupSize);
      if (group.length > 0) {
        groupArr[i] = group;
      }
    }
  
    setGroups(groupArr);
  }
  
  

  function handleStudentClick(groupIndex, studentIndex) {
    if (selectedStudent === null) {
      setSelectedStudent({ groupIndex, studentIndex });
    } else {
      const newGroups = [...groups];
      const temp = newGroups[groupIndex][studentIndex];
      newGroups[groupIndex][studentIndex] = newGroups[selectedStudent.groupIndex][selectedStudent.studentIndex];
      newGroups[selectedStudent.groupIndex][selectedStudent.studentIndex] = temp;
      setGroups(newGroups);
      setSelectedStudent(null);
    }
  }
  function handleGroupClick(groupIndex) {
    if (selectedStudent !== null) {
      const newGroups = [...groups];
      newGroups[groupIndex].push(newGroups[selectedStudent.groupIndex][selectedStudent.studentIndex]);
      newGroups[selectedStudent.groupIndex].splice(selectedStudent.studentIndex, 1);
      setGroups(newGroups);
      setSelectedStudent(null);
    }
  }
  function handleGroupDoubleClick(groupIndex) {
    if (lockedGroups.includes(groupIndex)) {
      setLockedGroups(lockedGroups.filter((i) => i !== groupIndex));
    } else {
      setLockedGroups([...lockedGroups, groupIndex]);
    }
  }
  
  
  function handleStudentDoubleClick(studentIndex) {
    if (lockedStudents.includes(studentIndex)) {
      setLockedStudents(lockedStudents.filter((i) => i !== studentIndex));
    } else {
      setLockedStudents([...lockedStudents, studentIndex]);
    }
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
      <button className="btn btn-warning mt-3" onClick={generateGroups}>
  Randomize Unlocked Groups
</button>

      <div className="groups mt-3">
        <h2>Groups</h2>
        <div className="row">
          {groups.map((group, groupIndex) => (
            <div
            className={`card col-md-4 ${lockedGroups.includes(groupIndex) ? "border-primary" : ""}`}
            onDoubleClick={() => handleGroupDoubleClick(groupIndex)}
          >
          
          
              <div className="card">
              <div
    className="card-header"
    onClick={() => handleGroupClick(groupIndex)}
    onDoubleClick={() => handleGroupDoubleClick(groupIndex)}
  
    style={{ cursor: selectedStudent !== null ? "pointer" : "default" }}
  >
  

  Group Number {groupIndex + 1}

                </div>
                <ul className="list-group list-group-flush">
                {group.map((student, studentIndex) => (
  <li
    key={`${studentIndex}-${student.name}`}
    className={`list-group-item ${selectedStudent && selectedStudent.groupIndex === groupIndex && selectedStudent.studentIndex === studentIndex ? "bg-primary text-white" : ""}`}
    onClick={() => handleStudentClick(groupIndex, studentIndex)}

  >
    {student.name}
    <span className="badge badge-secondary ml-2">{student.grade}</span>
    <span className="badge badge-info ml-1">{student.pronoun}</span>
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
            {students.map((student, index) => (
             <tr
             key={student.name}
             className={`${lockedStudents.includes(index) ? "bg-primary text-white" : ""}`}
             onDoubleClick={() => handleStudentDoubleClick(index)}
           >
           
           
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
