// ========================================
// Student Attendance Tracker - JavaScript
// ========================================

let students = JSON.parse(
    localStorage.getItem("students")
) || [];

let attendance = JSON.parse(
    localStorage.getItem("attendance")
) || {};


// ========================================
// PAGE LOAD
// ========================================

document.addEventListener("DOMContentLoaded", () => {

    setDate();

    setAttendanceDate();

    renderStudents();

    renderAttendance();

    updateDashboard();

    renderReports();

});


// ========================================
// DATE
// ========================================

function setDate() {

    const date = new Date();

    document.getElementById("currentDate").textContent =
        date.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        });
}


function setAttendanceDate() {

    const input =
        document.getElementById("attendanceDate");

    input.value =
        new Date().toISOString().split("T")[0];

}


// ========================================
// PAGE NAVIGATION
// ========================================

function showPage(pageName) {

    document.querySelectorAll(".page").forEach(page => {
        page.classList.remove("active");
    });

    document.querySelectorAll(".nav-item").forEach(item => {
        item.classList.remove("active");
    });


    document
        .getElementById(pageName + "Page")
        .classList.add("active");


    const buttons =
        document.querySelectorAll(".nav-item");

    const pages = [
        "dashboard",
        "students",
        "attendance",
        "reports"
    ];

    const index = pages.indexOf(pageName);

    if (buttons[index]) {
        buttons[index].classList.add("active");
    }


    const titles = {
        dashboard: "Dashboard",
        students: "Students",
        attendance: "Mark Attendance",
        reports: "Attendance Reports"
    };

    document.getElementById("pageTitle").textContent =
        titles[pageName];
}


// ========================================
// STUDENT MODAL
// ========================================

function openStudentModal() {

    document
        .getElementById("studentModal")
        .classList.add("show");

}


function closeStudentModal() {

    document
        .getElementById("studentModal")
        .classList.remove("show");

    document
        .getElementById("studentForm")
        .reset();

}


// ========================================
// ADD STUDENT
// ========================================

document
    .getElementById("studentForm")
    .addEventListener("submit", function(event) {

        event.preventDefault();


        const rollNo =
            document.getElementById("rollNo").value.trim();

        const name =
            document.getElementById("studentName").value.trim();

        const department =
            document.getElementById("department").value;

        const year =
            document.getElementById("studentYear").value;


        if (
            students.some(student =>
                student.rollNo === rollNo
            )
        ) {

            alert("Roll number already exists!");

            return;
        }


        const student = {

            id: Date.now(),

            rollNo: rollNo,

            name: name,

            department: department,

            year: year

        };


        students.push(student);

        saveStudents();

        renderStudents();

        renderAttendance();

        renderReports();

        updateDashboard();

        closeStudentModal();


        alert("Student added successfully!");

    });


// ========================================
// SAVE STUDENTS
// ========================================

function saveStudents() {

    localStorage.setItem(
        "students",
        JSON.stringify(students)
    );

}


// ========================================
// DISPLAY STUDENTS
// ========================================

function renderStudents() {

    const table =
        document.getElementById("studentTable");

    const search =
        document
            .getElementById("studentSearch")
            .value
            .toLowerCase();


    table.innerHTML = "";


    const filteredStudents =
        students.filter(student =>
            student.name.toLowerCase().includes(search) ||
            student.rollNo.toLowerCase().includes(search)
        );


    if (filteredStudents.length === 0) {

        table.innerHTML = `
            <tr>
                <td colspan="5"
                    style="text-align:center;padding:30px;">
                    No students found
                </td>
            </tr>
        `;

        return;
    }


    filteredStudents.forEach(student => {

        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>${student.rollNo}</td>

            <td>
                <strong>${student.name}</strong>
            </td>

            <td>${student.department}</td>

            <td>${student.year}</td>

            <td>

                <button
                    class="danger-btn"
                    onclick="deleteStudent(${student.id})"
                >
                    Delete
                </button>

            </td>
        `;


        table.appendChild(row);

    });

}


// ========================================
// DELETE STUDENT
// ========================================

function deleteStudent(id) {

    const student =
        students.find(item => item.id === id);


    if (!student) return;


    const confirmDelete =
        confirm(
            `Delete ${student.name}?`
        );


    if (!confirmDelete) return;


    students =
        students.filter(
            student => student.id !== id
        );


    saveStudents();

    renderStudents();

    renderAttendance();

    renderReports();

    updateDashboard();

}


// ========================================
// ATTENDANCE TABLE
// ========================================

function renderAttendance() {

    const table =
        document.getElementById(
            "attendanceTable"
        );


    table.innerHTML = "";


    if (students.length === 0) {

        table.innerHTML = `
            <tr>
                <td colspan="3"
                    style="text-align:center;padding:30px;">
                    Add students first
                </td>
            </tr>
        `;

        return;
    }


    const date =
        document.getElementById(
            "attendanceDate"
        ).value;


    const todayAttendance =
        attendance[date] || {};


    students.forEach(student => {

        const status =
            todayAttendance[student.id] ||
            "present";


        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>${student.rollNo}</td>

            <td>
                <strong>${student.name}</strong>
            </td>

            <td>

                <button
                    class="status-btn present-btn"
                    onclick="setStatus(
                        ${student.id},
                        'present'
                    )"
                    style="
                        opacity:
                        ${status === "present" ? "1" : "0.4"}
                    "
                >
                    ✓ Present
                </button>


                <button
                    class="status-btn absent-btn"
                    onclick="setStatus(
                        ${student.id},
                        'absent'
                    )"
                    style="
                        opacity:
                        ${status === "absent" ? "1" : "0.4"}
                    "
                >
                    ✕ Absent
                </button>

            </td>
        `;


        table.appendChild(row);

    });

}


