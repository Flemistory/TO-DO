let taskInput = document.getElementById("taskInput");
let addTaskBtn = document.getElementById("addTaskBtn");
let taskList = document.getElementById("taskList");
let showAll = document.getElementById("showAll");
let showActive = document.getElementById("showActive");
let showCompleted = document.getElementById("showCompleted");
let sortByDate = document.getElementById("sortByDate");
let sortByText = document.getElementById("sortByText");
let searchInput = document.getElementById("searchInput");
let categoryInput = document.getElementById("categoryInput");
let priorityInput = document.getElementById("priorityInput");
let deadlineInput = document.getElementById("deadlineInput");
let themeToggle = document.getElementById("themeToggle");

let originalTasks = [];

// Загрузка задач из LocalStorage
document.addEventListener("DOMContentLoaded", function () {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.forEach(task => {
    addTaskToDOM(task.text, task.completed, task.date, task.category, task.deadline, task.priority);
  });
  originalTasks = Array.from(taskList.querySelectorAll("li"));

  // Загрузка темы
  if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark-theme");
    themeToggle.textContent = "Светлая тема";
  }
});

// Добавление задачи в DOM
function addTaskToDOM(text, completed = false, date = new Date().toLocaleString(), category = "Другое", deadline = "", priority = "Средний") {
  let li = document.createElement("li");

  let taskTextNode = document.createTextNode(text);
  li.appendChild(taskTextNode);

  if (completed) {
    li.classList.add("completed");
  }

  let dateElement = document.createElement("span");
  dateElement.textContent = ` (${date})`;
  dateElement.style.fontSize = "12px";
  dateElement.style.color = "#666";
  li.appendChild(dateElement);

  let categoryElement = document.createElement("span");
  categoryElement.textContent = ` [${category}]`;
  categoryElement.style.fontSize = "12px";
  categoryElement.style.color = "#17a2b8";
  li.appendChild(categoryElement);

  let priorityElement = document.createElement("span");
  priorityElement.textContent = ` ⚡ ${priority}`;
  priorityElement.style.fontSize = "12px";
  priorityElement.style.color = priority === "Высокий" ? "#dc3545" : priority === "Средний" ? "#ffc107" : "#28a745";
  li.appendChild(priorityElement);

  if (deadline) {
    let deadlineElement = document.createElement("span");
    deadlineElement.textContent = ` ⏰ ${deadline}`;
    deadlineElement.style.fontSize = "12px";
    deadlineElement.style.color = "#dc3545";
    li.appendChild(deadlineElement);
  }

  let taskButtons = document.createElement("div");
  taskButtons.className = "task-buttons";

  let completeBtn = document.createElement("button");
  completeBtn.textContent = completed ? "Отменить" : "Выполнено";
  completeBtn.classList.add("complete-btn");
  completeBtn.addEventListener("click", function () {
    li.classList.toggle("completed");
    completeBtn.textContent = li.classList.contains("completed") ? "Отменить" : "Выполнено";
    updateLocalStorage();
  });

  let editBtn = document.createElement("button");
  editBtn.textContent = "Редактировать";
  editBtn.classList.add("edit-btn");
  editBtn.addEventListener("click", function () {
    let newText = prompt("Редактировать задачу:", text);
    if (newText !== null && newText.trim() !== "") {
      li.childNodes[0].textContent = newText.trim();
      updateLocalStorage();
    }
  });

  let deleteBtn = document.createElement("button");
  deleteBtn.textContent = "Удалить";
  deleteBtn.classList.add("delete-btn");
  deleteBtn.addEventListener("click", function () {
  li.classList.add("shrink-fade-out");
  setTimeout(() => {
    li.remove();
    updateLocalStorage();
  }, 300);
});

  taskButtons.appendChild(completeBtn);
  taskButtons.appendChild(editBtn);
  taskButtons.appendChild(deleteBtn);
  li.appendChild(taskButtons);

  taskList.appendChild(li);
  originalTasks.push(li);
}

// Добавление задачи
addTaskBtn.addEventListener("click", function () {
  let taskText = taskInput.value.trim();
  let taskCategory = categoryInput.value;
  let taskDeadline = deadlineInput.value;
  let taskPriority = priorityInput.value;

  if (taskText !== "") {
    addTaskToDOM(taskText, false, new Date().toLocaleString(), taskCategory, taskDeadline, taskPriority);
    taskInput.value = "";
    deadlineInput.value = "";
    updateLocalStorage();
  }
});

