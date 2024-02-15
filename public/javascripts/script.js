//initialisation
determineTheme = () => {
  console.log(localStorage.getItem("theme"));
  if (localStorage.getItem("theme") == "dark-theme") {
    return "dark";
  } else if (localStorage.getItem("theme") == "light-theme") {
    return "light";
  } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
    return "dark";
  } else {
    return "light";
  }
};

refreshCSS = () => {
  let links = document.getElementsByTagName("link");
  for (let i = 0; i < links.length; i++) {
    if (links[i].getAttribute("rel") == "stylesheet") {
      let href = links[i].getAttribute("href").split("?")[0];

      let newHref = href + "?version=" + new Date().getMilliseconds();

      links[i].setAttribute("href", newHref);
    }
  }
};

function changeTheme(element) {
  console.log(currentTheme);
  let classes = document.body.classList;
  for (var i = 0; i < classes.length; i++) {
    if (classes[i].endsWith("-theme")) {
      document.body.classList.remove(classes[i]);
    }
  }
  iframeElement = element.querySelector("img");

  if (currentTheme == "light") {
    currentTheme = "dark";
    iframeElement.src = "./images/icon-sun.svg";
    iframeElement.style.filter = "invert(0%)";
  } else {
    currentTheme = "light";
    iframeElement.src = "./images/icon-moon.svg";
    iframeElement.style.filter = "invert(0%)";
  }
  document.body.classList.add(currentTheme + "-theme");
}

let currentTheme;
let itemsLeft = 0;
currentTheme = determineTheme();
document.body.classList.add(currentTheme + "-theme");
iframeElement = document.querySelector(".theme-icon");
if (currentTheme == "dark") {
  iframeElement.src = "./images/icon-sun.svg";
  iframeElement.style.filter = "invert(0%)";
} else {
  iframeElement.src = "./images/icon-moon.svg";
  iframeElement.style.filter = "invert(0%)";
}

var input = document.querySelector("input[type='search']");
input.addEventListener("keypress", function (event) {
  if (event.keyCode === 13) {
    submitNewTask(input.value);
    input.value = "";
  }
});

let submitNewTask = (task) => {
  // Creation of new task
  console.log(task, " to be inputted");
  let wrapper = document.querySelector(".old-todo-wrapper");
  let tmpDiv = document.createElement("li");
  tmpDiv.classList.add("old-todo");
  // tmpDiv.setAttribute('draggable','true');
  tmpDiv.innerHTML = `
      <div class="custom-checkbox">
        <img src="./images/icon-check.svg" alt="Check">
      </div>
      <div name="old-todo-text" class="old-todo-text">${task}</div>
      <img src="./images/icon-cross.svg" class="cross" onclick="removeTask(this)">
    `;

  // Addition into the wrapper
  wrapper.insertBefore(tmpDiv, wrapper.querySelector(".footer"));

  // Managing checkbox behaviour
  updateEventListener(tmpDiv.querySelector(".custom-checkbox"));

  // Managing bottom counter
  itemsLeft += 1;
  document.querySelector(".items-left").innerHTML = itemsLeft + " items left";

  // Managing visibility based on viewState
  document.querySelector(".active").click();

  updateHR();
};

document.addEventListener("DOMContentLoaded", function () {
  updateEventListener(document.querySelector("#new-todo-button"));
});

function updateEventListener(element) {
  console.log(element.classList);
  element.addEventListener("click", function () {
    element.classList.toggle("checked");
    let textStyle = element.parentElement.querySelector(".old-todo-text").style;
    if (!element.classList.contains("checked")) {
      textStyle.textDecoration = "none";
      textStyle.color = "var(--default-text)";
      itemsLeft += 1;
      document.querySelector(".items-left").innerHTML =
        itemsLeft + " items left";
    } else {
      textStyle.textDecoration = "line-through";
      textStyle.color = "var(--button-outline)";
      itemsLeft -= 1;
      document.querySelector(".items-left").innerHTML =
        itemsLeft + " items left";
    }
    document.querySelector(".active").click();
  });
}

