"use strict";
const BASE_URL = 'http://localhost:3000/students';
const getBtn = document.querySelector('#get-students-btn');
const postNew = document.querySelector('#add-student-form');
const studentsTable = document.querySelector('#students-table');
// Отримання студентів
function getStudents() {
    return fetch(BASE_URL).then((response)=>{
        if (!response.ok) throw new Error("\u041F\u043E\u043C\u0438\u043B\u043A\u0430 \u0437\u0430\u0432\u0430\u043D\u0442\u0430\u0436\u0435\u043D\u043D\u044F \u0441\u0442\u0443\u0434\u0435\u043D\u0442\u0456\u0432");
        return response.json();
    }).catch((error)=>console.error(error));
}
// const fetchStudents = async () => {
//     const response = await fetch('http://localhost:3000/students');
//           const students = await response.json();
//           return students;
// }
// const getStudents = async () => {
//     try {
//         const students = await fetchStudents();
//         console.log(students);
//     }
//     catch (error) {
// console.log(error);
//     }
// };
// getStudents();
// Функція рендерингу студентів
function renderStudents(students) {
    if (!Array.isArray(students)) return console.error(students);
    studentsTable.innerHTML = students.map((student)=>`
        <tr data-id="${student.id}">
          <td>${student.id}</td>
          <td>
           <p class="currentName"> ${student.name} </p>
            <input type="text" class="newName" data-id="${student.id}" placeholder="\u{41D}\u{43E}\u{432}\u{435} \u{456}\u{43C}'\u{44F}">
          </td>
          <td>
           <p class="currentCourse"> ${student.course}</p>
            <input type="text" class="newCourse" data-id="${student.id}" placeholder="\u{41D}\u{43E}\u{432}\u{438}\u{439} \u{43A}\u{443}\u{440}\u{441}">
          </td>
          <td>
           <p class="currentSkills"> ${student.skills}</p>
            <input type="text" class="newSkills" data-id="${student.id}" placeholder="\u{41D}\u{43E}\u{432}\u{456} \u{43D}\u{430}\u{432}\u{438}\u{447}\u{43A}\u{438}">
          </td>
          <td>
           <p class="currentEmail"> ${student.email}</p>
            <input type="email" class="newEmail" data-id="${student.id}" placeholder="\u{41D}\u{43E}\u{432}\u{438}\u{439} email">
          </td>
          <td>
            ${student.isEnrolled ? "\u0422\u0430\u043A" : "\u041D\u0456"}
            <input type="checkbox" class="newIsEnrolled" data-id="${student.id}" ${student.isEnrolled ? "checked" : ""}>
          </td>
          <td>
            <button class="updateBtn" data-id="${student.id}">\u{41E}\u{43D}\u{43E}\u{432}\u{438}\u{442}\u{438}</button>
            <button class="deleteBtn" data-id="${student.id}">\u{412}\u{438}\u{434}\u{430}\u{43B}\u{438}\u{442}\u{438}</button>
          </td>
        </tr>
      `).join('');
    document.querySelectorAll('.updateBtn').forEach((button)=>{
        button.addEventListener('click', handleUpdateStudent);
    });
    document.querySelectorAll('.deleteBtn').forEach((button)=>{
        button.addEventListener('click', handleDeleteStudent);
    });
}
getBtn.addEventListener('click', getStudents());
postNew.addEventListener('submit', (e)=>{
    e.preventDefault();
    const newStudent = {
        name: document.querySelector('#name').value,
        course: document.querySelector('#course').value,
        skills: document.querySelector('#skills').value,
        email: document.querySelector('#email').value,
        isEnrolled: document.querySelector('#isEnrolled').checked
    };
    fetch(BASE_URL, {
        method: 'POST',
        body: JSON.stringify(newStudent),
        headers: {
            "Content-Type": "application/json"
        }
    }).then((response)=>response.json()).then(()=>getStudents().then(renderStudents)).catch((error)=>console.error(error));
});
function handleUpdateStudent(e) {
    e.preventDefault();
    const studentId = e.target.dataset.id;
    const updatedSt = {
        name: document.querySelector(`.newName[data-id='${studentId}']`).value || document.querySelector('.currentName').textContent,
        course: document.querySelector(`.newCourse[data-id='${studentId}']`).value || document.querySelector('.currentCourse').textContent,
        skills: document.querySelector(`.newSkills[data-id='${studentId}']`).value || document.querySelector('.currentSkills').textContent,
        email: document.querySelector(`.newEmail[data-id='${studentId}']`).value || document.querySelector('.currentEmail').textContent,
        isEnrolled: document.querySelector(`.newIsEnrolled[data-id='${studentId}']`).checked
    };
    fetch(`${BASE_URL}/${studentId}`, {
        method: 'PUT',
        body: JSON.stringify(updatedSt),
        headers: {
            "Content-Type": "application/json"
        }
    }).then((response)=>{
        if (!response.ok) throw new Error("\u041F\u043E\u043C\u0438\u043B\u043A\u0430 \u043E\u043D\u043E\u0432\u043B\u0435\u043D\u043D\u044F \u0441\u0442\u0443\u0434\u0435\u043D\u0442\u0430");
        return response.json();
    }).then(()=>getStudents().then(renderStudents)).catch((error)=>console.error(error));
}
function handleDeleteStudent(e) {
    e.preventDefault();
    const studentId = e.target.dataset.id;
    fetch(`${BASE_URL}/${studentId}`, {
        method: 'DELETE'
    }).then(()=>getStudents().then(renderStudents)).catch((error)=>console.error(error));
}

//# sourceMappingURL=index.579125c3.js.map
