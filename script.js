"use strict";

let taskList = document.querySelector(".task-list");
let taskInput = document.querySelector(".task-input");
let form = document.querySelector(".form");
let toDo = document.getElementById("to-do");
let betterToDo = document.getElementById("better-to-do");
let necessaryToDo = document.getElementById("necessary-to-do");
let taskMenu = document.querySelector(".task-menu");
let sorting = document.querySelector(".sorting");
let filter = document.querySelector(".importance-filter");
let noTaskText = document.querySelector(".no-task-text");
let counter = 0;
let tasksArray = [];

let taskTextArray = localStorage.getItem("text") ? JSON.parse(localStorage.getItem("text")) : [];
let texts = JSON.parse(localStorage.getItem("text"));

let taskImportanceArray = localStorage.getItem("class") ? JSON.parse(localStorage.getItem("class")) : [];
let classes = JSON.parse(localStorage.getItem("class"));

let filterValue = localStorage.getItem("filter") ? localStorage.getItem("filter") : 0;

if (texts) {
  for (let i = 0; i < texts.length; i++) {
    addNewTask(texts[i], false, classes[i]);
  }
  setFilter();
  sorting.value = "by-order";
}

function addNoTasksText() {
  let tasks = document.querySelector(".task");

  if (tasks) {
    noTaskText.classList.add("hidden");
  } else {
    noTaskText.classList.remove("hidden");
  }
}
addNoTasksText();

// Добавление дел
function addNewTask(input, isNew, classText) {
  let newTask = document.createElement("li");
  newTask.textContent = input;

  if (isNew) {
    if (toDo.checked) {
      newTask.classList.add("to-do", "task");
      newTask.dataset.importanceNumber = 1;
    } else if (betterToDo.checked) {
      newTask.classList.add("better-to-do", "task");
      newTask.dataset.importanceNumber = 2;
    } else if (necessaryToDo.checked) {
      newTask.classList.add("necessary-to-do", "task");
      newTask.dataset.importanceNumber = 3;
    }

    taskTextArray.push(taskInput.value);
    localStorage.setItem("text", JSON.stringify(taskTextArray));

    taskImportanceArray.push(newTask.classList.item(0));
    localStorage.setItem("class", JSON.stringify(taskImportanceArray));
  } else {
    newTask.classList.add(classText, "task");
    if (classText === "to-do") {
      newTask.dataset.importanceNumber = 1;
    } else if (classText === "better-to-do") {
      newTask.dataset.importanceNumber = 2;
    } else if (classText === "necessary-to-do") {
      newTask.dataset.importanceNumber = 3;
    }
  }

  newTask.dataset.orderNumber = counter;

  addPoints(newTask);

  taskInput.value = "";
  taskList.append(newTask);
  counter++;
}

form.addEventListener("submit", function (evt) {
  evt.preventDefault();

  addNewTask(taskInput.value, true);
  setFilter();
  sortTasks();
  addNoTasksText();
});

// Добавление точек
function addPoints(newTask) {
  let points = document.createElement("a");
  points.classList.add("points");
  newTask.append(points);
  addMenu(points, newTask);
}

// Добавление меню 
function addMenu(points, newTask) {
  points.addEventListener("click", function () {
    taskMenu.classList.toggle("hidden");

    let tasks = document.querySelectorAll(".task");
    let allPoints = document.querySelectorAll(".points");


    if (window.matchMedia('(max-width: 768px)').matches && !taskMenu.classList.contains("hidden")) {
      newTask.style.width = "65%";
      points.style.left = "83%";
    } else if (window.matchMedia('(max-width: 768px)').matches && taskMenu.classList.contains("hidden")) {
      tasks.forEach((task) => task.style.width = "80%");
      allPoints.forEach((point) => point.style.left = "86%");
    }

    if (window.matchMedia('(max-width: 480px)').matches && !taskMenu.classList.contains("hidden")) {
      newTask.style.width = "65%";
      points.style.left = "81%";
    } else if (window.matchMedia('(max-width: 480px)').matches && taskMenu.classList.contains("hidden")) {
      tasks.forEach((task) => task.style.width = "85%");
      allPoints.forEach((point) => point.style.left = "84%");
    }

    newTask.append(taskMenu);

    deleteTask(newTask);

    makeTaskDone(newTask, points);
  });
}

//Удаление дел
function deleteTask(newTask) {
  let deleteButton = document.querySelector(".delete");
  deleteButton.onclick = function () {
    newTask.remove();
    taskMenu.classList.add("hidden");
    window.onbeforeunload = function () {
      sorting.value = "by-order";
      sortTasks();

      localStorage.clear();
      taskTextArray = [];
      taskImportanceArray = [];

      let tasks = document.querySelectorAll(".task");
      for (let task of tasks) {
        taskTextArray.push(task.textContent);
        localStorage.setItem("text", JSON.stringify(taskTextArray));
        taskImportanceArray.push(task.classList.item(0));
        localStorage.setItem("class", JSON.stringify(taskImportanceArray));
      }
    }
    setFilter();
    addNoTasksText();
  }
}

// Пометить как сделанное
function makeTaskDone(newTask, points) {
  let markAsDone = document.querySelector(".mark-as-done");
  markAsDone.onclick = function () {
    newTask.classList.toggle("done");
    taskMenu.classList.add("hidden");
    if (markAsDone.textContent === "Сделано") {
      markAsDone.textContent = "Не сделано";
    } else {
      markAsDone.textContent = "Сделано";
    }

    if (window.matchMedia('(max-width: 768px)').matches && taskMenu.classList.contains("hidden")) {
      newTask.style.width = "80%";
      points.style.left = "86%";
    }

    if (window.matchMedia('(max-width: 480px)').matches && taskMenu.classList.contains("hidden")) {
      newTask.style.width = "85%";
      points.style.left = "84%";
    }
  }
}

// Фильтр дел
function setFilter() {
  let tasks = document.querySelectorAll(".task");
  for (let task of tasks) {
    if (task.classList.item(0) !== filter.value && filter.value !== "all") {
      task.classList.add("hidden");
    } else {
      task.classList.remove("hidden");
    }
  }
}

filter.onchange = function () {
  setFilter();

  localStorage.setItem("filter", filter.value);
}

// Сортировка дел
function sortTasks() {
  let tasks = document.querySelectorAll(".task");
  if (sorting.value === "by-importance") {
    tasksArray = [];
    for (let i = 3; i >= 1; i--) {
      for (let task of tasks) {
        if (task.dataset.importanceNumber == i) {
          tasksArray.push(task);
        }
      }
    }
    for (let i = 0; i < tasksArray.length; i++) {
      taskList.append(tasksArray[i]);
    }
  } else if (sorting.value === "by-order") {
    tasksArray = [];
    for (let i = 0; i < tasks.length; i++) {
      tasksArray[i] = tasks[i];
    }
    tasksArray.sort((a, b) => a.dataset.orderNumber - b.dataset.orderNumber);
    for (let i = 0; i < tasksArray.length; i++) {
      taskList.append(tasksArray[i]);
    }
  }
}

sorting.addEventListener("change", () => sortTasks());