// Обновление LocalStorage
function updateLocalStorage() {
  let tasks = [];
  taskList.querySelectorAll("li").forEach(li => {
    let taskText = li.childNodes[0].textContent;
    let taskDate = li.querySelector("span").textContent.replace(/[()]/g, "");
    let taskCategory = li.querySelectorAll("span")[1].textContent.replace(/[\[\]]/g, "");
    let taskPriority = li.querySelectorAll("span")[2].textContent.replace("⚡ ", "");
    let taskDeadline = li.querySelectorAll("span")[3] ? li.querySelectorAll("span")[3].textContent.replace("⏰ ", "") : "";
    tasks.push({
      text: taskText,
      completed: li.classList.contains("completed"),
      date: taskDate,
      category: taskCategory,
      priority: taskPriority,
      deadline: taskDeadline
    });
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Фильтрация задач
showAll.addEventListener("click", () => filterTasks("all"));
showActive.addEventListener("click", () => filterTasks("active"));
showCompleted.addEventListener("click", () => filterTasks("completed"));

function filterTasks(filter) {
  let tasks = taskList.querySelectorAll("li");
  tasks.forEach(task => {
    switch (filter) {
      case "all":
        task.style.display = "flex";
        break;
      case "active":
        task.style.display = task.classList.contains("completed") ? "none" : "flex";
        break;
      case "completed":
        task.style.display = task.classList.contains("completed") ? "flex" : "none";
        break;
    }
  });
}

// Сортировка задач
sortByDate.addEventListener("click", () => sortTasks("date"));
sortByText.addEventListener("click", () => sortTasks("text"));

function sortTasks(sortBy) {
  let tasks = Array.from(taskList.querySelectorAll("li"));
  tasks.sort((a, b) => {
    if (sortBy === "date") {
      let dateA = new Date(a.querySelector("span").textContent.replace(/[()]/g, ""));
      let dateB = new Date(b.querySelector("span").textContent.replace(/[()]/g, ""));
      return dateA - dateB;
    } else if (sortBy === "text") {
      let textA = a.childNodes[0].textContent.toLowerCase();
      let textB = b.childNodes[0].textContent.toLowerCase();
      return textA.localeCompare(textB);
    }
  });

  taskList.innerHTML = "";
  tasks.forEach(task => taskList.appendChild(task));
}

// Сброс сортировки
let resetSortBtn = document.createElement("button");
resetSortBtn.textContent = "Сбросить сортировку";
resetSortBtn.id = "resetSortBtn";
resetSortBtn.style.marginTop = "10px";
document.getElementById("sorting").appendChild(resetSortBtn);

resetSortBtn.addEventListener("click", function () {
  taskList.innerHTML = "";
  originalTasks.forEach(task => taskList.appendChild(task));
});

// Поиск задач
searchInput.addEventListener("input", function () {
  let searchText = searchInput.value.trim().toLowerCase();
  let tasks = taskList.querySelectorAll("li");

  tasks.forEach(task => {
    let taskText = task.childNodes[0].textContent.toLowerCase();
    if (taskText.includes(searchText)) {
      task.style.display = "flex";
    } else {
      task.style.display = "none";
    }
  });
});

// Переключение темы
themeToggle.addEventListener("click", function () {
  document.body.classList.toggle("dark-theme");
  if (document.body.classList.contains("dark-theme")) {
    localStorage.setItem("theme", "dark");
    themeToggle.textContent = "Светлая тема";
  } else {
    localStorage.setItem("theme", "light");
    themeToggle.textContent = "Темная тема";
  }
});

// Уведомления о дедлайнах
function checkDeadlines() {
  let tasks = taskList.querySelectorAll("li");
  tasks.forEach(task => {
    let deadlineText = task.querySelectorAll("span")[3]?.textContent.replace("⏰ ", "");
    if (deadlineText) {
      let deadlineDate = new Date(deadlineText);
      let now = new Date();
      let timeDiff = deadlineDate - now; // Разница в миллисекундах
      let hoursDiff = timeDiff / (1000 * 60 * 60); // Разница в часах

      if (hoursDiff <= 24 && hoursDiff > 0) {
        alert(`Задача "${task.childNodes[0].textContent}" скоро истекает!`);
      }
    }
  });
}

// Проверяем дедлайны каждую минуту
setInterval(checkDeadlines, 60000);
