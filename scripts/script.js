var currentHighestZIndex = 1;
var consoleWindows = [];

class ConsoleWindow {


  constructor(title, iconPath, contentPath, index) {
    this.title = title;
    this.iconPath = iconPath;
    this.contentPath = contentPath;
    this.index = index;

    this.createWindow();
    this.createTaskbarIcon();
    this.createIcon();
  }

  close() {
    this.visible = false;
    this.window.classList.add('shrink-animation');
    setTimeout(() => {
      this.window.remove();
      this.taskbarIcon.remove();
      this.window.classList.remove('shrink-animation');
    }, 500)
    if (consoleWindows.filter(window => window.visible).length == 0) {
      currentHighestZIndex = 0;
      return
    }
    currentHighestZIndex--;
  }

  createWindow() {
    let consoleWindow = document.createElement("div");
    consoleWindow.classList.add("console-window");
    consoleWindow.classList.add("show");

    consoleWindow.innerHTML = `
      <div class="console-bar">
        <span>${this.title}</span>
        <button class="close-btn">X</button>
      </div>
      <div class="console-content">
      </div>
    `;

    fetch(this.contentPath)
    .then(response => {
      if(response.ok){
        return response.text();
      }else{
        return "";
      }
    })
    .then(data => {
      consoleWindow.querySelector(".console-content").innerHTML = data;
    })
    .catch(error => {
      console.error('Error loading HTML:', error);
    });


    consoleWindow.querySelector(".close-btn").addEventListener("click", () => {
      this.close();
    });

    this.window = consoleWindow;
  }

  createIcon() {
    let icon = document.createElement("li");
    if (this.iconPath == "") {
      this.iconPath = "../icons/projects.png"
    }

    icon.innerHTML = `
      <img src="${this.iconPath}" alt="${this.title}" />
      <span>${this.title}</span>
    `

    this.icon = icon;
  }

  updateConsoleWindowZIndex() {
    this.window.style.zIndex = currentHighestZIndex + 1;
    this.window.style.visibility = 'visible';
    currentHighestZIndex++;
    consoleWindows.forEach(consoleWindow => {
      consoleWindow.taskbarSetStandardBgColor()
    });
    this.taskbarIcon.style.backgroundColor = '#2d2c2c';
  }

  createTaskbarIcon() {
    let taskbarIcon = document.createElement("li");
    taskbarIcon.classList.add("taskbar-icon");

    let iconTitle = document.createElement("span");
    iconTitle.innerText = this.title;

    taskbarIcon.addEventListener("click", () => {
      this.updateConsoleWindowZIndex();
    });

    taskbarIcon.appendChild(iconTitle);
    this.taskbarIcon = taskbarIcon;
  }

  taskbarSetStandardBgColor() {
    this.taskbarIcon.style.backgroundColor = '#1c1b1b';
  }
}


login_handling()
read_data()
update_time()

document.getElementById("start-btn").addEventListener("click", function () {
  consoleWindows.forEach(consoleWindow => {
    consoleWindow.window.style.visibility = 'hidden';
  });
  currentHighestZIndex = 0;
  consoleWindows.forEach(consoleWindow => {
    consoleWindow.taskbarSetStandardBgColor()
  });
});

document.getElementById("language-btn").addEventListener("click", function () {
  let languageSelect = document.getElementById("language-select");
  if (languageSelect.style.visibility === "visible") {
    languageSelect.style.visibility = "hidden";
  } else {
    languageSelect.style.visibility = "visible";
  }
});

document.getElementById("language-PL").addEventListener("click", function () {
  setCookie("language","pl");
  window.location.href = '../';
});

document.getElementById("language-EN").addEventListener("click", function () {
  setCookie("language","en");
  window.location.href = '../';
});

function setCookie(name, value) {
  document.cookie = name + "=" + value + ";expires=Thu, 31 Dec 9999 23:59:59 GMT;path=/";
}


function login_handling() {

  let passwordField = document.getElementById('password-field');
  let passwordLength = 12;
  let index = 0;

  function typePassword() {
    if (index < passwordLength) {
      passwordField.textContent += '*';
      index++;
      setTimeout(typePassword, Math.floor(Math.random() * 50) + 100);
    } else {
      document.getElementById("login-btn").removeAttribute("disabled");
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    document.getElementById("login-btn").setAttribute("disabled", "");
    setTimeout(typePassword, 1000);
  });

  document.getElementById("login-btn").addEventListener("click", function () {
    document.getElementById("login-screen").classList.add("slide-up");
  });
}

function update_time() {
  let clock = document.getElementById("time")
  let date = document.getElementById("date")

  function refresh() {
    let currTime = new Date();
    clock.innerHTML = String(currTime.getHours()).padStart(2, '0') + ":" + String(currTime.getMinutes()).padStart(2, '0');
    date.innerHTML = String(currTime.getDate()).padStart(2, '0') + "." +
      String(currTime.getMonth()).padStart(2, '0') + "." +
      currTime.getFullYear()
    setTimeout(refresh, 1000);
  }

  refresh();
}

function new_link_icon(title,iconPath,url){
  let icon = document.createElement("li");

  icon.innerHTML = `
    <img src="${iconPath}" alt="${title}" />
    <span>${title}</span>
  `

  icon.addEventListener("click", () => {
    window.open(url, '_blank').focus();
  });

  return icon;
}

function read_data() {

  let desktop = document.getElementById("desktop");
  consoles = document.querySelectorAll(".console-window");
  consoles.forEach(console => {
    console.remove();
  });

  let desktopIcons = document.getElementById("icons");
  desktopIcons.innerHTML = '';

  let desktopLinks = document.getElementById("links");
  desktopLinks.innerHTML = '';

  let taskbarIcons = document.getElementById("taskbar-icons");
  taskbarIcons.innerHTML = '';

  fetch("data.json")
    .then(response => response.json())
    .then(data => {
      consoleWindows = Array(data.length);

      data.projects.forEach((project, index) => {
        let consoleWindow = new ConsoleWindow(project.title, project.iconPath, project.contentPath, index);

        consoleWindow.icon.addEventListener("click", () => {
          if (consoleWindow.visible) {
            consoleWindow.updateConsoleWindowZIndex();
            return;
          }

          consoleWindow.visible = true;
          taskbarIcons.appendChild(consoleWindow.taskbarIcon);
          desktop.appendChild(consoleWindow.window);
          consoleWindow.updateConsoleWindowZIndex();
        })

        desktopIcons.appendChild(consoleWindow.icon);
        consoleWindows[index] = consoleWindow;
      });

      data.links.forEach((link, index) => {
        let linkIcon = new_link_icon(link.title,link.iconPath,link.url)

        desktopLinks.appendChild(linkIcon)
      });
    });
}