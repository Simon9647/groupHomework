
init();

async function init() { //populate the map with some initial data
    const students = await getStudents();
    displayMap(students);

}


function displayMap(students) {
    const tableBody = document.getElementById("studentTableBody");
    while (tableBody.firstChild) {
        tableBody.removeChild(tableBody.firstChild);
    }

    students.forEach(student => {
        const tr = document.createElement("tr");
        const tdId = document.createElement("td");
        tdId.textContent = student.id;
        tr.appendChild(tdId);

        // First name as plain text
        const tdName = document.createElement("td");
        tdName.textContent = student.name;
        tr.appendChild(tdName);

        // Last name as a clickable link
        const tdLastName = document.createElement("td");
        const lastNameButton = document.createElement("button");
        lastNameButton.type = "button";
        lastNameButton.className = "btn btn-link";
        lastNameButton.textContent = student.lastName || "";
        lastNameButton.onclick = function () {
            viewStudent(student.id);
        };
        tdLastName.appendChild(lastNameButton);
        tr.appendChild(tdLastName);

        const tdAge = createAgeColumn(student);
        tr.appendChild(tdAge);

        const tdMajor = document.createElement("td");
        tdMajor.textContent = student.major;
        tr.appendChild(tdMajor);

        const tdEdit = document.createElement("td");
        const editButton = document.createElement("button");
        editButton.type = "button";
        editButton.setAttribute("id", `editButton-${student.id}`);
        editButton.className = "btn btn-primary btn-sm";
        editButton.textContent = "Edit";
        editButton.onclick = function () {
            editStudent(student.id);
        }
        tdEdit.appendChild(editButton);
        tr.appendChild(tdEdit);

        const tdDelete = document.createElement("td");
        const deleteButton = document.createElement("button");
        deleteButton.type = "button";
        deleteButton.setAttribute("id", `deleteButton-${student.id}`);
        deleteButton.className = "btn btn-danger btn-sm";
        deleteButton.textContent = "Delete";
        deleteButton.onclick = function () {
            deleteStudent(student.id);
        };
        tdDelete.appendChild(deleteButton);
        tr.appendChild(tdDelete);

        tableBody.appendChild(tr);
    });
}

function createAgeColumn(student) {
    const tdAge = document.createElement("td");
    const span = document.createElement("span");
    span.textContent = student.age;
    if (student.age < 21) {
        span.classList.add("badge", "bg-warning");
    } else if (student.age === 21) {
        span.classList.add("badge", "bg-success");
    } else {
        span.classList.add("badge", "bg-info");
    }
    tdAge.appendChild(span);
    return tdAge;
}

function disabeEditDeleteButtons(id) {
    const editButton = document.getElementById(`editButton-${id}`);
    const deleteButton = document.getElementById(`deleteButton-${id}`);
    if (editButton) editButton.disabled = true;
    if (deleteButton) deleteButton.disabled = true;
}


async function addNewStudent() {
    let student = { id: 0, name: "", lastName: "", age: 0, major: "" };
    const nameInput = document.getElementById("nameInput");
    const lastNameInput = document.getElementById("lastNameInput");
    const ageInput = document.getElementById("ageInput");
    const majorInput = document.getElementById("majorInput");
    if (!nameInput.value || !lastNameInput.value || !ageInput.value || !majorInput.value) {
        alert("Please fill in all fields.");
        return;
    }

    student.id = 0; // ID will be assigned by the backend
    student.name = nameInput.value;
    student.lastName = lastNameInput.value;
    student.age = parseInt(ageInput.value);
    student.major = majorInput.value;
    console.log("Added student:", student);
    nameInput.value = "";
    lastNameInput.value = "";
    ageInput.value = "";
    majorInput.value = "";
    let newStudent = await createStudent(student);
    console.log("Created student:", newStudent);

    let students = await getStudents();
    
    //Hide the modal after adding the student
    hideModal("addModal");
    displayMap(students);
}

function hideModal(modalId) {
    const modal = document.getElementById(modalId);
    const modalInstance = bootstrap.Modal.getInstance(modal);
    modalInstance.hide();
}

