let taskInput = document.getElementById("taskInput");
let addTaskBtn = document.getElementById("addTaskBtn");
let taskList = document.getElementById("taskList");
let showAll = document.getElementById("showAll");
let showActive = document.getElementById("showActive");
let showCompleted = document.getElementById("showCompleted");
let sortByDate = document.getElementById("sortByDate");
let sortByText = document.getElementById("sortByText");
let searchInput = document.getElementById("searchInput");

let originalTasks = []; // Массив для хранения исходного порядка задач

document.addEventListener("DOMContentLoaded", function () {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || []; // Получаем задачи из LocalStorage
  tasks.forEach(task => {
    addTaskToDOM(task.text, task.completed, task.date); // Добавляем задачи в DOM
  });
  originalTasks = Array.from(taskList.querySelectorAll("li")); // Сохраняем исходный порядок задач
});

function addTaskToDOM(text, completed = false, date = new Date().toLocaleString()) {
  let li = document.createElement("li"); // Создаем элемент списка (li)

  let taskTextNode = document.createTextNode(text); // Создаем текстовый узел для задачи
  li.appendChild(taskTextNode); // Добавляем текст задачи в li

  if (completed) {
    li.classList.add("completed"); // Добавляем класс "completed", если задача выполнена
  }

  let dateElement = document.createElement("span"); // Создаем элемент для отображения даты
  dateElement.textContent = ` (${date})`; // Добавляем дату в формате "дд.мм.гггг, чч:мм:сс"
  dateElement.style.fontSize = "12px"; // Уменьшаем размер шрифта
  dateElement.style.color = "#666"; // Серый цвет для даты
  li.appendChild(dateElement); // Добавляем дату в элемент задачи

  let taskButtons = document.createElement("div"); // Создаем контейнер для кнопок
  taskButtons.className = "task-buttons"; // Добавляем класс для стилизации

  let completeBtn = document.createElement("button"); // Кнопка "Выполнено"
  completeBtn.textContent = completed ? "Отменить" : "Выполнено"; // Текст кнопки зависит от статуса задачи
  completeBtn.classList.add("complete-btn"); // Добавляем класс для стилизации
  completeBtn.addEventListener("click", function () {
    li.classList.toggle("completed"); // Переключаем класс "completed"
    completeBtn.textContent = li.classList.contains("completed") ? "Отменить" : "Выполнено"; // Меняем текст кнопки
    updateLocalStorage(); // Обновляем LocalStorage
  });

  let editBtn = document.createElement("button"); // Кнопка "Редактировать"
  editBtn.textContent = "Редактировать"; // Текст кнопки
  editBtn.classList.add("edit-btn"); // Добавляем класс для стилизации
  editBtn.addEventListener("click", function () {
    let newText = prompt("Редактировать задачу:", text); // Запрашиваем новый текст задачи
    if (newText !== null && newText.trim() !== "") {
      li.childNodes[0].textContent = newText.trim(); // Обновляем текст задачи (первый дочерний элемент)
      updateLocalStorage(); // Обновляем LocalStorage
    }
  });

  let deleteBtn = document.createElement("button"); // Кнопка "Удалить"
  deleteBtn.textContent = "Удалить"; // Текст кнопки
  deleteBtn.classList.add("delete-btn"); // Добавляем класс для стилизации
  deleteBtn.addEventListener("click", function () {
    li.remove(); // Удаляем задачу из DOM
    updateLocalStorage(); // Обновляем LocalStorage
  });

  taskButtons.appendChild(completeBtn); // Добавляем кнопку "Выполнено" в контейнер
  taskButtons.appendChild(editBtn); // Добавляем кнопку "Редактировать" в контейнер
  taskButtons.appendChild(deleteBtn); // Добавляем кнопку "Удалить" в контейнер
  li.appendChild(taskButtons); // Добавляем контейнер с кнопками в элемент задачи

  taskList.appendChild(li); // Добавляем задачу в список (ul)
  originalTasks.push(li); // Добавляем задачу в исходный порядок
}

