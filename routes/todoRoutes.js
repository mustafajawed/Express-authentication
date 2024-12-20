const express = require("express");
const { verifyToken } = require("../middleware/authMiddleware");
const { createTodo, getTodos, deleteTodo } = require("../Controllers/todoController");

const router = express.Router();

router.post("/", verifyToken, createTodo); 
router.get("/", verifyToken, getTodos);   
router.delete("/:id", verifyToken, deleteTodo); 

module.exports = router;