async function doSearchStudentByName() {
    const nameInput = document.getElementById("searchNameInput");
    const name = nameInput.value;
    console.log("Searching for student with Name:", name);
    if (!name) {
        alert("Please enter a valid Name.");
        return
    }

    let foundStudents = await searchStudentsByName(name);
    console.log("Search result:", foundStudents);
    if (foundStudents.length > 0) {
        displaySearchResults(foundStudents);
    } else {
        displaySearchResults([]);
    }
}

function displaySearchResults(students) {
    const tableBody = document.getElementById("studentTableBody");
    tableBody.innerHTML = ""; // Clear existing rows
    if (students.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="6" class="text-center">No students found.</td></tr>`;
    } else {
        students.forEach(student => {
            const tr = document.createElement("tr");
            const tdId = document.createElement("td");
            tdId.textContent = student.id;
            tr.appendChild(tdId);

            const tdName = document.createElement("td");
            const nameButton = document.createElement("button");
            nameButton.type = "button";
            nameButton.className = "btn btn-link";
            nameButton.textContent = student.name;
            nameButton.onclick = function () {
                viewStudent(student.id);
            };
            tdName.appendChild(nameButton);
            tr.appendChild(tdName);

            const tdLastName = document.createElement("td");
            tdLastName.textContent = student.lastName || "";
            tr.appendChild(tdLastName);
            const tdAge = createAgeColumn(student);
            
            tr.appendChild(tdAge);

            const tdMajor = document.createElement("td");
            tdMajor.textContent = student.major;
            tr.appendChild(tdMajor);

            const tdEdit = document.createElement("td");
            tr.appendChild(tdEdit);

            const tdDelete = document.createElement("td");
            tr.appendChild(tdDelete);

            tableBody.appendChild(tr);

        });
    }
}

function clearSearch() {
    const nameInput = document.getElementById("searchNameInput");
    nameInput.value = "";
    displayMap();
}

async function fetchStudent(id) {
    const student = await getStudentById(id);
    return student;
}

function setStudentData(student) {
    document.getElementById("editIdInput").value = student.id;
    document.getElementById("editNameInput").value = student.name;
    document.getElementById("editAgeInput").value = student.age;
    document.getElementById("editMajorInput").value = student.major;
}

async function viewStudent(id) {
    const student = await fetchStudent(id);
    console.log("Fetch student result:", student);
    if (student) {
        let btnEdit = document.getElementById("btnEdit");
        btnEdit.style.display = "none";

        setStudentData(student);
        const modal = document.getElementById("editModal");
        const modalInstance = new bootstrap.Modal(modal);
        modalInstance.show();
    } else {
        alert(`Student with ID "${id}" not found in the map.`);
    }
}

async function editStudent(id) {
    const student = await fetchStudent(id);
    console.log("Fetch student result:", student);
    if (student) {
        let btnEdit = document.getElementById("btnEdit");
        btnEdit.style.display = "block";
        setStudentData(student);
        const modal = document.getElementById("editModal");
        const modalInstance = new bootstrap.Modal(modal);
        modalInstance.show();
    } else {
        alert(`Student with ID "${id}" not found in the map.`);
    }
}

async function updateStudent() {
    const idInput = document.getElementById("editIdInput");
    const nameInput = document.getElementById("editNameInput");
    const ageInput = document.getElementById("editAgeInput");
    const majorInput = document.getElementById("editMajorInput");
    if (!nameInput.value || !ageInput.value || !majorInput.value) {
        alert("Please fill in all fields.");
        return;
    }
    let student = { id: 0, name: "", age: 0, major: "" };
    student.id = parseInt(idInput.value);
    student.name = nameInput.value;
    student.age = parseInt(ageInput.value);
    student.major = majorInput.value;
    console.log("Updated student:", student);
    let updatedStudent = await updateStudent(student);
    console.log("Updated student result:", updatedStudent);

    let students = await getStudents();
    hideModal("editModal");
    displayMap(students);
}

async function deleteStudent(id) {
    let student = await fetchStudent(id);
    console.log("Fetch student result:", student);
    if (student) {
        let confirmDelete = confirm(`Are you sure you want to delete student "${student.name}"?`);
        console.log("Confirm delete:", confirmDelete);
        if (confirmDelete) {
            const result = await deleteStudentById(id);
            console.log("Delete student result:", result);
            let students = await getStudents();
            displayMap(students);
        }
    }
    else {
        alert(`Student with ID "${id}" not found in the map.`);
    }
}