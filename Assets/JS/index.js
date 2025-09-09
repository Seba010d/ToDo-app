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

// Setup static event listeners and elements (model code)
function setupStatics() {
  console.log("setupStatics called");
  newListButton.addEventListener("click", newCallback);
  listView();
}

// #endregion

// #region Callback

function listClickCallback(action, index) {
  console.log(action, index);

  activeList = index;

  switch (action) {
    case "showList":
      console.log(`you chose ${action} ${index}`);
      listItemView();
      break;
    case "editList":
      console.log(`you chose ${action} ${index}`);
      break;
    case "deleteList":
      console.log(`you chose ${action} ${index}`);
      break;
    default:
      console.error(`${action} ${index} is not valid`);
      break;
  }
}

function newCallback() {
  console.log("newCallback called");
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

//Viser input felt for at lave en ny liste
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

//får texten ind i input feltet og opretter en ny liste
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

function listView() {
  mainContent.innerHTML = "";
  appState = "listView";

  // Vis "new"-knappen
  newListButton.style.display = "block";

  currentData.lists.forEach((list, index) => {
    const listElement = document.createElement("div");
    listElement.className = "listview";
    listElement.innerHTML = `<h2 onclick="listClickCallback('showList',${index})">${list.name}</h2>
       <button onclick="listClickCallback('editList',${index})">edit</button>
       <button onclick="listClickCallback('deleteList',${index})">delete</button>`;
    mainContent.appendChild(listElement);
  });
}

function listItemView() {
  console.log("List item view for index:", activeList);
  const list = currentData.lists[activeList];
  if (!list) {
    console.error("List not found:", activeList);
    return;
  }
  appState = "itemView";
  mainContent.innerHTML = "";

  // Skjul "new"-knappen
  newListButton.style.display = "none";

  const title = document.createElement("h2");
  title.textContent = list.name;
  mainContent.appendChild(title);

  // 🔹 Input + Add-knap til nye items (altid vist)
  const inputContainer = document.createElement("div");
  const input = document.createElement("input");
  input.type = "text";
  input.placeholder = "New item";

  const addButton = document.createElement("button");
  addButton.textContent = "Add";
  addButton.addEventListener("click", () => {
    handleNewItem(input.value);
    input.value = ""; // ryd feltet efter tilføjelse
  });

  inputContainer.appendChild(input);
  inputContainer.appendChild(addButton);
  mainContent.appendChild(inputContainer);

  // 🔹 Items vises under inputfeltet
  const itemsContainer = document.createElement("div");
  list.items.forEach((item, itemIndex) => {
    const itemElement = document.createElement("div");
    itemElement.innerHTML = `<span>${item.name}</span>
        <button onclick="itemClickCallback('editItem',${itemIndex})">edit</button>
        <button onclick="itemClickCallback('deleteItem',${itemIndex})">delete</button>`;
    itemsContainer.appendChild(itemElement);
  });
  mainContent.appendChild(itemsContainer);

  const backButton = document.createElement("button");
  backButton.textContent = "Back";
  backButton.addEventListener("click", () => {
    listView();
  });
  mainContent.appendChild(backButton);
}

// 🔹 Funktion til at tilføje nyt item
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
