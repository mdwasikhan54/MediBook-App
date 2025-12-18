DROP TABLE IF EXISTS appointments;
CREATE TABLE appointments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    patient_name TEXT,
    doctor_name TEXT,
    date TEXT,
    status TEXT DEFAULT 'Pending'
);
INSERT INTO appointments (patient_name, doctor_name, date, status) VALUES ('Wasi Khan', 'Dr. Smith', '2025-12-20', 'Confirmed');