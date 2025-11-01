const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const PORT = 5000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("views"));

// In-memory todo list
let todos = [];

// Routes
app.get("/", (req, res) => {
  let list = todos.map((t, i) => `<li>${t} <a href="/delete/${i}">❌</a></li>`).join("");
  res.send(`
    <h1>My To-Do List</h1>
    <form method="POST" action="/add">
      <input type="text" name="task" placeholder="Enter a task" required>
      <button type="submit">Add</button>
    </form>
    <ul>${list || "<li>No tasks yet!</li>"}</ul>
  `);
});

app.post("/add", (req, res) => {
  todos.push(req.body.task);
  res.redirect("/");
});

app.get("/delete/:index", (req, res) => {
  const index = parseInt(req.params.index);
  if (index >= 0 && index < todos.length) {
    todos.splice(index, 1);
  }
  res.redirect("/");
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
