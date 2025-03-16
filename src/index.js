"use strict"
const BASE_URL = 'http://localhost:3000/students';
const getBtn = document.querySelector('#get-students-btn');
const postNew = document.querySelector('#add-student-form');
const studentsTable = document.querySelector('#students-table');

// Отримання студентів
function getStudents() {
    return fetch(BASE_URL)
        .then(response => response.json())
        .then(data => {
            console.log(data); // Додаємо лог для перевірки
            return data;
        })
        .catch(error => console.error(error));
}

// Функція рендерингу студентів
function renderStudents(students) {
    if (!Array.isArray(students)) {
        console.error(students);
        return;
    }

    studentsTable.innerHTML = students.map(student => `
        <tr data-id="${student.id}">
          <td>${student.id}</td>
          <td>
            ${student.name}
            <input type="text" id="newName-${student.id}" placeholder="Нове ім'я">
          </td>
          <td>
            ${student.course}
            <input type="text" id="newCourse-${student.id}" placeholder="Новий курс">
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
      `).join('');

    document.querySelectorAll('.updateBtn').forEach(button => {
        button.addEventListener('click', updateStudent);
    });

    document.querySelectorAll('.deleteBtn').forEach(button => {
        button.addEventListener('click', deleteStudent);
    });
}

// Викликати при натисканні кнопки
getBtn.addEventListener('click', () => {
    getStudents().then(students => {
        if (students) renderStudents(students);
    });
});

// Додавання нового студента
function addStudent(e) {
    e.preventDefault();
    const newStudent = {
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
    .then(response => response.json())
    .then(() => getStudents().then(students => renderStudents(students)))
    .catch(error => console.error(error));
}

postNew.addEventListener('submit', addStudent);

function updateStudent(e) {
  e.preventDefault();
  const studentId = e.target.dataset.id;
  fetch(`${BASE_URL}/${studentId}`)
      .then(r => r.json())
      .then(currentStudent => {
          const updatedSt = {
              name: document.querySelector(`#newName-${studentId}`).value || currentStudent.name,
              course: document.querySelector(`#newCourse-${studentId}`).value || currentStudent.course,
              skills: document.querySelector(`#newSkills-${studentId}`).value || currentStudent.skills,
              email: document.querySelector(`#newEmail-${studentId}`).value || currentStudent.email,
              isEnrolled: document.querySelector(`#newIsEnrolled-${studentId}`).checked
          };
          console.log("Перед відправкою:", updatedSt);

          return fetch(`${BASE_URL}/${studentId}`, {
              method: 'PUT',
              body: JSON.stringify(updatedSt),
              headers: { "Content-Type": "application/json" }
          });
      })
      .then(r => r.json())
      .then(data => {
          console.log(data);
          alert(`Студент ${data.name} оновлений!`);
          return getStudents().then(students => renderStudents(students));
      })
      .catch(error => console.error(error));
      
      document.querySelectorAll('.updateBtn').forEach(button => {
        button.addEventListener('click', updateStudent);
    });
    document.querySelectorAll('.deleteBtn').forEach(button => {
        button.addEventListener('click', deleteStudent);
    });
    
}


function deleteStudent(e) {
    e.preventDefault();
    const studentId = e.target.dataset.id;

    fetch(`${BASE_URL}/${studentId}`, { method: 'DELETE' })
    .then(() => getStudents().then(students => renderStudents(students)))
    .catch(error => console.error(error));
}
