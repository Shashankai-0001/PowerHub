// Personal Notes and Reminders Management Page
// Personal fitness notes and scheduled reminder management
import React, { useState, useEffect } from 'react';
import api from '../api';

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
            const [notesRes, tasksRes] = await Promise.all([
                api.get('/api/v1/workouts/notes'),
                api.get('/api/v1/workouts/tasks')
            ]);
            setNotes(notesRes.data);
            setTasks(tasksRes.data);
        } catch (err) {
            console.error('Error fetching notes/tasks:', err);
        }
    };

    const addNote = async () => {
        if (!newNote.title || !newNote.content) return;
        try {
            const res = await api.post('/api/v1/workouts/notes', newNote);
            setNotes([res.data, ...notes]);
            setNewNote({ title: '', content: '' });
        } catch (err) {
            console.error('Error adding note:', err);
        }
    };

    const addTask = async () => {
        if (!newTask) return;
        try {
            const res = await api.post('/api/v1/workouts/tasks', { content: newTask });
            setTasks([res.data, ...tasks]);
            setNewTask('');
        } catch (err) {
            console.error('Error adding task:', err);
        }
    };

    const toggleTask = async (id, currentStatus) => {
        try {
            await api.put(`/api/v1/workouts/tasks/${id}`, { isCompleted: !currentStatus });
            setTasks(tasks.map(t => t._id === id ? { ...t, isCompleted: !currentStatus } : t));
        } catch (err) {
            console.error('Error updating task:', err);
        }
    };

    return (
        <div className="container mx-auto p-6 pb-24 grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Notes Section */}
            <div className="bg-card backdrop-blur-xl border border-border p-8 rounded-3xl shadow-xl h-full flex flex-col">
                <h2 className="text-3xl font-black mb-6 text-foreground tracking-tight">Workout Notes</h2>
                <div className="mb-6 space-y-3">
                    <input
                        type="text"
                        placeholder="Title"
                        value={newNote.title}
                        onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                        className="w-full p-4 bg-muted border border-border rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                    />
                    <textarea
                        placeholder="Content"
                        value={newNote.content}
                        onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                        className="w-full p-4 bg-muted border border-border rounded-xl max-h-32 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all custom-scrollbar"
                    />
                    <button onClick={addNote} className="bg-primary text-primary-foreground font-bold px-6 py-3 rounded-xl hover:bg-primary/90 w-full transition-all shadow-[0_0_15px_rgba(0,163,255,0.2)]">
                        Add Note
                    </button>
                </div>
                <div className="space-y-4 overflow-y-auto flex-grow custom-scrollbar pr-2 max-h-[500px]">
                    {notes.map(note => (
                        <div key={note._id} className="bg-yellow-400/10 p-5 rounded-2xl border border-yellow-400/20 relative group hover:border-yellow-400/40 transition-all">
                            <h4 className="font-bold text-yellow-100 text-lg mb-1">{note.title}</h4>
                            <p className="text-sm text-yellow-50/80 mb-2 leading-relaxed">{note.content}</p>
                            <span className="text-xs text-yellow-500/60 font-mono">{new Date(note.createdAt).toLocaleDateString()}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Tasks Section */}
            <div className="bg-card backdrop-blur-xl border border-border p-8 rounded-3xl shadow-xl h-full flex flex-col">
                <h2 className="text-3xl font-black mb-6 text-foreground tracking-tight">Daily Tasks</h2>
                <div className="flex gap-3 mb-6">
                    <input
                        type="text"
                        placeholder="New Task..."
                        value={newTask}
                        onChange={(e) => setNewTask(e.target.value)}
                        className="flex-1 p-4 bg-muted border border-border rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-secondary transition-all"
                    />
                    <button onClick={addTask} className="bg-secondary text-primary-foreground font-bold px-6 py-3 rounded-xl hover:bg-secondary/90 transition-all shadow-[0_0_15px_rgba(0,240,255,0.2)]">
                        Add
                    </button>
                </div>
                <ul className="space-y-3 overflow-y-auto flex-grow custom-scrollbar pr-2 max-h-[500px]">
                    {tasks.map(task => (
                        <li key={task._id} className="flex items-center gap-4 p-4 hover:bg-muted rounded-xl transition-all border border-transparent hover:border-border group">
                            <input
                                type="checkbox"
                                checked={task.isCompleted}
                                onChange={() => toggleTask(task._id, task.isCompleted)}
                                className="w-6 h-6 text-secondary rounded focus:ring-secondary bg-muted border-border cursor-pointer"
                            />
                            <span className={`text-lg font-medium transition-all ${task.isCompleted ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
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