// ========================================
// CHANGE DATE
// ========================================

document
    .getElementById("attendanceDate")
    .addEventListener("change", () => {

        renderAttendance();

    });


// ========================================
// SET ATTENDANCE STATUS
// ========================================

function setStatus(studentId, status) {

    const date =
        document.getElementById(
            "attendanceDate"
        ).value;


    if (!attendance[date]) {

        attendance[date] = {};

    }


    attendance[date][studentId] =
        status;


    localStorage.setItem(
        "attendance",
        JSON.stringify(attendance)
    );


    renderAttendance();

}


// ========================================
// MARK ALL
// ========================================

function markAll(status) {

    const date =
        document.getElementById(
            "attendanceDate"
        ).value;


    if (!attendance[date]) {

        attendance[date] = {};

    }


    students.forEach(student => {

        attendance[date][student.id] =
            status;

    });


    localStorage.setItem(
        "attendance",
        JSON.stringify(attendance)
    );


    renderAttendance();

}


// ========================================
// SAVE ATTENDANCE
// ========================================

function saveAttendance() {

    localStorage.setItem(
        "attendance",
        JSON.stringify(attendance)
    );


    updateDashboard();

    renderReports();


    alert(
        "Attendance saved successfully!"
    );

}


// ========================================
// DASHBOARD
// ========================================

function updateDashboard() {

    const date =
        new Date()
            .toISOString()
            .split("T")[0];


    const today =
        attendance[date] || {};


    let present = 0;

    let absent = 0;


    students.forEach(student => {

        if (today[student.id] === "present") {

            present++;

        }

        if (today[student.id] === "absent") {

            absent++;

        }

    });


    document.getElementById(
        "totalStudents"
    ).textContent =
        students.length;


    document.getElementById(
        "presentToday"
    ).textContent =
        present;


    document.getElementById(
        "absentToday"
    ).textContent =
        absent;


    const total =
        present + absent;


    const percentage =
        total === 0
            ? 0
            : Math.round(
                (present / total) * 100
            );


    document.getElementById(
        "attendancePercentage"
    ).textContent =
        percentage + "%";


    renderDashboardAttendance(
        today
    );

}


// ========================================
// DASHBOARD ATTENDANCE
// ========================================

function renderDashboardAttendance(today) {

    const container =
        document.getElementById(
            "dashboardAttendance"
        );


    container.innerHTML = "";


    if (students.length === 0) {

        container.innerHTML = `
            <p style="text-align:center;color:#6b7280;">
                No students added yet.
            </p>
        `;

        return;
    }


    students.forEach(student => {

        const status =
            today[student.id];


        const statusText =
            status
                ? status.toUpperCase()
                : "NOT MARKED";


        const className =
            status === "present"
                ? "present"
                : status === "absent"
                    ? "absent"
                    : "";


        const item =
            document.createElement("div");


        item.style.display = "flex";
        item.style.justifyContent =
            "space-between";
        item.style.padding = "12px 0";
        item.style.borderBottom =
            "1px solid #e5e7eb";


        item.innerHTML = `

            <span>
                ${student.rollNo} -
                ${student.name}
            </span>

            <strong class="${className}">
                ${statusText}
            </strong>

        `;


        container.appendChild(item);

    });

}


// ========================================
// REPORTS
// ========================================

function renderReports() {

    const table =
        document.getElementById(
            "reportTable"
        );


    table.innerHTML = "";


    if (students.length === 0) {

        table.innerHTML = `
            <tr>
                <td colspan="5"
                    style="text-align:center;padding:30px;">
                    No students available
                </td>
            </tr>
        `;

        return;
    }


    students.forEach(student => {

        let present = 0;

        let absent = 0;


        Object.values(attendance)
            .forEach(day => {

                if (
                    day[student.id] ===
                    "present"
                ) {

                    present++;

                }


                if (
                    day[student.id] ===
                    "absent"
                ) {

                    absent++;

                }

            });


        const total =
            present + absent;


        const percentage =
            total === 0
                ? 0
                : Math.round(
                    (present / total) * 100
                );


        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>${student.rollNo}</td>

            <td>
                <strong>${student.name}</strong>
            </td>

            <td class="present">
                ${present}
            </td>

            <td class="absent">
                ${absent}
            </td>

            <td>

                <strong>
                    ${percentage}%
                </strong>

            </td>

        `;


        table.appendChild(row);

    });

}


// ========================================
// CLOSE MODAL WHEN CLICKING OUTSIDE
// ========================================

document
    .getElementById("studentModal")
    .addEventListener("click", function(event) {

        if (event.target === this) {

            closeStudentModal();

        }

    });
