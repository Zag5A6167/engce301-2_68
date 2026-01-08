const form = document.querySelector("form");
const todoInput = document.querySelector("#todo-input");
const todoList = document.querySelector("#todo-list");

let todos = [];

function addTodo() {
  const todoText = todoInput.value.trim();


  if (todoText.length > 50) {
    alert("ข้อความต้องไม่เกิน 50 ตัวอักษร!");
    return;
  }

  if (todoText.length > 0) {
    const todo = {
      id: Date.now(),
      text: todoText,
      completed: false,
    };
    todos.push(todo);
    todoInput.value = "";
    renderTodos();
  }
}

function deleteTodo(id) {

  const isConfirm = confirm("ยืนยันไหม");
  if (isConfirm) {
    todos = todos.filter((todo) => todo.id !== id);
    renderTodos();
  }
}

function toggleCompleted(id) {
  todos = todos.map((todo) => {
    if (todo.id === id) {
      todo.completed = !todo.completed;
    }
    return todo;
  });
  renderTodos();
}

function renderTodos() {
  todoList.innerHTML = "";

  todos.forEach((todo) => {
    const todoItem = document.createElement("li");
    const todoText = document.createElement("span");
    const todoDeleteButton = document.createElement("button");
    

    const myCheck = document.createElement("input");
    myCheck.setAttribute("type", "checkbox");
    myCheck.checked = todo.completed; 

    todoText.textContent = todo.text;
    todoDeleteButton.textContent = "Delete";

  
    todoDeleteButton.addEventListener("click", (e) => {
      e.stopPropagation();
      deleteTodo(todo.id);
    });

    if (todo.completed) {
      todoItem.style.textDecoration = "line-through";
      todoItem.style.color = "gray";
    }

    todoItem.addEventListener("click", () => toggleCompleted(todo.id));
  
    todoItem.appendChild(myCheck);
    todoItem.appendChild(todoText);
    todoItem.appendChild(todoDeleteButton);

    todoList.appendChild(todoItem);
  });
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  addTodo();
});

renderTodos();