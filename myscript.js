let body = document.querySelector("body");
let storedtasks = localStorage.getItem("task-list");
let storedComp = localStorage.getItem("comp-task-list");
let alltasks = storedtasks ? JSON.parse(storedtasks) : [];
let comptasks = storedComp ? JSON.parse(storedComp) : [];

// ---------- LOAD TASKS FROM LOCAL STORAGE ---------- \\
if (storedtasks) {
  showTask(null, null, "storage");
}
if (storedComp) {
  showCompletedTasks();
}
// Update progress after loading all tasks
progressShow();

// ---------- ADD BTN HANDLING ---------- \\
let addbtn = document.getElementById("add");
addbtn.addEventListener("click", () => {
  let taskip = document.getElementById("task").value;
  let mode = body.getAttribute("data-bs-theme");
  if (taskip === "") {
    Swal.fire({
      theme: mode,
      title: "No task",
      text: "Please enter a task!",
      icon: "warning",
      timer: 1500,
      showConfirmButton: false,
    });
  } else {
    createTask(taskip);
    document.getElementById("task").value = "";
  }
});

// ---------- ADD TASK EVEN IF ENTER IS PRESSED ---------- \\
let taskip = document.getElementById("task");
taskip.addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    addbtn.click();
  }
});

// ---------- ADD TASK IN ARRAY ---------- \\
function createTask(taskip) {
  let taskid = `task-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  let newtask = { id: taskid, value: taskip };
  alltasks.push(newtask);
  localStorage.setItem("task-list", JSON.stringify(alltasks));
  showTask(taskid, taskip);
  progressShow();
}

// ---------- DISPLAYING TASK IN PAGE ---------- \\
function showTask(taskid, taskip, src = "user") {
  if (src === "user") {
    soloTaskMaker(taskid, taskip);
    return;
  } else if (src === "storage") {
    for (let i = 0; i < alltasks.length; i++) {
      soloTaskMaker(alltasks[i].id, alltasks[i].value);
    }
  }
}

// ---------- DISPLAY ALL COMPLETED TASKS FROM STORAGE ---------- \\
function showCompletedTasks() {
  for (let i = 0; i < comptasks.length; i++) {
    soloTaskMaker(comptasks[i].id, comptasks[i].value, "comptasks");
  }
}

// ---------- CREATE AND DISPLAY A SINGLE TASK ELEMENT ---------- \\
function soloTaskMaker(taskid, taskip, src = "alltasks") {
  let items = document.getElementById(
    src === "comptasks" ? "comp-listitems" : "listitems"
  );
  let taskdiv = document.createElement("div");
  taskdiv.className = "container d-flex align-items-center";
  taskdiv.id = `solotask-${taskid}`;
  let checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.className = "m-2 checkbox";
  if (src === "comptasks") {
    checkbox.checked = true;
  }
  checkbox.onclick = () => checkFunc(taskid);
  let taskspan = document.createElement("span");
  taskspan.className = "p-2 m-1 taskvalue";
  taskspan.id = taskid;
  taskspan.contentEditable = "false";
  taskspan.innerText = taskip;
  taskspan.style.fontSize = "20px";

  // Apply completed task styling if it's in completed section
  if (src === "comptasks") {
    taskspan.style.textDecoration = "line-through";
    taskspan.style.color = "green";
  }
  let editbtn = document.createElement("button");
  editbtn.className = "btn btn-info m-2 p-1";
  editbtn.id = `editbtn-${taskid}`;
  editbtn.value = "Edit";
  editbtn.style.color = "white";
  editbtn.style.display = "flex";
  editbtn.style.alignItems = "center"; // Vertical center
  let icon = editIconChanger(editbtn.value);
  editbtn.appendChild(icon);
  editbtn.onclick = () => editFunc(taskid);
  let delbtn = document.createElement("img");
  delbtn.src = "icons/trash-can-regular.svg";
  delbtn.alt = "Delete Task";
  delbtn.width = "24px";
  delbtn.height = "24px";
  delbtn.style.display = "inline-block";
  delbtn.style.filter = "invert(1)";
  delbtn.className = "delbtn";
  delbtn.style.cursor = "pointer";
  delbtn.id = `delbtn-${taskid}`;
  delbtn.onclick = () => deleteTask(taskid);
  taskdiv.appendChild(checkbox);
  taskdiv.appendChild(taskspan);
  taskdiv.appendChild(editbtn);
  taskdiv.appendChild(delbtn);
  items.appendChild(taskdiv);
}

// ---------- SWITCH BETWEEN EDIT AND SAVE ICONS ---------- \\
function editIconChanger(text) {
  if (text === "Save") {
    let saveicon = document.createElement("img");
    saveicon.src = "icons/edit-solid.svg";
    saveicon.alt = "Save Task";
    saveicon.width = "20px";
    saveicon.height = "20px";
    saveicon.style.display = "inline-block";
    saveicon.style.filter = "invert(1)";
    saveicon.style.marginLeft = "8px";
    saveicon.style.verticalAlign = "middle";
    return saveicon;
  } else {
    let editicon = document.createElement("img");
    editicon.src = "icons/edit-regular.svg";
    editicon.alt = "Edit Task";
    editicon.width = "20px";
    editicon.height = "20px";
    editicon.style.display = "inline-block";
    editicon.style.filter = "invert(1)";
    editicon.style.marginLeft = "8px";
    editicon.style.verticalAlign = "middle";

    return editicon;
  }
}

// ---------- DELETE TASK AND UPDATE STORAGE ---------- \\
function deleteTask(taskid) {
  let task = document.getElementById(`solotask-${taskid}`);
  task.remove();

  // Check and remove from appropriate array
  let taskInAll = alltasks.findIndex((t) => t.id === taskid);
  if (taskInAll !== -1) {
    alltasks.splice(taskInAll, 1);
    localStorage.setItem("task-list", JSON.stringify(alltasks));
  } else {
    let taskInComp = comptasks.findIndex((t) => t.id === taskid);
    if (taskInComp !== -1) {
      comptasks.splice(taskInComp, 1);
      localStorage.setItem("comp-task-list", JSON.stringify(comptasks));
    }
  }

  updateButtonStates();
  progressShow();
}

// ---------- ACTUAL EDIT FUNCTIONALITY & UPDATING LOCALSTORAGE---------- \\
function editFunc(taskid) {
  let taskDiv = document.getElementById(`solotask-${taskid}`);
  let content = taskDiv.querySelector("span");
  let button = taskDiv.querySelector("button");

  if (button.value === "Edit") {
    // button.innerText = "Save";
    button.value = "Save";
    button.removeChild(button.firstChild);
    button.appendChild(editIconChanger(button.value));
    content.setAttribute("contenteditable", "true");
    content.focus();
    // Move cursor to end of content
    const range = document.createRange();
    const selection = window.getSelection();
    range.selectNodeContents(content);
    range.collapse(false); // false = collapse to end
    selection.removeAllRanges();
    selection.addRange(range);
  } else {
    button.value = "Edit";
    button.removeChild(button.firstChild);
    button.appendChild(editIconChanger(button.value));
    content.setAttribute("contenteditable", "false");
    // Update the task in alltasks array and localStorage
    let updatedValue = content.innerText;
    let taskIndex = alltasks.findIndex((t) => t.id == content.id);
    if (taskIndex !== -1) {
      alltasks[taskIndex].value = updatedValue;
      localStorage.setItem("task-list", JSON.stringify(alltasks));
    }
  }
}

// ---------- HANDLE TASK COMPLETION STATUS TOGGLE ---------- \\
function checkFunc(taskid) {
  let taskDiv = document.getElementById(`solotask-${taskid}`);
  let content = taskDiv.querySelector("span");
  let checkbox = taskDiv.querySelector("input[type='checkbox']");

  if (checkbox.checked) {
    // Style changes
    content.style.textDecoration = "line-through";
    content.style.color = "green";

    // Move task from alltasks to comptasks
    const taskIndex = alltasks.findIndex((t) => t.id === taskid);
    if (taskIndex !== -1) {
      const completedTask = alltasks.splice(taskIndex, 1)[0];
      comptasks.push(completedTask);

      // Update localStorage
      localStorage.setItem("task-list", JSON.stringify(alltasks));
      localStorage.setItem("comp-task-list", JSON.stringify(comptasks));

      // Move task to completed section
      mvToCompleted(taskid);
    }
  } else {
    // Style changes
    content.style.textDecoration = "none";
    content.style.color = "white";

    // Move task from comptasks back to alltasks
    const taskIndex = comptasks.findIndex((t) => t.id === taskid);
    if (taskIndex !== -1) {
      const incompleteTask = comptasks.splice(taskIndex, 1)[0];
      alltasks.push(incompleteTask);

      // Update localStorage
      localStorage.setItem("task-list", JSON.stringify(alltasks));
      localStorage.setItem("comp-task-list", JSON.stringify(comptasks));

      // Move task back to incomplete section
      mvToCompleted(taskid, "comptasks");
    }
  }

  progressShow();
}

// ---------- MOVE TASK BETWEEN INCOMPLETE AND COMPLETE SECTIONS ---------- \\
function mvToCompleted(taskid, src = "alltasks") {
  let taskDiv = document.getElementById(`solotask-${taskid}`);
  let completedContainer = document.getElementById("comp-listitems");
  let allTasksContainer = document.getElementById("listitems");
  if (src === "alltasks") {
    completedContainer.appendChild(taskDiv);
  } else {
    allTasksContainer.appendChild(taskDiv);
  }
}

// ---------- UPDATE PROGRESS BAR AND TASK COUNTER ---------- \\
function progressShow() {
  let totalTasks = alltasks.length + comptasks.length;
  let completedTasks = comptasks.length;
  let progressBar = document.getElementById("task-progress");
  let tasksDoneSpan = document.getElementById("tasksDone");
  let progressPercent =
    totalTasks === 0 ? 0 : (completedTasks / totalTasks) * 100;

  progressBar.value = progressPercent;
  tasksDoneSpan.innerText = `${completedTasks} / ${totalTasks}`;

  // Update button states whenever progress is updated
  updateButtonStates();

  // Show confetti when all tasks are completed and there are tasks
  if (
    completedTasks > 0 &&
    completedTasks === totalTasks &&
    progressPercent === 100
  ) {
    Confetti();
  }
}

// ---------- ENABLE/DISABLE CLEAR BUTTONS BASED ON TASK STATUS ---------- \\
function updateButtonStates() {
  // Clear All button
  const clearAllBtn = document.getElementById("clearall");
  const hasAnyTasks = alltasks.length > 0 || comptasks.length > 0;
  clearAllBtn.disabled = !hasAnyTasks;
  clearAllBtn.style.cursor = hasAnyTasks ? "pointer" : "not-allowed";

  // Clear Incomplete button
  const clearIncompleteBtn = document.getElementById("clearIncomplete");
  clearIncompleteBtn.disabled = alltasks.length === 0;
  clearIncompleteBtn.style.cursor =
    alltasks.length > 0 ? "pointer" : "not-allowed";

  // Clear Complete button
  const clearCompleteBtn = document.getElementById("clearComplete");
  clearCompleteBtn.disabled = comptasks.length === 0;
  clearCompleteBtn.style.cursor =
    comptasks.length > 0 ? "pointer" : "not-allowed";
}

// ---------- CLEAR ALL TASKS BUTTON HANDLING ---------- \\
function clearAllTasks() {
  let mode = body.getAttribute("data-bs-theme");
  Swal.fire({
    theme: mode,
    title: "Are you sure?",
    text: "This will remove all tasks from your list!",
    icon: "error",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire({
        theme: mode === "dark" ? "dark" : "light",
        title: "All Tasks Cleared!",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
        backdrop:
          mode === "dark"
            ? `
            url("nyan-cat.gif")
            left top
            no-repeat`
            : `
            rgba(84, 84, 92, 0.4)
            url("nyan-cat.gif")
            left top
            no-repeat
        `,
      });
      // Clear both arrays and localStorage
      localStorage.removeItem("task-list");
      localStorage.removeItem("comp-task-list");
      document.getElementById("listitems").innerHTML = "";
      document.getElementById("comp-listitems").innerHTML = "";
      alltasks = [];
      comptasks = [];
      updateButtonStates();
      progressShow();
    }
  });
}

// ---------- CLEAR ALL INCOMPLETE TASKS WITH CONFIRMATION ---------- \\
function clearIncompleteTasks() {
  let mode = body.getAttribute("data-bs-theme");
  Swal.fire({
    theme: mode,
    title: "Clear Incomplete Tasks?",
    text: "This will remove all incomplete tasks from your list!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#ffc107",
    cancelButtonColor: "#d33",
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire({
        theme: mode,
        title: "Incomplete Tasks Cleared!",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
        backdrop:
          mode === "dark"
            ? `
            url("nyan-cat.gif")
            left top
            no-repeat`
            : `
            rgba(84, 84, 92, 0.4)
            url("nyan-cat.gif")
            left top
            no-repeat
        `,
      });
      localStorage.removeItem("task-list");
      document.getElementById("listitems").innerHTML = "";
      alltasks = [];
      updateButtonStates();
      progressShow();
    }
  });
}

// ---------- CLEAR ALL COMPLETED TASKS WITH CONFIRMATION ---------- \\
function clearCompletedTasks() {
  let mode = body.getAttribute("data-bs-theme");
  Swal.fire({
    theme: mode,
    title: "Clear Completed Tasks?",
    text: "This will remove all completed tasks from your list!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#198754",
    cancelButtonColor: "#d33",
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire({
        theme: mode,
        title: "Completed Tasks Cleared!",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
        backdrop:
          mode === "dark"
            ? `
            url("nyan-cat.gif")
            left top
            no-repeat`
            : `
            rgba(84, 84, 92, 0.4)
            url("nyan-cat.gif")
            left top
            no-repeat
        `,
      });
      localStorage.removeItem("comp-task-list");
      document.getElementById("comp-listitems").innerHTML = "";
      comptasks = [];
      updateButtonStates();
      progressShow();
    }
  });
}

// ---------- DISPLAY CELEBRATION CONFETTI ANIMATION ---------- \\
function Confetti() {
  const count = 1000,
    defaults = {
      origin: { y: 1 },
    };

  function fire(particleRatio, opts) {
    confetti(
      Object.assign({}, defaults, opts, {
        particleCount: Math.floor(count * particleRatio),
      })
    );
  }

  fire(0.25, {
    spread: 26,
    startVelocity: 55,
  });

  fire(0.2, {
    spread: 60,
  });

  fire(0.35, {
    spread: 100,
    decay: 0.91,
    scalar: 0.8,
  });

  fire(0.1, {
    spread: 120,
    startVelocity: 25,
    decay: 0.92,
    scalar: 1.2,
  });

  fire(0.1, {
    spread: 120,
    startVelocity: 45,
  });
}
