async function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });
    const data = await res.json();
    if (data.success) {
        document.getElementById('login-section').style.display = 'none';
        document.getElementById('dashboard-section').style.display = 'block';
    } else {
        document.getElementById('login-msg').innerText = data.message;
        document.getElementById('login-msg').style.color = 'red';
    }
}

async function addStudent() {
    const rollNo = document.getElementById('rollNo').value;
    const name = document.getElementById('studentName').value;
    const branch = document.getElementById('branch').value;
    const res = await fetch('/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rollNo, name, branch })
    });
    const data = await res.json();
    alert(data.message);
}

async function markAttendance() {
    const rollNo = document.getElementById('attRollNo').value;
    const date = document.getElementById('attDate').value;
    const status = document.getElementById('attStatus').value;
    const res = await fetch('/api/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rollNo, date, status })
    });
    const data = await res.json();
    alert(data.message);
}

async function getPercentage() {
    const rollNo = document.getElementById('percRollNo').value;
    const res = await fetch(`/api/attendance/percentage/${rollNo}`);
    const data = await res.json();
    document.getElementById('perc-result').innerText = `Attendance: ${data.percentage}% (${data.presentCount}/${data.totalClasses} classes)`;
}

async function saveMarks() {
    const rollNo = document.getElementById('marksRollNo').value;
    const subject = document.getElementById('subject').value;
    const marks = document.getElementById('marksVal').value;
    const res = await fetch('/api/marks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rollNo, subject, marks })
    });
    const data = await res.json();
    alert(data.message);
}

async function generateReport() {
    const rollNo = document.getElementById('reportRollNo').value;
    const res = await fetch(`/api/report/${rollNo}`);
    const data = await res.json();
    if (data.success) {
        document.getElementById('report-output').innerText = JSON.stringify(data.report, null, 2);
    } else {
        alert(data.message);
    }
}
