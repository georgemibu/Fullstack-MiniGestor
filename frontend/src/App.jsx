import { useState, useEffect } from 'react';


export default function App() {
  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [userId, setUserId] = useState('');


  const API = 'http://localhost:3001';


  useEffect(() => {
    fetch(`${API}/users`).then(r => r.json()).then(setUsers).catch(console.error);
    fetch(`${API}/tasks`).then(r => r.json()).then(setTasks).catch(console.error);
  }, []);


  async function addUser(e) {
    e.preventDefault();
    if (!name) return;
    const res = await fetch(`${API}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name })
    });
    const user = await res.json();
    setUsers(prev => [...prev, user]);
    setName('');
  }


  async function addTask(e) {
    e.preventDefault();
    if (!title || !userId) return;
    const res = await fetch(`${API}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, user_id: Number(userId) })
    });
    const task = await res.json();
    setTasks(prev => [...prev, task]);
    setTitle('');
    setUserId('');
  }


  return (
    <div style={{ padding: 20, fontFamily: 'Arial' }}>
      <h1>Mini Gestor de Tareas</h1>


      <section>
        <h2>Agregar usuario</h2>
        <form onSubmit={addUser}>
          <input value={name} onChange={e => setName(e.target.value)} placeholder="Nombre" />
          <button type="submit">Agregar</button>
        </form>
        <ul>
          {users.map(u => <li key={u.id}>{u.name}</li>)}
        </ul>
      </section>


      <section>
        <h2>Agregar tarea</h2>
        <form onSubmit={addTask}>
          <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Título de la tarea" />
          <select value={userId} onChange={e => setUserId(e.target.value)}>
            <option value="">Seleccionar usuario</option>
            {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
          </select>
          <button type="submit">Agregar tarea</button>
        </form>
        <ul>
          {tasks.map(t => <li key={t.id}>{t.title} (user_id: {t.user_id})</li>)}
        </ul>
      </section>
    </div>
  );
}