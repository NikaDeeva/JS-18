"use strict"
const BASE_URL = 'http://localhost:3000/students';
const getBtn = document.querySelector('#get-students-btn');
const postNew = document.querySelector('#add-student-form');
const studentsTable = document.querySelector('#students-table');

function getStudents() {
    return fetch(BASE_URL)
        .then(r => r.json())
        .then(data => console.log(data))
        .catch(error => console.error(error));
}

function renderStudents(students) {
    const student = students.map(student => console.log(student));
    const markUp = `
        <tr data-id="${student.id}">
          <td>${student.id}</td>
          <td>
            ${student.name}
            <input type="text" id="newName-${student.id}" placeholder="Нове ім'я">
          </td>
          <td>
            ${student.course}
            <input type="number" id="newCourse-${student.id}" placeholder="Новий курс">
          </td>
          <td>
            ${student.skills}
            <input type="text" id="newSkills-${student.id}" placeholder="Нові навички">
          </td>
          <td>
            ${student.email}
            <input type="email" id="newEmail-${student.id}" placeholder="Новий email">
          </td>
          <td>
            ${student.isEnrolled ? "Так" : "Ні"}
            <input type="checkbox" id="newIsEnrolled-${student.id}" ${student.isEnrolled ? "checked" : ""}>
          </td>
          <td>
            <button class="updateBtn" data-id="${student.id}">Оновити</button>
            <button class="deleteBtn" data-id="${student.id}">Видалити</button>
          </td>
        </tr>
      `;
studentsTable.insertAdjacentHTML("beforeend", markUp);
    document.querySelectorAll('.updateBtn').forEach(button => {
        button.addEventListener('click', updateStudent);
    });

    document.querySelectorAll('.deleteBtn').forEach(button => {
        button.addEventListener('click', deleteStudent);
    });
}

getBtn.addEventListener('click', () => {
    getStudents().then(students => renderStudents(students));
});

function addStudent(e) {
    e.preventDefault();
    const newStudent = {
        id: document.querySelector('#id').value,
        name: document.querySelector('#name').value,
        course: document.querySelector('#course').value,
        skills: document.querySelector('#skills').value,
        email: document.querySelector('#email').value,
        isEnrolled: document.querySelector('#isEnrolled').checked,
    };

    fetch(BASE_URL, {
        method: 'POST',
        body: JSON.stringify(newStudent),
        headers: { "Content-Type": "application/json" }
    })
    .then(r => r.json())
    .then(() => getStudents().then(students => renderStudents(students)))
    .catch(error => console.error(error));
}

postNew.addEventListener('submit', addStudent);

function updateStudent(e) {
    e.preventDefault();
    const studentId = e.target.dataset.id;
    const updatedSt = {
        name: document.querySelector(`#newName-${studentId}`).value,
        course: document.querySelector(`#newCourse-${studentId}`).value,
        skills: document.querySelector(`#newSkills-${studentId}`).value,
        email: document.querySelector(`#newEmail-${studentId}`).value,
        isEnrolled: document.querySelector(`#newIsEnrolled-${studentId}`).checked
    };

    fetch(`${BASE_URL}/${studentId}`, {
        method: 'PUT',
        body: JSON.stringify(updatedSt),
        headers: { "Content-Type": "application/json" }
    })
    .then(() => getStudents().then(students => renderStudents(students)))
    .catch(error => console.error(error));
}

function deleteStudent(e) {
    e.preventDefault();
    const studentId = e.target.dataset.id;

    fetch(`${BASE_URL}/${studentId}`, { method: 'DELETE' })
    .then(() => getStudents().then(students => renderStudents(students)))
    .catch(error => console.error(error));
}
