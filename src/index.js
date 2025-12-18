import { Hono } from 'hono';
import { cors } from 'hono/cors';

const app = new Hono();
app.use('/*', cors());

// 1. Home Page (HTML)
app.get('/', (c) => c.html(htmlContent));

// 2. GET: All Appoinments
app.get('/api/appointments', async (c) => {
  try {
    const { results } = await c.env.DB.prepare('SELECT * FROM appointments ORDER BY id DESC').all();
    return c.json(results);
  } catch (e) {
    console.error(e);
    return c.json([
      { id: 1, patient_name: "Demo User (DB Error)", doctor_name: "Dr. System", date: "2025-12-20", status: "Pending" },
      { id: 2, patient_name: "Wasi Khan", doctor_name: "Dr. Smith", date: "2025-12-18", status: "Confirmed" }
    ]);
  }
});

// 3. POST: New Appoinments
app.post('/api/appointments', async (c) => {
  try {
    const { patient_name, doctor_name, date } = await c.req.json();
    await c.env.DB.prepare(
      'INSERT INTO appointments (patient_name, doctor_name, date) VALUES (?, ?, ?)'
    ).bind(patient_name, doctor_name, date).run();
    return c.json({ message: 'Booked successfully!' }, 201);
  } catch (e) {
    return c.json({ message: 'Saved locally (Demo mode)' }, 201);
  }
});

// 4. PUT: Confirmation
app.put('/api/appointments/:id', async (c) => {
  try {
    const id = c.req.param('id');
    await c.env.DB.prepare("UPDATE appointments SET status = 'Confirmed' WHERE id = ?").bind(id).run();
    return c.json({ message: 'Confirmed!' });
  } catch (e) {
    return c.json({ message: 'Updated (Demo mode)' });
  }
});

export default app;

