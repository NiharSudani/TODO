import React, { useState, useEffect } from 'react';

function App() {
  // State for tasks and selected date
  const [tasks, setTasks] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10));
  const [newTask, setNewTask] = useState({ title: '', description: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [editTaskId, setEditTaskId] = useState(null);
  const [editTask, setEditTask] = useState({ title: '', description: '' });

  // Fetch tasks from backend (replace URL with your backend if needed)
  useEffect(() => {
    setLoading(true);
    fetch('http://localhost:5000/api/tasks')
      .then(res => res.json())
      .then(data => {
        setTasks(data);
        setLoading(false);
      })
      .catch(() => {
        setTasks([]);
        setError('Failed to load tasks.');
        setLoading(false);
      });
  }, []);

  // Add new task
  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTask.title) return;
    setLoading(true);
    fetch('http://localhost:5000/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...newTask,
        date: selectedDate
      })
    })
      .then(res => res.json())
      .then(task => {
        setTasks([...tasks, task]);
        setNewTask({ title: '', description: '' });
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to add task.');
        setLoading(false);
      });
  };

  // Mark task as done
  const handleDone = (id) => {
    setLoading(true);
    fetch(`http://localhost:5000/api/tasks/${id}/done`, { method: 'PATCH' })
      .then(res => res.json())
      .then(updated => {
        setTasks(tasks.map(t => t._id === id ? updated : t));
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to update task.');
        setLoading(false);
      });
  };

  // Delete task
  const handleDelete = (id) => {
    setLoading(true);
    fetch(`http://localhost:5000/api/tasks/${id}`, { method: 'DELETE' })
      .then(res => res.json())
      .then(() => {
        setTasks(tasks.filter(t => t._id !== id));
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to delete task.');
        setLoading(false);
      });
  };

  // Start editing a task
  const startEdit = (task) => {
    setEditTaskId(task._id);
    setEditTask({ title: task.title, description: task.description });
  };

  // Save edited task
  const handleEditSave = (id) => {
    setLoading(true);
    fetch(`http://localhost:5000/api/tasks/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editTask)
    })
      .then(res => res.json())
      .then(updated => {
        setTasks(tasks.map(t => t._id === id ? updated : t));
        setEditTaskId(null);
        setEditTask({ title: '', description: '' });
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to edit task.');
        setLoading(false);
      });
  };

  // Cancel editing
  const handleEditCancel = () => {
    setEditTaskId(null);
    setEditTask({ title: '', description: '' });
  };

  // Filter tasks for selected date
  const tasksForDate = tasks.filter(t => t.date && t.date.slice(0, 10) === selectedDate);

  // Simple calendar: just a date picker
  return (
    <div className="App" style={{ maxWidth: 520, margin: '40px auto', padding: 32, background: '#f8fafc', borderRadius: 16, boxShadow: '0 4px 24px #0001' }}>
      <h1 style={{ textAlign: 'center', color: '#2563eb', marginBottom: 24, letterSpacing: 1 }}>📝 To-Do List Web App</h1>
      <div style={{ marginBottom: 24, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <label style={{ fontWeight: 500, color: '#334155', fontSize: 18 }}>
          📅 Select Date:
          <input
            type="date"
            value={selectedDate}
            onChange={e => setSelectedDate(e.target.value)}
            style={{ marginLeft: 12, padding: 6, borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 16 }}
          />
        </label>
      </div>
      <form onSubmit={handleAddTask} style={{ marginBottom: 28, display: 'flex', gap: 8, justifyContent: 'center' }}>
        <input
          type="text"
          placeholder="Task title"
          value={newTask.title}
          onChange={e => setNewTask({ ...newTask, title: e.target.value })}
          required
          style={{ padding: 8, borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 16, flex: 2 }}
        />
        <input
          type="text"
          placeholder="Description (optional)"
          value={newTask.description}
          onChange={e => setNewTask({ ...newTask, description: e.target.value })}
          style={{ padding: 8, borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 16, flex: 3 }}
        />
        <button type="submit" disabled={loading} style={{ padding: '8px 18px', borderRadius: 6, background: '#2563eb', color: 'white', border: 'none', fontWeight: 600, fontSize: 16, cursor: loading ? 'not-allowed' : 'pointer', transition: 'background 0.2s' }}>Add</button>
      </form>
      {error && <div style={{ color: '#dc2626', marginBottom: 12, textAlign: 'center', fontWeight: 500 }}>{error}</div>}
      {loading && <div style={{ color: '#2563eb', marginBottom: 12, textAlign: 'center' }}>Loading...</div>}
      <h2 style={{ color: '#334155', marginBottom: 16, fontSize: 22, borderBottom: '1px solid #e5e7eb', paddingBottom: 6 }}>Tasks for {selectedDate}</h2>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {tasksForDate.length === 0 && <li style={{ color: '#64748b', textAlign: 'center', fontStyle: 'italic' }}>No tasks for this date.</li>}
        {tasksForDate.map(task => (
          <li key={task._id} style={{
            marginBottom: 14,
            textDecoration: task.done ? 'line-through' : 'none',
            display: 'flex',
            alignItems: 'center',
            background: task.done ? '#e0e7ef' : '#fff',
            borderRadius: 8,
            padding: '10px 12px',
            boxShadow: '0 1px 4px #0001',
            opacity: task.done ? 0.7 : 1
          }}>
            <input
              type="checkbox"
              checked={task.done}
              onChange={() => handleDone(task._id)}
              disabled={task.done || loading}
              style={{ marginRight: 12, width: 18, height: 18 }}
            />
            {editTaskId === task._id ? (
              <>
                <input
                  type="text"
                  value={editTask.title}
                  onChange={e => setEditTask({ ...editTask, title: e.target.value })}
                  style={{ marginRight: 8, padding: 6, borderRadius: 5, border: '1px solid #cbd5e1', fontSize: 15 }}
                />
                <input
                  type="text"
                  value={editTask.description}
                  onChange={e => setEditTask({ ...editTask, description: e.target.value })}
                  style={{ marginRight: 8, padding: 6, borderRadius: 5, border: '1px solid #cbd5e1', fontSize: 15 }}
                />
                <button onClick={() => handleEditSave(task._id)} disabled={loading} style={{ padding: '6px 12px', borderRadius: 5, background: '#059669', color: 'white', border: 'none', fontWeight: 500, fontSize: 15, marginRight: 4, cursor: loading ? 'not-allowed' : 'pointer' }}>Save</button>
                <button onClick={handleEditCancel} style={{ padding: '6px 12px', borderRadius: 5, background: '#e11d48', color: 'white', border: 'none', fontWeight: 500, fontSize: 15, cursor: loading ? 'not-allowed' : 'pointer' }} disabled={loading}>Cancel</button>
              </>
            ) : (
              <>
                <span style={{ fontWeight: 600, color: '#0f172a', fontSize: 17 }}>{task.title}</span>
                {task.description && <span style={{ color: '#64748b', marginLeft: 6, fontSize: 15 }}> - {task.description}</span>}
                <button onClick={() => startEdit(task)} style={{ marginLeft: 12, padding: '6px 12px', borderRadius: 5, background: '#fbbf24', color: '#78350f', border: 'none', fontWeight: 500, fontSize: 15, cursor: task.done || loading ? 'not-allowed' : 'pointer' }} disabled={task.done || loading}>Edit</button>
                <button onClick={() => handleDelete(task._id)} style={{ marginLeft: 6, padding: '6px 12px', borderRadius: 5, background: '#ef4444', color: 'white', border: 'none', fontWeight: 500, fontSize: 15, cursor: loading ? 'not-allowed' : 'pointer' }} disabled={loading}>Delete</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
