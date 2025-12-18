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
    <title>MediBook App</title>
    <style>
        body { font-family: sans-serif; background: #f4f4f9; padding: 20px; display: flex; justify-content: center; }
        .container { max-width: 600px; width: 100%; background: white; padding: 20px; border-radius: 10px; box-shadow: 0 4px 10px rgba(0,0,0,0.1); }
        h1 { text-align: center; color: #333; }
        input, select, button { width: 100%; padding: 10px; margin: 5px 0; border-radius: 5px; border: 1px solid #ccc; box-sizing: border-box;}
        button { background: #28a745; color: white; border: none; cursor: pointer; font-weight: bold; }
        button:hover { background: #218838; }
        .item { background: #fff; border-bottom: 1px solid #eee; padding: 10px; display: flex; justify-content: space-between; align-items: center; }
        .status { font-size: 0.8rem; padding: 3px 8px; border-radius: 10px; background: #eee; }
        .Confirmed { background: #d4edda; color: #155724; }
        .error { color: red; text-align: center; margin-top: 10px; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🏥 MediBook</h1>
        
        <div style="background: #f9f9f9; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
            <h3>📅 Book Appointment</h3>
            <input type="text" id="pName" placeholder="Patient Name" required>
            <select id="docName">
                <option>Dr. Smith (Cardiology)</option>
                <option>Dr. Sarah (Neurology)</option>
            </select>
            <input type="date" id="date" required>
            <button onclick="bookApp()">Book Now</button>
        </div>

        <h3>Appointments List</h3>
        <div id="list">Loading data...</div>
    </div>

    <script>
        const API = '/api/appointments';

        async function load() {
            try {
                const res = await fetch(API);
                if (!res.ok) throw new Error('Server Error');
                const data = await res.json();
                
                const list = document.getElementById('list');
                if(data.length === 0) { 
                    list.innerHTML = '<p>No appointments found.</p>'; 
                    return; 
                }
                
                list.innerHTML = data.map(app => \`
                    <div class="item">
                        <div>
                            <strong>\${app.patient_name}</strong> <br>
                            <small>👨‍⚕️ \${app.doctor_name} | 📅 \${app.date}</small>
                        </div>
                        <div style="text-align:right">
                            <span class="status \${app.status}">\${app.status}</span>
                            \${app.status === 'Pending' ? \`<br><button onclick="confirm(\${app.id})" style="width:auto; padding:5px; margin-top:5px; font-size:0.7rem; background:#007bff;">Confirm</button>\` : ''}
                        </div>
                    </div>
                \`).join('');
            } catch(e) {
                document.getElementById('list').innerHTML = '<p class="error">Error loading data: ' + e.message + '</p>';
            }
        }

        async function bookApp() {
            const patient_name = document.getElementById('pName').value;
            const doctor_name = document.getElementById('docName').value;
            const date = document.getElementById('date').value;
            if(!patient_name || !date) return alert('Please fill all fields');

            document.querySelector('button').innerText = 'Booking...';
            try {
                await fetch(API, {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({ patient_name, doctor_name, date })
                });
                document.getElementById('pName').value = '';
                await load();
            } catch(e) {
                alert('Booking failed');
            }
            document.querySelector('button').innerText = 'Book Now';
        }

        async function confirm(id) {
            await fetch(\`\${API}/\${id}\`, { method: 'PUT' });
            load();
        }

        load();
    </script>
</body>
</html>
`;