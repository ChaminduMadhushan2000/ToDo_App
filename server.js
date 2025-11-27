const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

// Serve static frontend
app.use(express.static(path.join(__dirname, 'public')));

// In-memory tasks store
let tasks = [];

function makeId() {
	return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

// API
app.get('/api/tasks', (req, res) => {
	res.json(tasks);
});

app.post('/api/tasks', (req, res) => {
	const { text } = req.body;
	if (!text || !text.trim()) return res.status(400).json({ error: 'Text required' });
	const task = { id: makeId(), text: text.trim(), completed: false, createdAt: Date.now() };
	tasks.unshift(task);
	res.status(201).json(task);
});

app.put('/api/tasks/:id', (req, res) => {
	const { id } = req.params;
	const idx = tasks.findIndex(t => t.id === id);
	if (idx === -1) return res.status(404).json({ error: 'Not found' });
	const updated = Object.assign(tasks[idx], req.body);
	res.json(updated);
});

app.delete('/api/tasks/:id', (req, res) => {
	const { id } = req.params;
	const idx = tasks.findIndex(t => t.id === id);
	if (idx === -1) return res.status(404).json({ error: 'Not found' });
	const removed = tasks.splice(idx, 1)[0];
	res.json(removed);
});

// SPA fallback (use regex to avoid path-to-regexp '*' parsing on some setups)
app.get(/.*/, (req, res) => {
	res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
	console.log(`Server listening on port ${PORT}`);
});
