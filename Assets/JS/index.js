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
  const newButton = document.getElementById("newListButton");
  newButton.addEventListener("click", newCallback);
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
  console.log(appState);

  switch (appState) {
    case "listView":
      NewListCreateView();
      break;
    default:
      console.error(`${appState} is not a valid state`);
      break;
  }
}

// #endregion

// #region functions

// ------------------------------ New List Create View ------------------------------
function NewListCreateView() {
  //Content element
  const content = document.getElementById("content");
  //clear content
  content.innerHTML = "";
  //create section
  const section = document.createElement("section");
  //create label
  const label = document.createElement("label");
  label.textContent = "Name: ";
  label.setAttribute("for", "listName");
  //create input
  const input = document.createElement("input");
  input.type = "text";
  input.id = "listName";
  input.value = "default name";
  //Create ok button
  const okButton = document.createElement("button");
  okButton.textContent = "OK";
  okButton.addEventListener("click", () => {
    console.log(`OK clicked, new list name: ${input.value}`);
    listView();
  });
  //Create cancel button
  const cancelButton = document.createElement("button");
  cancelButton.textContent = "Cancel";
  cancelButton.addEventListener("click", () => {
    console.log("Cancel clicked");
    listView();
  });
  //Append elements
  section.appendChild(label);
  section.appendChild(input);
  section.appendChild(okButton);
  section.appendChild(cancelButton);
  //append section to content
  content.appendChild(section);
}
// -------------------- New Item Create View ------------------------------
function NewItemCreateView() {
  //Content element
  const content = document.getElementById("content");
  //clear content
  content.innerHTML = "";
  //create section
  const section = document.createElement("section");
  //Create label
  const label = document.createElement("label");
  label.textContent = "Name: ";
  label.setAttribute("for", "itemName");
  //Create input
  const input = document.createElement("input");
  input.type = "text";
  input.id = "listName";
  input.value = "default name";
  //Create ok button
  const okButton = document.createElement("button");
  okButton.textContent = "OK";
  okButton.addEventListener("click", () => {
    console.log("OK clicked, list name:", input.value);
    listItemView();
  });
  // Create Cancel button
  const cancelButton = document.createElement("button");
  cancelButton.textContent = "Cancel";
  cancelButton.addEventListener("click", () => {
    console.log("Cancel clicked");
    listItemView();
  });
  // Append elements
  section.appendChild(label);
  section.appendChild(input);
  section.appendChild(okButton);
  section.appendChild(cancelButton);
  // Append section to content
  content.appendChild(section);
}

function listView() {
  mainContent.innerHTML = "";
  appState = "listView";
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
  const title = document.createElement("h2");
  title.textContent = list.name;
  mainContent.appendChild(title);

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
