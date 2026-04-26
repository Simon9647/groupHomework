# Week 12 - Refactoring to Use First and Last Names

## Summary of Changes

The student management system has been successfully refactored to accept first names and last names as separate values instead of a single name field. All required components have been updated.

---

## 1. **Node.js Backend (nodeWebServer/src/server.js)**

### Student Objects
- **Before:** `{ id, name, age, major }`
- **After:** `{ id, firstName, lastName, age, major }`

### Updated Endpoints

#### POST /students
- **Changed from:** Accepting `name` parameter
- **Changed to:** Accepting `firstName` and `lastName` parameters
- Creates students with separate first and last name fields

#### PUT /students/:id
- **Changed from:** Accepting `name` parameter
- **Changed to:** Accepting `firstName` and `lastName` parameters
- Updates students with separate first and last name fields

#### GET /search
- **Enhanced:** Now searches by firstName, lastName, or fullName (combined)
- Matches queries against:
  - Full name (firstName + lastName)
  - First name only
  - Last name only

### Initial Data
All 10 sample students have been updated with:
- Separate firstName and lastName values
- Example: "Alice" became firstName: "Alice", lastName: "Smith"

---

## 2. **HTML Interface (Class2/studentExample2.html)**

### Add Modal (addModal)
- **Replaced:** Single "Name" input field
- **Added:** 
  - First Name input (`id="firstNameInput"`)
  - Last Name input (`id="lastNameInput"`)

### Edit Modal (editModal)
- **Replaced:** Single "Name" input field  
- **Added:**
  - First Name input (`id="editFirstNameInput"`)
  - Last Name input (`id="editLastNameInput"`)

### Table Headers
- **Before:** Single "Name" column
- **After:** Two columns
  - "First Name" column
  - "Last Name" column

---

## 3. **Client-Side JavaScript (Class2/studentExample2.js)**

### displayMap() Function
- Creates two separate columns: one for firstName, one for lastName
- First Name column contains a clickable button
- Maintains all edit and delete buttons functionality

### addNewStudent() Function
- **Validates:** firstName, lastName, age, and major (all required)
- Collects both firstName and lastName separately
- Sends to backend API with both properties

### setStudentData() Function
- Populates editFirstNameInput with student.firstName
- Populates editLastNameInput with student.lastName

### updateStudent() Function
- **Validates:** firstName, lastName, age, and major (all required)
- Collects both firstName and lastName separately
- Calls updateStudentAPI() to send data

### deleteStudent() Function
- Constructs full name: `${student.firstName} ${student.lastName}`
- Uses full name in delete confirmation dialog

### displaySearchResults() Function
- Creates two separate columns for firstName and lastName
- Maintains full table structure with 7 columns (ID, FirstName, LastName, Age, Major, Edit, Delete)
- Properly handles empty search results (colspan="7")

### clearSearch() Function
- **Enhanced:** Now fetches fresh student list from backend
- Re-displays complete student table

---

## 4. **API Wrapper (Class2/backend.js)**

### New Function: updateStudentAPI()
- Primary function for updating students via PUT request
- Sends firstName and lastName properties

### Backward Compatibility: updateStudent()
- Alias function that calls updateStudentAPI()
- Maintains backward compatibility if needed

---

## Testing Checklist

To verify all changes are working correctly:

- [ ] Open studentExample2.html in a browser
- [ ] Verify table shows both "First Name" and "Last Name" columns
- [ ] Add a new student - confirm both first and last name fields are required
- [ ] Verify added student appears in both firstName and lastName columns
- [ ] Edit an existing student - confirm both name fields can be modified
- [ ] Delete a student - confirm the dialog shows "FirstName LastName"
- [ ] Search by first name
- [ ] Search by last name
- [ ] Search by full name (first + last)
- [ ] Clear search returns to full list

---

## Files Modified

1. `nodeWebServer/src/server.js` - Backend API and data structure
2. `Class2/studentExample2.html` - UI forms and table
3. `Class2/studentExample2.js` - Client-side logic
4. `Class2/backend.js` - API wrapper functions

---

## Server Status

The Node.js server is configured to run on **http://localhost:3000**

To start the server:
```bash
cd nodeWebServer
npm install  # If dependencies not yet installed
npm start    # or: node src/server.js
```

The server will listen on port 3000 and be ready to serve the API endpoints.