function setView(element, option) {
  document.querySelector(".selector-option.active").classList.remove("active");
  element.classList.add("active");
  let tasks = document
    .querySelector(".old-todo-wrapper")
    .querySelectorAll(".old-todo");
  if (option == "all") {
    tasks.forEach((task) => {
      task.removeAttribute("display");
      task.style.display = "flex";
    });
  } else if (option == "active") {
    tasks.forEach((task) => {
      console.log(task.querySelector(".custom-checkbox"));
      if (
        task.querySelector(".custom-checkbox").classList.contains("checked")
      ) {
        task.style.display = "none";
      } else {
        task.style.display = "flex";
      }
    });
  } else if (option == "completed") {
    tasks.forEach((task) => {
      console.log(task.querySelector(".custom-checkbox"));
      if (
        !task.querySelector(".custom-checkbox").classList.contains("checked")
      ) {
        task.style.display = "none";
      } else {
        task.style.display = "flex";
      }
    });
  }
  updateHR();
}

function clearCompleted() {
  let todos = document.querySelectorAll("li.old-todo");
  let completedCounter = 0;
  todos.forEach((todo) => {
    if (todo.querySelector(".custom-checkbox").classList.contains("checked")) {
      document.querySelector(".old-todo-wrapper").removeChild(todo);
    }
  });
  updateHR();
}

let dragArea = document.querySelector(".old-todo-wrapper");
new Sortable(dragArea, {
  animation: 150,
  chosenClass: "bad",
  onStart: function (evt) {
    document.querySelectorAll("hr").forEach((hr) => {
      hr.style.display = "none";
    });
  },
  onEnd: function (evt) {
    let item = evt.item;
    updateHR();
  },
});

function updateHR() {
  let todos = document.querySelectorAll(".old-todo");
  document.querySelectorAll("hr").forEach((hr) => {
    hr.remove();
  });
  if (todos.length == 0) {
    return;
  }
  todos.forEach((todo) => {
    if (getComputedStyle(todo).display !== "none") {
      let hr = document.createElement("hr");
      document
        .querySelector(".old-todo-wrapper")
        .insertBefore(hr, todo.nextSibling);
    }
  });
}

function removeTask(element) {
  if (
    !element.parentElement
      .querySelector(".custom-checkbox")
      .classList.contains("checked")
  ) {
    itemsLeft -= 1;
  }
  document.querySelector(".items-left").innerHTML = itemsLeft + " items left";
  element.parentElement.remove();
  updateHR();
}

window.addEventListener("DOMContentLoaded", () => {
  if (window.innerWidth <= 750 && localStorage.getItem("content")) {
    let selectorString = `
        <div class="selector-option active" onclick="setView(this,'all')">All</div>
        <div class="selector-option" onclick="setView(this,'active')">Active</div>
        <div class="selector-option" onclick="setView(this,'completed')">Completed</div>
      `;
    let selector = document.createElement("div");
    selector.innerHTML = selectorString;
    document.querySelector(".outside-container").appendChild(selector);
    selector.classList.add("selector-outside");
  } else if (window.innerWidth <= 750) {
    let selector = document.querySelector(".selector");
    document.querySelector(".footer").removeChild(selector);
    document.querySelector(".outside-container").appendChild(selector);
    selector.classList.add("selector-outside");
  }
  refreshCSS();
});

document.addEventListener("DOMContentLoaded", () => {
  let contentDiv = document.querySelector(".old-todo-wrapper");
  let savedContent = localStorage.getItem("content");
  console.log(savedContent);
  if (savedContent) {
    contentDiv.innerHTML = savedContent;
  }
  document.querySelectorAll(".old-todo > .custom-checkbox").forEach((todo) => {
    updateEventListener(todo);
  });
  itemsLeft = document.querySelectorAll(
    ".old-todo > .custom-checkbox:not(.checked)"
  ).length;
  document.querySelector(".items-left").innerHTML = itemsLeft + " items left";

  // Save content when user leaves the page
  window.addEventListener("beforeunload", () => {
    let todoList = document.querySelector(".old-todo-wrapper").innerHTML;
    if (window.innerWidth <= 750) {
      todoList += "";
    }

    let classes = document.body.classList;
    let currentTheme;
    for (let i = 0; i < classes.length; i++) {
      if (classes[i].endsWith("-theme")) {
        currentTheme = classes[i];
        break;
      }
    }
    localStorage.setItem("theme", currentTheme);
    localStorage.setItem("content", todoList);
  });
});

function store() {
  let todoList = document.querySelector(".old-todo-wrapper").innerHTML;

  let classes = document.body.classList;
  let currentTheme;
  for (let i = 0; i < classes.length; i++) {
    if (classes[i].endsWith("-theme")) {
      currentTheme = classes[i];
      break;
    }
  }
  localStorage.setItem("theme", currentTheme);
  localStorage.setItem("content", todoList);

  console.log(localStorage.getItem("content"));
  console.log(localStorage.getItem("theme"));
}

function clearData() {
  localStorage.clear();
}
