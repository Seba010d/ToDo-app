// Hent elementer
const todoInput = document.getElementById("todoInput");
const addButton = document.getElementById("addbutton");
const todoList = document.getElementById("todoList");

// Hent eksisterende todos fra localStorage (hvis der er nogle)
let todos = JSON.parse(localStorage.getItem("todo")) || [];

// Funktion til at gemme i localStorage
function saveTodos() {
  localStorage.setItem("todo", JSON.stringify(todos));
}

// Funktion til at vise alle todos i listen
function renderTodos() {
  todoList.innerHTML = "";
  todos.forEach((todo, index) => {
    const li = document.createElement("li");
    li.textContent = todo;
    todoList.appendChild(li);
  });
}

// Funktion når man trykker på knappen
addButton.addEventListener("click", () => {
  const newTodo = todoInput.value.trim();
  if (newTodo !== "") {
    todos.push(newTodo);
    saveTodos();
    renderTodos();
    todoInput.value = "";
  }
});

renderTodos();