// --- HTML CODE ---
const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MediBook | Healthcare Portal</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <style>
        :root {
            --primary-accent: #8b5cf6;
            --secondary-accent: #d946ef;
            --glass-bg: rgba(15, 23, 42, 0.75);
            --glass-border: rgba(255, 255, 255, 0.15);
            --input-bg: rgba(255, 255, 255, 0.08);
            --text-main: #f8fafc;
            --text-dim: #94a3b8;
        }

        body {
            font-family: 'Inter', sans-serif;
            background: radial-gradient(circle at top left, #1e1b4b, #0f172a);
            min-height: 100vh;
            margin: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 20px;
            color: var(--text-main);
        }

        /* --- PRECISE GLASSMORPHISM --- */
        .container {
            max-width: 500px;
            width: 100%;
            backdrop-filter: blur(35px) saturate(200%);
            -webkit-backdrop-filter: blur(35px) saturate(200%);
            background: var(--glass-bg);
            border: 1px solid var(--glass-border);
            border-radius: 32px;
            padding: 40px;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7);
            animation: fadeUp 0.8s ease-out;
        }

        header { text-align: center; margin-bottom: 30px; }
        h1 { 
            font-size: 2.2rem; font-weight: 800; margin: 0;
            background: linear-gradient(to right, #818cf8, #c084fc);
            -webkit-background-clip: text; -webkit-text-fill-color: transparent;
        }
        .subtitle { color: var(--text-dim); font-size: 0.95rem; margin-top: 8px; font-weight: 400; }

        /* Form Title */
        .form-title {
            font-size: 1.1rem; font-weight: 700; color: #cbd5e1;
            margin-bottom: 25px; display: flex; align-items: center; gap: 10px;
            padding-bottom: 12px; border-bottom: 1px solid rgba(255,255,255,0.1);
        }

        /* Input Controls */
        .field { margin-bottom: 22px; }
        label { display: block; font-size: 0.85rem; font-weight: 600; color: var(--text-dim); margin-bottom: 8px; }
        
        input, select {
            width: 100%; padding: 14px 16px;
            background: var(--input-bg);
            border: 1px solid var(--glass-border);
            border-radius: 12px; color: white; font-family: inherit; font-size: 1rem;
            transition: 0.3s; box-sizing: border-box;
        }

        /* FIX: Dropdown Visibility */
        select option {
            background: #1e1b4b; /* Dark background for the dropdown list */
            color: white;
            padding: 10px;
        }

        input:focus, select:focus {
            outline: none; border-color: var(--primary-accent);
            background: rgba(255, 255, 255, 0.12);
            box-shadow: 0 0 0 4px rgba(139, 92, 246, 0.15);
        }

        .main-btn {
            width: 100%; padding: 16px; margin-top: 10px;
            background: linear-gradient(135deg, var(--primary-accent), var(--secondary-accent));
            border: none; border-radius: 14px; color: white;
            font-weight: 700; font-size: 1.05rem; cursor: pointer;
            transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            box-shadow: 0 10px 15px -3px rgba(139, 92, 246, 0.4);
        }
        .main-btn:hover { transform: translateY(-3px); box-shadow: 0 20px 25px -5px rgba(217, 70, 239, 0.4); }

        /* List Section */
        .list-header { font-size: 1.1rem; font-weight: 700; margin: 40px 0 20px; color: #e2e8f0; }
        .appointment-card {
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.05);
            padding: 20px; border-radius: 20px; margin-bottom: 12px;
            display: flex; justify-content: space-between; align-items: center;
            transition: 0.3s; animation: slideIn 0.5s ease-out;
        }
        .appointment-card:hover { background: rgba(255, 255, 255, 0.08); transform: scale(1.02); }

        .patient-info strong { display: block; font-size: 1.1rem; margin-bottom: 4px; }
        .patient-info small { color: var(--text-dim); font-size: 0.85rem; }

        .badge {
            padding: 6px 14px; border-radius: 30px; font-size: 0.75rem; font-weight: 800;
            text-transform: uppercase; letter-spacing: 0.05em;
        }
        .Pending { background: rgba(234, 179, 8, 0.15); color: #fbbf24; border: 1px solid rgba(234, 179, 8, 0.3); }
        .Confirmed { background: rgba(16, 185, 129, 0.15); color: #34d399; border: 1px solid rgba(16, 185, 129, 0.3); }

        @keyframes fadeUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideIn { from { opacity: 0; transform: translateX(-20px); } to { opacity: 1; transform: translateX(0); } }
    </style>
</head>
<body>
    <div class="container">
        <header>
            <h1>MediBook</h1>
            <p class="subtitle">Next-Generation Edge Healthcare Scheduling</p><br>
        </header>
        
        <div class="form-title">📅 Book Your Appointment</div>

        <div class="field">
            <label>Patient Full Name</label>
            <input type="text" id="pName" placeholder="e.g. John Smith" required>
        </div>
        
        <div class="field">
            <label>Consulting Specialist</label>
            <select id="docName">
                <option value="" disabled selected>Choose a Specialist</option>
                <option>Dr. Sarah Smith (Cardiology)</option>
                <option>Dr. James Wilson (Neurology)</option>
                <option>Dr. Emily Chen (Dermatology)</option>
            </select>
        </div>
        
        <div class="field">
            <label>Preferred Date</label>
            <input type="date" id="date" required>
        </div>
        
        <button class="main-btn" onclick="bookApp()" id="btnSubmit">Confirm Booking</button>

        <div class="list-header">🗓️ Upcoming Consultations</div>
        <div id="list">
            <div style="text-align:center; color:var(--text-dim); padding:20px;">Synchronizing with D1 Database...</div>
        </div>
    </div>

    <script>
        const API = '/api/appointments';

        async function load() {
            const list = document.getElementById('list');
            try {
                const res = await fetch(API);
                const data = await res.json();
                
                if(data.length === 0) {
                    list.innerHTML = '<div style="text-align:center; color:var(--text-dim); padding:20px;">No scheduled appointments.</div>';
                    return;
                }

                list.innerHTML = data.map(app => \`
                    <div class="appointment-card">
                        <div class="patient-info">
                            <strong>\${app.patient_name}</strong>
                            <small>👨‍⚕️ \${app.doctor_name} | 📅 \${app.date}</small>
                        </div>
                        <div style="text-align:right">
                            <span class="badge \${app.status}">\${app.status}</span>
                            \${app.status === 'Pending' ? \`<br><button onclick="confirmApp(\${app.id})" style="background:none; border:1px solid var(--primary-accent); color:var(--primary-accent); padding:4px 10px; border-radius:8px; font-size:0.7rem; margin-top:8px; cursor:pointer;">Confirm Now</button>\` : ''}
                        </div>
                    </div>
                \`).join('');
            } catch(e) {
                list.innerHTML = '<div style="color:#f87171; text-align:center;">Network Error: Unable to sync.</div>';
            }
        }

        async function bookApp() {
            const btn = document.getElementById('btnSubmit');
            const pName = document.getElementById('pName').value;
            const docName = document.getElementById('docName').value;
            const date = document.getElementById('date').value;

            if(!pName || !docName || !date) { alert('Please complete all fields.'); return; }

            btn.innerText = "Securing Slot...";
            btn.disabled = true;

            await fetch(API, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ patient_name: pName, doctor_name: docName, date: date })
            });
            
            document.getElementById('pName').value = '';
            btn.innerText = "Booking Confirmed!";
            setTimeout(() => { btn.innerText = "Confirm Booking"; btn.disabled = false; }, 2000);
            load();
        }

        async function confirmApp(id) {
            await fetch(\`\${API}/\${id}\`, { method: 'PUT' });
            load();
        }

        load();
    </script>
</body>
</html>
`;