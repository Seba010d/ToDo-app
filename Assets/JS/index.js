// #region Initapp

let appState = "listView";
let activeList = 0;

let currentData = null;

const dummyData = {
  lists: [
    {
      id: 1,
      name: "List 1",
      items: [
        { id: 1, name: "Item 1", completed: false },
        { id: 2, name: "Item 2", completed: true },
      ],
    },
    {
      id: 2,
      name: "List 2",
      items: [
        { id: 3, name: "Item 3", completed: false },
        { id: 4, name: "Item 4", completed: true },
      ],
    },
  ],
};

const mainContent = document.getElementById("content");
const newListButton = document.getElementById("newListButton");

initApp();

function initApp() {
  console.log("initApp called");
  let storeddata = readData();
  if (storeddata == null) {
    currentData = dummyData;
    saveData(currentData);
  } else {
    currentData = storeddata;
  }
  setupStatics();
}

// Setup static event listeners and elements
function setupStatics() {
  console.log("setupStatics called");
  newListButton.addEventListener("click", newCallback);
  listView();
}

// #endregion

// #region Callback

function listClickCallback(action, index) {
  switch (action) {
    case "showList":
      activeList = index;
      listItemView();
      break;
    case "editList":
      handleEditDelete("list", "edit", index);
      break;
    case "deleteList":
      handleEditDelete("list", "delete", index);
      break;
    default:
      console.error(`${action} ${index} is not valid`);
      break;
  }
}

function itemClickCallback(action, itemIndex) {
  handleEditDelete("item", action === "editItem" ? "edit" : "delete", itemIndex);
}

function newCallback() {
  switch (appState) {
    case "listView":
      showNewListInput();
      break;
    default:
      console.error(`${appState} is not valid`);
      break;
  }
}

// #endregion

// #region functions

// Viser inputfelt for at lave en ny liste
function showNewListInput() {
  if (document.getElementById("newListInput")) return;

  const inputContainer = document.createElement("div");
  inputContainer.id = "newListInputContainer";
  //Create input field
  const input = document.createElement("input");
  input.type = "text";
  input.id = "newListInput";
  input.placeholder = "New list name";
  //Create add button
  const addButton = document.createElement("button");
  addButton.textContent = "Add";
  addButton.addEventListener("click", () => handleNewList(input.value));
  //Create Cancel Button
  const cancelButton = document.createElement("button");
  cancelButton.textContent = "Cancel";
  cancelButton.addEventListener("click", () => inputContainer.remove());
  //Append Elements
  inputContainer.appendChild(input);
  inputContainer.appendChild(addButton);
  inputContainer.appendChild(cancelButton);

  mainContent.prepend(inputContainer);
  input.focus();
}

// Opretter en ny liste
function handleNewList(text) {
  const newListName = text.trim();
  if (!newListName) return;
  //find næste id
  let nextId = 1;
  if (currentData.lists.length > 0) {
    const maxId = Math.max(...currentData.lists.map((list) => list.id));
    nextId = maxId + 1;
  }
  //opretter den nye liste
  const newList = {
    id: nextId,
    name: newListName,
    items: [],
  };

  currentData.lists.push(newList);
  saveData(currentData);

  const container = document.getElementById("newListInputContainer");
  if (container) container.remove();
  listView();
}

// Viser alle lister
function listView() {
  mainContent.innerHTML = "";
  appState = "listView";

  newListButton.style.display = "block";

  currentData.lists.forEach((list, index) => {
    const listElement = document.createElement("div");
    listElement.className = "listview";
    listElement.innerHTML = `<h2 onclick="listClickCallback('showList',${index})">${list.name}</h2>
       <button onclick="listClickCallback('editList',${index})"><i class="fa-solid fa-pen-to-square"></i></button>
       <button onclick="listClickCallback('deleteList',${index})"><i class="fa-solid fa-trash"></i></button>`;
    mainContent.appendChild(listElement);
  });
}