addTaskBtn.addEventListener("click", function () {
  let taskText = taskInput.value.trim(); // Получаем текст задачи из поля ввода

  if (taskText !== "") {
    addTaskToDOM(taskText); // Добавляем задачу в DOM
    taskInput.value = ""; // Очищаем поле ввода
    updateLocalStorage(); // Обновляем LocalStorage
  }
});

function updateLocalStorage() {
  let tasks = [];
  taskList.querySelectorAll("li").forEach(li => {
    let taskText = li.childNodes[0].textContent; // Получаем текст задачи (первый дочерний элемент)
    let taskDate = li.querySelector("span").textContent.replace(/[()]/g, ""); // Получаем дату задачи
    tasks.push({
      text: taskText, // Текст задачи
      completed: li.classList.contains("completed"), // Статус выполнения
      date: taskDate // Дата создания
    });
  });
  localStorage.setItem("tasks", JSON.stringify(tasks)); // Сохраняем задачи в LocalStorage
}

showAll.addEventListener("click", () => filterTasks("all")); // Показываем все задачи
showActive.addEventListener("click", () => filterTasks("active")); // Показываем только активные задачи
showCompleted.addEventListener("click", () => filterTasks("completed")); // Показываем только выполненные задачи

function filterTasks(filter) {
  let tasks = taskList.querySelectorAll("li"); // Получаем все задачи
  tasks.forEach(task => {
    switch (filter) {
      case "all":
        task.style.display = "flex"; // Показываем все задачи
        break;
      case "active":
        task.style.display = task.classList.contains("completed") ? "none" : "flex"; // Показываем только активные задачи
        break;
      case "completed":
        task.style.display = task.classList.contains("completed") ? "flex" : "none"; // Показываем только выполненные задачи
        break;
    }
  });
}

sortByDate.addEventListener("click", () => sortTasks("date")); // Сортировка по дате
sortByText.addEventListener("click", () => sortTasks("text")); // Сортировка по алфавиту

function sortTasks(sortBy) {
  let tasks = Array.from(taskList.querySelectorAll("li")); // Получаем все задачи как массив
  tasks.sort((a, b) => {
    if (sortBy === "date") {
      let dateA = new Date(a.querySelector("span").textContent.replace(/[()]/g, "")); // Получаем дату задачи A
      let dateB = new Date(b.querySelector("span").textContent.replace(/[()]/g, "")); // Получаем дату задачи B
      return dateA - dateB; // Сравниваем даты
    } else if (sortBy === "text") {
      let textA = a.childNodes[0].textContent.toLowerCase(); // Получаем текст задачи A
      let textB = b.childNodes[0].textContent.toLowerCase(); // Получаем текст задачи B
      return textA.localeCompare(textB); // Сравниваем текст
    }
  });

  taskList.innerHTML = ""; // Очищаем список
  tasks.forEach(task => taskList.appendChild(task)); // Добавляем отсортированные задачи
}

// Кнопка для сброса сортировки
let resetSortBtn = document.createElement("button"); // Создаем кнопку "Сбросить сортировку"
resetSortBtn.textContent = "Сбросить сортировку"; // Текст кнопки
resetSortBtn.id = "resetSortBtn"; // Добавляем ID
resetSortBtn.style.marginTop = "10px"; // Отступ сверху
document.getElementById("sorting").appendChild(resetSortBtn); // Добавляем кнопку в контейнер сортировки

// Обработчик для сброса сортировки
resetSortBtn.addEventListener("click", function () {
  taskList.innerHTML = ""; // Очищаем список
  originalTasks.forEach(task => taskList.appendChild(task)); // Возвращаем задачи в исходном порядке
});

searchInput.addEventListener("input", function () {
  let searchText = searchInput.value.trim().toLowerCase(); // Получаем текст для поиска
  let tasks = taskList.querySelectorAll("li"); // Получаем все задачи

  tasks.forEach(task => {
    let taskText = task.childNodes[0].textContent.toLowerCase(); // Получаем текст задачи (первый дочерний элемент)
    if (taskText.includes(searchText)) {
      task.style.display = "flex"; // Показываем задачу
    } else {
      task.style.display = "none"; // Скрываем задачу
    }
  });
});
