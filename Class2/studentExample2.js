
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

        const tdFirstName = document.createElement("td");
        tdFirstName.textContent = student.firstName;
        tr.appendChild(tdFirstName);

        const tdLastName = document.createElement("td");
        const lastNameButton = document.createElement("button");
        lastNameButton.type = "button";
        lastNameButton.className = "btn btn-link";
        lastNameButton.textContent = student.lastName;
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
    let student = { id: 0, firstName: "", lastName: "", age: 0, major: "" };
    const firstNameInput = document.getElementById("firstNameInput");
    const lastNameInput = document.getElementById("lastNameInput");
    const ageInput = document.getElementById("ageInput");
    const majorInput = document.getElementById("majorInput");
    if (!firstNameInput.value || !lastNameInput.value || !ageInput.value || !majorInput.value) {
        alert("Please fill in all fields.");
        return;
    }

    student.id = 0; // ID will be assigned by the backend
    student.firstName = firstNameInput.value;
    student.lastName = lastNameInput.value;
    student.age = parseInt(ageInput.value);
    student.major = majorInput.value;
    console.log("Added student:", student);
    firstNameInput.value = "";
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
        tableBody.innerHTML = `<tr><td colspan="7" class="text-center">No students found.</td></tr>`;
    } else {
        students.forEach(student => {
            const tr = document.createElement("tr");
            const tdId = document.createElement("td");
            tdId.textContent = student.id;
            tr.appendChild(tdId);

            const tdFirstName = document.createElement("td");
            tdFirstName.textContent = student.firstName;
            tr.appendChild(tdFirstName);

            const tdLastName = document.createElement("td");
            const lastNameButton = document.createElement("button");
            lastNameButton.type = "button";
            lastNameButton.className = "btn btn-link";
            lastNameButton.textContent = student.lastName;
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
}

async function clearSearch() {
    const nameInput = document.getElementById("searchNameInput");
    nameInput.value = "";
    let students = await getStudents();
    displayMap(students);
}

async function fetchStudent(id) {
    const student = await getStudentById(id);
    return student;
}

function setStudentData(student) {
    document.getElementById("editIdInput").value = student.id;
    document.getElementById("editFirstNameInput").value = student.firstName;
    document.getElementById("editLastNameInput").value = student.lastName;
    document.getElementById("editAgeInput").value = student.age;
    document.getElementById("editMajorInput").value = student.major;
}

async function viewStudent(id) {
    const student = await fetchStudent(id);
    console.log("Fetch student result:", student);
    if (student) {
        let headerText = document.getElementById("editModalLabel");
        headerText.textContent = `View Student`;
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
    const firstNameInput = document.getElementById("editFirstNameInput");
    const lastNameInput = document.getElementById("editLastNameInput");
    const ageInput = document.getElementById("editAgeInput");
    const majorInput = document.getElementById("editMajorInput");
    if (!firstNameInput.value || !lastNameInput.value || !ageInput.value || !majorInput.value) {
        alert("Please fill in all fields.");
        return;
    }
    let student = { id: 0, firstName: "", lastName: "", age: 0, major: "" };
    student.id = parseInt(idInput.value);
    student.firstName = firstNameInput.value;
    student.lastName = lastNameInput.value;
    student.age = parseInt(ageInput.value);
    student.major = majorInput.value;
    console.log("Updated student:", student);
    let updatedStudent = await updateStudentAPI(student);
    console.log("Updated student result:", updatedStudent);

    let students = await getStudents();
    hideModal("editModal");
    displayMap(students);
}

async function deleteStudent(id) {
    let student = await fetchStudent(id);
    console.log("Fetch student result:", student);
    if (student) {
        let fullName = `${student.firstName} ${student.lastName}`;
        let confirmDelete = confirm(`Are you sure you want to delete student "${fullName}"?`);
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