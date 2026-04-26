const BASE_URL = "http://localhost:3000";

async function getStudents() {
    const response = await fetch(`${BASE_URL}/students`);
    const students = await response.json();
    console.log(students);
    return students;
}

async function getStudentById(id) {
    const response = await fetch(`${BASE_URL}/students/${id}`);
    if (response.ok) {
        const student = await response.json();
        console.log(student);
        return student;
    } else {
        console.log(`Student with id: ${id} not found`);
        return null;
    }
}

async function deleteStudentById(id) {
    console.log(`Attempting to delete student with id: ${id}`);
    const response = await fetch(`${BASE_URL}/students/${id}`, {
        method: 'DELETE'
    });
    if (response.ok) {
        const result = await response.json();
        console.log(result);
        return result;
    } else {
        console.log(`Student with id: ${id} not found`);
        return null;
    }
}

async function updateStudent(student) {
    const response = await fetch(`${BASE_URL}/students/${student.id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(student)
    });
    if (response.ok) {
        const updatedStudent = await response.json();
        console.log(updatedStudent);
        return updatedStudent;
    } else {
        console.log(`Student with id: ${student.id} not found`);
        return null;
    }
}

async function searchStudentsByName(name) {
    const response = await fetch(`${BASE_URL}/search?firstName=${encodeURIComponent(name)}`);
    if (response.ok) {
        const foundStudents = await response.json();
        console.log(foundStudents);
        return foundStudents;
    } else {
        console.log(`Error searching for students with name: ${name}`);
        return [];
    }
}

async function createStudent(student) {
    const response = await fetch(`${BASE_URL}/students`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(student)
    });
    if (response.ok) {
        const newStudent = await response.json();
        console.log(newStudent);
        return newStudent;
    } else {
        console.log(`Error creating student`);
        return null;
    }
}