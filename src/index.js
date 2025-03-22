"use strict";
const BASE_URL = "http://localhost:3000/students";
const getBtn = document.querySelector("#get-students-btn");
const postNew = document.querySelector("#add-student-form");
const studentsTable = document.querySelector("#students-table");

async function getStudents() {
    try {
        const r = await fetch(BASE_URL);
        const data = await r.json();
        console.log(data);
        renderStudents(data);
    } catch (error) {
        console.log(error);
    }
}

function renderStudents(students) {
    if (!Array.isArray(students)) return console.error(students);

    studentsTable.innerHTML = students
        .map(
            (student) => `
        <tr data-id="${student.id}">
          <td>${student.id}</td>
          <td>
           <p class="currentName">${student.name}</p>
            <input type="text" class="newName" data-id="${student.id}" placeholder="Нове ім'я">
          </td>
          <td>
           <p class="currentCourse">${student.course}</p>
            <input type="text" class="newCourse" data-id="${student.id}" placeholder="Новий курс">
          </td>
          <td>
           <p class="currentSkills">${student.skills}</p>
            <input type="text" class="newSkills" data-id="${student.id}" placeholder="Нові навички">
          </td>
          <td>
           <p class="currentEmail">${student.email}</p>
            <input type="email" class="newEmail" data-id="${student.id}" placeholder="Новий email">
          </td>
          <td>
            ${student.isEnrolled ? "Так" : "Ні"}
            <input type="checkbox" class="newIsEnrolled" data-id="${student.id}" ${student.isEnrolled ? "checked" : ""}>
          </td>
          <td>
            <button class="updateBtn" data-id="${student.id}">Оновити</button>
            <button class="deleteBtn" data-id="${student.id}">Видалити</button>
          </td>
        </tr>
      `
        )
        .join("");

    document.querySelectorAll(".updateBtn").forEach((button) => {
        button.addEventListener("click", (e) => {
            const studentId = e.target.dataset.id;
            updateStudent(studentId, {
                name: document.querySelector(`.newName[data-id='${studentId}']`).value || document.querySelector(`tr[data-id='${studentId}'] .currentName`).textContent,
                course: document.querySelector(`.newCourse[data-id='${studentId}']`).value || document.querySelector(`tr[data-id='${studentId}'] .currentCourse`).textContent,
                skills: document.querySelector(`.newSkills[data-id='${studentId}']`).value || document.querySelector(`tr[data-id='${studentId}'] .currentSkills`).textContent,
                email: document.querySelector(`.newEmail[data-id='${studentId}']`).value || document.querySelector(`tr[data-id='${studentId}'] .currentEmail`).textContent,
                isEnrolled: document.querySelector(`.newIsEnrolled[data-id='${studentId}']`).checked,
            });
        });
    });

    document.querySelectorAll(".deleteBtn").forEach((button) => {
        button.addEventListener("click", (e) => deleteStudent(e.target.dataset.id));
    });
}

getBtn.addEventListener("click", () => getStudents());

async function addStudent(student) {
    try {
        const r = await fetch(`${BASE_URL}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(student),
        });
        const data = await r.json();
        console.log(data);
        getStudents(); 
    } catch (error) {
        console.log(error);
    }
}

postNew.addEventListener("submit", (e) => {
    e.preventDefault();
    addStudent({
        name: document.querySelector("#name").value,
        course: document.querySelector("#course").value,
        skills: document.querySelector("#skills").value,
        email: document.querySelector("#email").value,
        isEnrolled: document.querySelector("#isEnrolled").checked,
    });
});

async function updateStudent(id, patched) {
    try {
        const r = await fetch(`${BASE_URL}/${id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(patched),
        });
        const data = await r.json();
        console.log(data);
        getStudents(); 
    } catch (error) {
        console.log(error);
    }
};

async function deleteStudent(id) {
    try {
        await fetch(`${BASE_URL}/${id}`, {
            method: "DELETE",
        });
        console.log(id);
        getStudents();
    } catch (error) {
        console.log(error);
    }
};