// Viser items i en liste
function listItemView() {
  const list = currentData.lists[activeList];
  if (!list) {
    console.error("List not found:", activeList);
    return;
  }
  appState = "itemView";
  mainContent.innerHTML = "";

  newListButton.style.display = "none";

  const title = document.createElement("h2");
  title.textContent = list.name;
  mainContent.appendChild(title);

  // Input + Add-knap til nye items
  const inputContainer = document.createElement("div");
  const input = document.createElement("input");
  input.type = "text";
  input.placeholder = "New item";

  const addButton = document.createElement("button");
  addButton.textContent = "Add";
  addButton.addEventListener("click", () => {
    handleNewItem(input.value);
    input.value = "";
  });

  inputContainer.appendChild(input);
  inputContainer.appendChild(addButton);
  mainContent.appendChild(inputContainer);

  // Items vises under inputfeltet med check/uncheck
  const itemsContainer = document.createElement("div");
  list.items.forEach((item, itemIndex) => {
    const itemElement = document.createElement("div");

    // Checkbox til completed
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = item.completed;
    checkbox.addEventListener("change", () => {
      item.completed = checkbox.checked;
      saveData(currentData);
      span.style.textDecoration = item.completed ? "line-through" : "none";
    });

    const span = document.createElement("span");
    span.textContent = item.name;
    span.style.textDecoration = item.completed ? "line-through" : "none";

    // Edit og delete knapper med icons
    const editBtn = document.createElement("button");
    editBtn.innerHTML = '<i class="fa-solid fa-pen-to-square"></i>';
    editBtn.addEventListener("click", () => itemClickCallback("editItem", itemIndex));

    const deleteBtn = document.createElement("button");
    deleteBtn.innerHTML = '<i class="fa-solid fa-trash"></i>';
    deleteBtn.addEventListener("click", () => itemClickCallback("deleteItem", itemIndex));

    itemElement.appendChild(checkbox);
    itemElement.appendChild(span);
    itemElement.appendChild(editBtn);
    itemElement.appendChild(deleteBtn);

    itemsContainer.appendChild(itemElement);
  });
  mainContent.appendChild(itemsContainer);

  const backButton = document.createElement("button");
  backButton.textContent = "Back";
  backButton.addEventListener("click", listView);
  mainContent.appendChild(backButton);
}

// Tilføjer nyt item
function handleNewItem(text) {
  const newItemName = text.trim();
  if (!newItemName) return;

  const list = currentData.lists[activeList];
  if (!list) return;

  // find næste id
  let nextId = 1;
  if (list.items.length > 0) {
    const maxId = Math.max(...list.items.map((item) => item.id));
    nextId = maxId + 1;
  }

  const newItem = {
    id: nextId,
    name: newItemName,
    completed: false,
  };

  list.items.push(newItem);
  saveData(currentData);

  // opdater view så det nye item vises
  listItemView();
}

// #endregion

// #region Edit/Delete

