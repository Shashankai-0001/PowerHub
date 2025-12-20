import React, { useState, useEffect } from 'react';
import axios from 'axios';

const NotesReminders = () => {
    const [notes, setNotes] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [newNote, setNewNote] = useState({ title: '', content: '' });
    const [newTask, setNewTask] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            const token = user ? user.token : null;
            const [notesRes, tasksRes] = await Promise.all([
                axios.get('http://localhost:5000/api/v1/workouts/notes', { headers: { Authorization: `Bearer ${token}` } }),
                axios.get('http://localhost:5000/api/v1/workouts/tasks', { headers: { Authorization: `Bearer ${token}` } })
            ]);
            setNotes(notesRes.data);
            setTasks(tasksRes.data);
        } catch (err) {
            console.error(err);
        }
    };

    const addNote = async () => {
        if (!newNote.title || !newNote.content) return;
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            const token = user ? user.token : null;
            const res = await axios.post('http://localhost:5000/api/v1/workouts/notes', newNote, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setNotes([res.data, ...notes]);
            setNewNote({ title: '', content: '' });
        } catch (err) {
            console.error(err);
        }
    };

    const addTask = async () => {
        if (!newTask) return;
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            const token = user ? user.token : null;
            const res = await axios.post('http://localhost:5000/api/v1/workouts/tasks', { content: newTask }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTasks([res.data, ...tasks]);
            setNewTask('');
        } catch (err) {
            console.error(err);
        }
    };

    const toggleTask = async (id, currentStatus) => {
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            const token = user ? user.token : null;
            await axios.put(`http://localhost:5000/api/v1/workouts/tasks/${id}`, { isCompleted: !currentStatus }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTasks(tasks.map(t => t._id === id ? { ...t, isCompleted: !currentStatus } : t));
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="container mx-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Notes Section */}
            <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-2xl font-bold mb-4 text-gray-800">Workout Notes</h2>
                <div className="mb-4 space-y-2">
                    <input
                        type="text"
                        placeholder="Title"
                        value={newNote.title}
                        onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                        className="w-full p-2 border rounded"
                    />
                    <textarea
                        placeholder="Content"
                        value={newNote.content}
                        onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                        className="w-full p-2 border rounded h-24"
                    />
                    <button onClick={addNote} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full">
                        Add Note
                    </button>
                </div>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                    {notes.map(note => (
                        <div key={note._id} className="bg-yellow-50 p-3 rounded border border-yellow-200">
                            <h4 className="font-bold">{note.title}</h4>
                            <p className="text-sm text-gray-700">{note.content}</p>
                            <span className="text-xs text-gray-500">{new Date(note.createdAt).toLocaleDateString()}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Tasks Section */}
            <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-2xl font-bold mb-4 text-gray-800">Daily Tasks</h2>
                <div className="flex gap-2 mb-4">
                    <input
                        type="text"
                        placeholder="New Task..."
                        value={newTask}
                        onChange={(e) => setNewTask(e.target.value)}
                        className="flex-1 p-2 border rounded"
                    />
                    <button onClick={addTask} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                        Add
                    </button>
                </div>
                <ul className="space-y-2">
                    {tasks.map(task => (
                        <li key={task._id} className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded">
                            <input
                                type="checkbox"
                                checked={task.isCompleted}
                                onChange={() => toggleTask(task._id, task.isCompleted)}
                                className="w-5 h-5 text-green-600 rounded focus:ring-green-500"
                            />
                            <span className={task.isCompleted ? 'line-through text-gray-400' : 'text-gray-800'}>
                                {task.content}
                            </span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default NotesReminders;
