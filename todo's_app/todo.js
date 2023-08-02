// Select elements with query selectors

const todoForm = document.querySelector("#todo-form");
const todoInput = document.querySelector("#todo");
const startDateInput = document.querySelector("#startDate");
const endDateInput = document.querySelector("#endDate");
const todoList = document.querySelector(".list-group");

const firstCardBody = document.querySelectorAll(".card-body")[0];
const secondCardBody = document.querySelectorAll(".card-body")[1];
const filter = document.querySelector("#filter");

const clearTodosBtn = document.querySelector("#clear-Todos");

eventListeners();

// event listeners
function eventListeners(){
  todoForm.addEventListener("submit", addTodo);
  document.addEventListener("DOMContentLoaded", loadAllTodosToUI);
  secondCardBody.addEventListener("click", deleteTodo);
  filter?.addEventListener("keyup", filterTodos);
  clearTodosBtn.addEventListener("click", clearAllTodos);


  
}

function clearAllTodos(e){
  if(confirm("Are you sure you want to delete all todos?")){
    while(todoList?.firstElementChild != null){
      todoList.removeChild(todoList.firstElementChild);
    }
    localStorage.removeItem("todos");
  }
}

function filterTodos(e){
  const filterValue = e.target.value.toLowerCase();
  const listItems = document.querySelectorAll(".list-group-item");

  listItems.forEach(function(listItem){
    const text = listItem.textContent.toLowerCase();
    if (text.indexOf(filterValue) === -1){
      listItem.setAttribute("style","display : none !important");
    } else {
      listItem.setAttribute("style","display : block");
    }
  });
}

function deleteTodoFromStorage(deleteTodo) {
  let todos = getTodosFromStorage();

  todos.forEach(function (todo, index) {
    if (todo.todoText === deleteTodo) {
      todos.splice(index, 1);
    }
  });

  localStorage.setItem("todos", JSON.stringify(todos));
}

function loadAllTodosToUI(){
  let todos = getTodosFromStorage();
  todos.forEach(function (todo) {
    addTodoToUI(todo.todoText, todo.startDate, todo.endDate);
  });
}

function addTodoToStorage(newTodo, startDate, endDate){
  let todos  = getTodosFromStorage();
  todos.push({ todoText: newTodo, startDate: startDate, endDate: endDate });
  localStorage.setItem("todos", JSON.stringify(todos));
}

function showAlert(type, message) {
  const alert = document.createElement("div");
  alert.className = `alert alert-${type} alert-message`;
  alert.textContent = message;
  firstCardBody.appendChild(alert);

  setTimeout(function() {
    alert.remove();
  }, 1000);
}


function addTodoToUI(newTodo, startDate, endDate, daysLeftNumber) {
  const listItem = document.createElement("li");
  const link = document.createElement("a");
  link.href = "#";
  link.className = "delete-item";
  link.innerHTML = "<i class='fas fa-times'></i> ";
  listItem.className = "list-group-item d-flex justify-content-between";

  const todoTextDiv = document.createElement("div");
  todoTextDiv.textContent = newTodo;

  // Add an event listener to the todo item for editing
  listItem.addEventListener("click", () => {
    const inputField = document.createElement("input");
    inputField.type = "text";
    inputField.value = todoTextDiv.textContent;

    // Replace the todo text div with the input field
    listItem.replaceChild(inputField, todoTextDiv);

    // Focus on the input field so the user can start editing immediately
    inputField.focus();

    // When the user clicks outside the input field, save the changes and update the todo text
    inputField.addEventListener("blur", () => {
      todoTextDiv.textContent = inputField.value;

      // Remove the input field and replace it back with the todo text div
      listItem.replaceChild(todoTextDiv, inputField);
    });
  });

  const todoDatesDiv = document.createElement("div");
  todoTextDiv.classList.add("list-group-item");
  todoDatesDiv.classList.add("list-group-item");

  todoDatesDiv.classList.add("todo-dates"); // Add the class "todo-dates" to the todoDatesDiv element
  todoDatesDiv.textContent = `${startDate} - ${endDate}`;

  if (startDate === "" || endDate === "") {
    // If the dates are not specified, add a class to indicate it
    listItem.classList.add("unscheduled");
  } else {
    // Dates are specified, perform the previous date check
   
    const currentDate = new Date();
    const endDateObj = new Date(endDate);
  if (endDateObj < currentDate) {
    listItem.classList.add("past-date");
    todoDatesDiv.textContent += " (Time has passed)";
  } else {
    const oneDay = 24 * 60 * 60 * 1000;
    const daysLeft = Math.round((endDateObj - currentDate) / oneDay);
    if (daysLeft === 1) {
      listItem.classList.add("near-date");
     
  
      todoDatesDiv.textContent += ` (${daysLeft} day left)`;
    } else if (daysLeft > 1) {
      listItem.classList.add("future-date");
      todoDatesDiv.textContent += ` (${daysLeft} days left)`;
    }
  }



  }

  listItem.appendChild(todoTextDiv);
  listItem.appendChild(todoDatesDiv);
  listItem.appendChild(link);

  todoList.appendChild(listItem);
  todoInput.value = "";
  startDateInput.value = "";
  endDateInput.value = "";
}

function addTodo(e) {
  const newTodo = todoInput.value;
  const startDate = startDateInput.value;
  const endDate = endDateInput.value;

  if (newTodo.trim() === "") {
    showAlert("danger", "Please enter a todo!");
  } else {
    // Check if the user entered a start date and an end date
    const hasDates = startDate !== "" && endDate !== "";
    let daysLeft = "";

    
    const formattedStartDate = hasDates ? formatDate(startDate) : "(no info)";
    const formattedEndDate = hasDates ? formatDate(endDate) : "(no info)";

    addTodoToUI(newTodo, formattedStartDate, formattedEndDate, daysLeft);
    addTodoToStorage(newTodo, formattedStartDate, formattedEndDate);
  }

  e.preventDefault();
}


function getTodosFromStorage(){
  let todos = JSON.parse(localStorage.getItem("todos")) || [];
  return todos;
}

function deleteTodo(e){
  if (e.target.className === "fas fa-times"){
    const listItem = e.target.parentElement.parentElement;
    const todoText = listItem.firstElementChild.textContent;
    listItem.remove();
    deleteTodoFromStorage(todoText);
    showAlert("success", "Deleted");
  }
}

// Function to format the date or return a default value if the date is invalid
function formatDate(dateString) {
  const date = new Date(dateString);
  if (isNaN(date)) {
    return "(invalid date)";
  } else {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString(undefined, options);
  }
}























