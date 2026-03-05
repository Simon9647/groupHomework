const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

let myMap = new Map();
init();

function init() { //populate the map with some initial data
    let student1 = { id: 1, name: "Alice", age: 20, major: "Computer Science" };
    let student2 = { id: 2, name: "Bob", age: 22, major: "Mathematics" };
    let student3 = { id: 3, name: "Charlie", age: 21, major: "Physics" };
    let student4 = { id: 4, name: "David", age: 23, major: "Chemistry" };
    let student5 = { id: 5, name: "Eve", age: 20, major: "Biology" };
    let student6 = { id: 6, name: "Frank", age: 22, major: "Engineering" };
    let student7 = { id: 7, name: "Grace", age: 21, major: "Economics" };
    let student8 = { id: 8, name: "Heidi", age: 23, major: "Philosophy" };
    let student9 = { id: 9, name: "Ivan", age: 20, major: "Art History" };
    let student10 = { id: 10, name: "Judy", age: 22, major: "Political Science" };
    myMap.set(student1.id, student1);
    myMap.set(student2.id, student2);
    myMap.set(student3.id, student3);
    myMap.set(student4.id, student4);
    myMap.set(student5.id, student5);
    myMap.set(student6.id, student6);
    myMap.set(student7.id, student7);
    myMap.set(student8.id, student8);
    myMap.set(student9.id, student9);
    myMap.set(student10.id, student10);

}

let nextId = 11;

app.get('/students', (req, res) => {
    console.log("Getting all students");
    console.log("Current students in map: ", Array.from(myMap.values()));
    res.json(Array.from(myMap.values()));
});

app.get('/students/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const student = myMap.get(id);
    console.log(`Getting student with id: ${id}`);
    console.log("Current student: ", student);
    if (student) {
        res.json(student);
    } else {
        res.status(404).json({ error: "Student not found" });
    }
});

app.post('/students', (req, res) => {
    const { name, age, major } = req.body;
    if (!name || !age || !major) {
        return res.status(400).json({ error: "Name, age, and major are required" });
    }
    const newStudent = { id: nextId++, name, age, major };
    myMap.set(newStudent.id, newStudent);
    res.status(201).json(newStudent);
});

app.delete('/students/:id', (req, res) => {
    const id = parseInt(req.params.id);
    console.log(`Deleting student with id: ${id}`);
    if (myMap.has(id)) {
        myMap.delete(id);
        console.log(`Student with id: ${id} deleted successfully`);
        res.json({ message: "Student deleted successfully" });
    } else {
        console.log(`Student with id: ${id} not found`);
        res.status(404).json({ error: "Student not found" });
    }
});

app.put('/students/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const { name, age, major } = req.body;
    if (!name || !age || !major) {
        return res.status(400).json({ error: "Name, age, and major are required" });
    }
    if (myMap.has(id)) {
        const updatedStudent = { id, name, age, major };
        myMap.set(id, updatedStudent);
        res.json(updatedStudent);
    } else {
        console.log(`Student with id: ${id} not found`);
        res.status(404).json({ error: "Student not found" });
    }
});

app.get('/search', (req, res) => {
    const name = req.query.name || "";
    console.log("Search query: ", name);

    //get all students from the map 
    const students = Array.from(myMap.values());
    console.log("Current students in map: ", students); 
    let foundStudents = [];

    let student = null;
    for (let i = 0; i < students.length; i++) {
        let n = students[i].name.toLowerCase();
        if ((n === name.toLowerCase())) {
            student = students[i];
            foundStudents.push(student);
        }
        else {
            if (n.includes(name.toLowerCase())) {
                student = students[i];
                foundStudents.push(student);
            }
            else {
                if (n.startsWith(name.toLowerCase())) {
                    student = students[i];
                    foundStudents.push(student);
                }
                else {
                    if (n.endsWith(name.toLowerCase())) {
                        student = students[i];
                        foundStudents.push(student);
                    }
                }
            }
        }
    }
    res.json(foundStudents);
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});