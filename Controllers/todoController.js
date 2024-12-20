const fs = require("fs");
const path = require("path");

// Path to store user-specific To-Do files
const dataDir = path.join(__dirname, "../data");

// Ensure data directory exists
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir);
}

// Helper to get the user's file path
const getUserFilePath = (username) => path.join(dataDir, `${username}.json`);

// Create a new To-Do
exports.createTodo = (req, res) => {
    const { username } = req.user; // Get the username from JWT
    const { task } = req.body;

    if (!task) {
        return res.status(400).json({ message: "Task is required" });
    }

    const userFilePath = getUserFilePath(username);
    const todos = fs.existsSync(userFilePath) ? JSON.parse(fs.readFileSync(userFilePath)) : [];

    const newTodo = { id: Date.now(), task };
    todos.push(newTodo);

    fs.writeFileSync(userFilePath, JSON.stringify(todos, null, 2));
    res.status(201).json({ message: "To-Do created successfully", todo: newTodo });
};

// Get all To-Dos for the authenticated user
exports.getTodos = (req, res) => {
    const { username } = req.user;
    const userFilePath = getUserFilePath(username);

    if (!fs.existsSync(userFilePath)) {
        return res.json([]);
    }

    const todos = JSON.parse(fs.readFileSync(userFilePath));
    res.json(todos);
};

// Delete a specific To-Do by ID
exports.deleteTodo = (req, res) => {
    const { username } = req.user;
    const { id } = req.params;

    const userFilePath = getUserFilePath(username);

    if (!fs.existsSync(userFilePath)) {
        return res.status(404).json({ message: "No To-Do found for this user" });
    }

    let todos = JSON.parse(fs.readFileSync(userFilePath));
    const filteredTodos = todos.filter((todo) => todo.id !== parseInt(id));

    if (todos.length === filteredTodos.length) {
        return res.status(404).json({ message: "To-Do not found" });
    }

    fs.writeFileSync(userFilePath, JSON.stringify(filteredTodos, null, 2));
    res.json({ message: "To-Do deleted successfully" });
};
