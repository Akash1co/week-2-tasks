const todoInput = document.querySelector("#todo-input");
const addBtn = document.querySelector("#add-btn");
const todoList = document.querySelector("#todo-list");

let todos = JSON.parse(localStorage.getItem("todos")) || [];

function saveTodos() {
  localStorage.setItem("todos", JSON.stringify(todos));
}

function renderTodoElement(todo) {
  const li = document.createElement("li");
  li.dataset.id = todo.id;

  const span = document.createElement("span");
  span.textContent = todo.text;
  if (todo.completed) {
    span.classList.add("completed");
  }

  const actionsDiv = document.createElement("div");
  actionsDiv.classList.add("actions");

  const toggleBtn = document.createElement("button");
  toggleBtn.textContent = todo.completed ? "Undo" : "Complete";
  toggleBtn.classList.add("toggle-btn");

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "Delete";
  deleteBtn.classList.add("delete-btn");

  actionsDiv.appendChild(toggleBtn);
  actionsDiv.appendChild(deleteBtn);

  li.appendChild(span);
  li.appendChild(actionsDiv);
  todoList.appendChild(li);
}

function init() {
  todoList.innerHTML = "";
  todos.forEach((todo) => renderTodoElement(todo));
}

function addTodo() {
  const text = todoInput.value.trim();
  if (!text) return;

  const newTodo = {
    id: Date.now().toString(),
    text,
    completed: false,
  };

  todos.push(newTodo);
  saveTodos();
  renderTodoElement(newTodo);
  todoInput.value = "";
}

todoList.addEventListener("click", (event) => {
  const target = event.target;
  const li = target.closest("li");
  if (!li) return;

  const todoId = li.dataset.id;
  const todoIndex = todos.findIndex((item) => item.id === todoId);

  if (target.classList.contains("toggle-btn")) {
    todos[todoIndex].completed = !todos[todoIndex].completed;
    saveTodos();

    const span = li.querySelector("span");
    span.classList.toggle("completed");
    target.textContent = todos[todoIndex].completed ? "Undo" : "Complete";
  }

  if (target.classList.contains("delete-btn")) {
    todos.splice(todoIndex, 1);
    saveTodos();
    todoList.removeChild(li);
  }
});

addBtn.addEventListener("click", addTodo);
todoInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") addTodo();
});

init();