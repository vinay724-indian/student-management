const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const DB_FILE = path.join(__dirname, 'data', 'db.json');

// Helper to read/write DB
function readDB() {
    if (!fs.existsSync(DB_FILE)) {
        fs.writeFileSync(DB_FILE, JSON.stringify({ students: [], attendance: {}, marks: {} }));
    }
    return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
}

function writeDB(data) {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

// TC01: Faculty Login Mock API
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    if (username === 'faculty' && password === 'password123') {
        res.json({ success: true, message: 'Login successful' });
    } else {
        res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
});

// TC02: Add Student Details / Registration
app.post('/api/students', (req, res) => {
    const { rollNo, name, branch } = req.body;
    const db = readDB();
    if (db.students.find(s => s.rollNo === rollNo)) {
        return res.status(400).json({ success: false, message: 'Student already exists' });
    }
    db.students.push({ rollNo, name, branch });
    writeDB(db);
    res.json({ success: true, message: 'Student added' });
});

app.get('/api/students', (req, res) => {
    const db = readDB();
    res.json(db.students);
});

// TC03 & TC04: Mark & Update Attendance
app.post('/api/attendance', (req, res) => {
    const { rollNo, date, status } = req.body; 
    const db = readDB();
    if (!db.attendance[rollNo]) {
        db.attendance[rollNo] = [];
    }
    const existingIndex = db.attendance[rollNo].findIndex(a => a.date === date);
    if (existingIndex >= 0) {
        db.attendance[rollNo][existingIndex].status = status;
        writeDB(db);
        return res.json({ success: true, message: 'Attendance updated' });
    }
    db.attendance[rollNo].push({ date, status });
    writeDB(db);
    res.json({ success: true, message: 'Attendance recorded' });
});

// TC05: Calculate Attendance Percentage
app.get('/api/attendance/percentage/:rollNo', (req, res) => {
    const { rollNo } = req.params;
    const db = readDB();
    const records = db.attendance[rollNo] || [];
    if (records.length === 0) return res.json({ rollNo, percentage: 0 });
    const presentCount = records.filter(r => r.status === 'Present').length;
    const percentage = (presentCount / records.length) * 100;
    res.json({ rollNo, totalClasses: records.length, presentCount, percentage: percentage.toFixed(2) });
});

// TC06: Enter Internal Marks
app.post('/api/marks', (req, res) => {
    const { rollNo, subject, marks } = req.body;
    const db = readDB();
    if (!db.marks[rollNo]) {
        db.marks[rollNo] = {};
    }
    db.marks[rollNo][subject] = marks;
    writeDB(db);
    res.json({ success: true, message: 'Marks saved' });
});

// TC07: Generate Performance Reports
app.get('/api/report/:rollNo', (req, res) => {
    const { rollNo } = req.params;
    const db = readDB();
    const student = db.students.find(s => s.rollNo === rollNo);
    if (!student) return res.status(404).json({ success: false, message: 'Student not found' });

    const attendanceRecords = db.attendance[rollNo] || [];
    const presentCount = attendanceRecords.filter(r => r.status === 'Present').length;
    const percentage = attendanceRecords.length ? ((presentCount / attendanceRecords.length) * 100).toFixed(2) : 0;
    const marks = db.marks[rollNo] || {};

    res.json({
        success: true,
        report: {
            student,
            attendance: { total: attendanceRecords.length, present: presentCount, percentage },
            marks
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});