function handleEditDelete(type, action, index) {
  if (type === "list") {
    const list = currentData.lists[index];
    const listElement = mainContent.children[index];
    const editBtn = listElement.querySelector("button:nth-of-type(1)");
    const deleteBtn = listElement.querySelector("button:nth-of-type(2)");

    if (action === "edit") {
      // Skjul knapper under edit
      editBtn.style.display = "none";
      deleteBtn.style.display = "none";

      // Inline edit input
      const h2 = listElement.querySelector("h2");
      const input = document.createElement("input");
      input.type = "text";
      input.value = list.name;

      const saveBtn = document.createElement("button");
      saveBtn.textContent = "Save";
      saveBtn.addEventListener("click", () => {
        if (input.value.trim() !== "") {
          list.name = input.value.trim();
          saveData(currentData);
        }
        listView();
      });

      const cancelBtn = document.createElement("button");
      cancelBtn.textContent = "Cancel";
      cancelBtn.addEventListener("click", () => listView());

      h2.replaceWith(input);
      listElement.appendChild(saveBtn);
      listElement.appendChild(cancelBtn);
      input.focus();
    } else if (action === "delete") {
      openConfirmBox(`Delete list "${list.name}"?`, () => {
        currentData.lists.splice(index, 1);
        saveData(currentData);
        listView();
      });
    }
  } else if (type === "item") {
    const list = currentData.lists[activeList];
    const item = list.items[index];
    const itemElement = mainContent.querySelectorAll("div")[index];
    const editBtn = itemElement.querySelector("button:nth-of-type(1)");
    const deleteBtn = itemElement.querySelector("button:nth-of-type(2)");

    if (action === "edit") {
      // Skjul knapper under edit
      editBtn.style.display = "none";
      deleteBtn.style.display = "none";

      const span = itemElement.querySelector("span");
      const input = document.createElement("input");
      input.type = "text";
      input.value = item.name;

      const saveBtn = document.createElement("button");
      saveBtn.textContent = "Save";
      saveBtn.addEventListener("click", () => {
        if (input.value.trim() !== "") {
          item.name = input.value.trim();
          saveData(currentData);
        }
        listItemView();
      });

      const cancelBtn = document.createElement("button");
      cancelBtn.textContent = "Cancel";
      cancelBtn.addEventListener("click", () => listItemView());

      span.replaceWith(input);
      itemElement.appendChild(saveBtn);
      itemElement.appendChild(cancelBtn);
      input.focus();
    } else if (action === "delete") {
      openConfirmBox(`Delete item "${item.name}"?`, () => {
        list.items.splice(index, 1);
        saveData(currentData);
        listItemView();
      });
    }
  }
}

function openEditBox(title, currentValue, callback) {
  const box = document.createElement("div");
  box.className = "modalBox";

  const heading = document.createElement("h3");
  heading.textContent = title;

  const input = document.createElement("input");
  input.type = "text";
  input.value = currentValue;

  const saveBtn = document.createElement("button");
  saveBtn.textContent = "Save";
  saveBtn.addEventListener("click", () => {
    callback(input.value);
    box.remove();
  });

  const cancelBtn = document.createElement("button");
  cancelBtn.textContent = "Cancel";
  cancelBtn.addEventListener("click", () => {
    box.remove();
  });

  box.appendChild(heading);
  box.appendChild(input);
  box.appendChild(saveBtn);
  box.appendChild(cancelBtn);

  document.body.appendChild(box);
  input.focus();
}

function openConfirmBox(message, callback) {
  const box = document.createElement("div");
  box.className = "modalBox";

  const msg = document.createElement("p");
  msg.textContent = message;

  const yesBtn = document.createElement("button");
  yesBtn.textContent = "Yes";
  yesBtn.addEventListener("click", () => {
    callback();
    box.remove();
  });

  const noBtn = document.createElement("button");
  noBtn.textContent = "No";
  noBtn.addEventListener("click", () => {
    box.remove();
  });

  box.appendChild(msg);
  box.appendChild(yesBtn);
  box.appendChild(noBtn);

  document.body.appendChild(box);
}

// #endregion

//#region Light/Dark mode

// Hent body
const body = document.body;

// Check om brugeren allerede har valgt et tema
let theme = localStorage.getItem("theme") || "light";
body.classList.add(theme);

// Font Awesome icon
const themeIcon = document.getElementById("themeIcon");

// Initial icon baseret på gemt tema
themeIcon.className = theme === "light" ? "fa-solid fa-sun" : "fa-solid fa-moon";

// Toggle funktion
toggleThemeButton.addEventListener("click", () => {
  if (body.classList.contains("light")) {
    body.classList.remove("light");
    body.classList.add("dark");
    localStorage.setItem("theme", "dark");
    themeIcon.className = "fa-solid fa-moon";
  } else {
    body.classList.remove("dark");
    body.classList.add("light");
    localStorage.setItem("theme", "light");
    themeIcon.className = "fa-solid fa-sun";
  }
});

//#endregion

// #region model code

// Simulate reading data from a database or API
function readData() {
  const storedData = localStorage.getItem("ToDoApp_V1");
  return JSON.parse(storedData);
}

// Simulate saving data to a database or API
function saveData(data) {
  localStorage.setItem("ToDoApp_V1", JSON.stringify(data));
}

// #endregion
