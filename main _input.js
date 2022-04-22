/*====== Send data ======*/
const sendData = async (url, data) => {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-type": "application/json;charset=utf-8",
        "Access-Control-Allow-Origin": "*",
      },
      body: data,
    });
    
    if (!response.ok) {
      const message = "Error with Status Code: " + response.status;
      throw new Error(message);
    }

    return await response.json();
  } catch (error) {
    console.log(error);
  }
};

/*====== Get data ======*/
const getData = async (url) => {
  try {
    const response = await fetch(url, {
      method: "GET",
      header: {
        Accept: "application/json",
        "Content-type": "application/json;charset=utf-8",
        "x-access-token": "token-value",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "X-Requested-With",
      },
    });

    if (!response.ok) {
      const message = "Error with Status Code: " + response.status;
      throw new Error(message);
    }

    return await response.json();
  } catch (error) {
    console.log(error);
  }

};

/*====== Delete task ======*/
const deleteData = async (url) => {
  try {
    const response = await fetch(url, {
      method: "DELETE",
      header: {
        Accept: "application/json",
        "Content-type": "application/json;charset=utf-8",
        "x-access-token": "token-value",
        "Access-Control-Allow-Origin": "*",
      },
    });

    if (!response.ok) {
      const message = "Error with Status Code: " + response.status;
      throw new Error(message);
    }

    return await response.json();
  } catch (error) {
    console.log(error);
  }
};

/*====== updateData ======*/
const updataData = async (url, data) => {
  try {
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-type": "application/json;charset=utf-8",
        "x-access-token": "token-value",
        "Access-Control-Allow-Origin": "*",
      },
      body: data,
    });

    if (!response.ok) {
      const message = "Error with Status Code: " + response.status;
      throw new Error(message);
    }

    return await response.json();
  } catch (error) {
    console.log(error);
  }
};

/*====== HTML elements ======*/
const todoList = document.querySelector("#todo-list");
const todoForm = document.querySelector("#todo-form");
let todoInput = document.querySelector("#todo-input");
let taskText = null;
const todoBut_t = document.querySelector(".but_t");
const todoClearForm = document.querySelector('#ClearFormButton');
let allTasks = [];

 /*====== Fucntion for edit button  ======*/
 const editButtonFunc = async (task, newTask, editButton) => {
   if (task.isCheck === false) {
    if (newTask.readOnly === true) {
      newTask.removeAttribute("readonly");
      editButton.focus();
    } else {
      newTask.setAttribute("readonly", "readonly");
       
      const editTask = {
        task: newTask.value,
        isCheck: task.isCheck,
        _id: task._id,
      }
    
      await updataData(`http://localhost:8000/putAlltasks`, JSON.stringify(editTask));
      renderTasks(); 
    }
   }
}

/*====== Fucntion for check button  ======*/
const checkButtonFunc = async (task) => {
  task.isCheck = !task.isCheck;

  const checkTask = {
    task: task.task,
    isCheck: task.isCheck,
    _id: task._id,
  };

  await updataData(`http://localhost:8000/putAlltasks`, JSON.stringify(checkTask));
  renderTasks();
}

/*====== Fucntion for delete button  ======*/
const deleteButtonFunc = async (id) => {
  await deleteData(`http://localhost:8000/deleteOneTask?id=${id}`);
  renderTasks();
}

/*====== Element rendering function  ======*/
const renderTasks = async () => {
  while(todoList.firstChild) {
    todoList.removeChild(todoList.firstChild);
  };

  allTasks = await getData("http://localhost:8000/getAllTasks");
  allTasks.map((task, index) => {
    const taskElement = document.createElement("div");
    taskElement.classList.add("task");
   
    const newTask = document.createElement("input");
    newTask.classList.add("background-color_list");
    newTask.classList.add("output-text");
    newTask.type = "text";
    newTask.value = task.task;
    newTask.setAttribute("readonly", "readonly");
    
    taskElement.appendChild(newTask);
    
    const divButton = document.createElement("div");
    divButton.classList.add("button-div-class");
    
    // Edit button
    const editButton = document.createElement("button");
      
    divButton.appendChild(editButton);
    editButton.setAttribute("role", "button");
    editButton.innerText = "Edit";
    editButton.classList.add("editButton");
    editButton.innerHTML = '<img src = "assets/images/edit.png">';
    editButton.onclick = () => editButtonFunc(task, newTask, editButton);
  
    // Check button
    const checkButton = document.createElement("button");
    divButton.appendChild(checkButton);
    checkButton.setAttribute("role", "button");
    checkButton.innerText = "Check";
    checkButton.classList.add("checkButton");
    checkButton.innerHTML = '<img src = "assets/images/checked.png">';
    checkButton.onclick = () => checkButtonFunc(task);

    if (task.isCheck) {
      newTask.classList.add("checktext");
      newTask.classList.add("background-text");
    } else {
      newTask.classList.remove("checktext");
      newTask.classList.remove("background-text");
    }
  
    // Delete button
    const deleteButton = document.createElement("button");
    divButton.appendChild(deleteButton);
    deleteButton.setAttribute("role", "button");
    deleteButton.innerText = "Delete";
    deleteButton.classList.add("deleteButton");
    deleteButton.innerHTML = '<img src = "assets/images/delete.png">';
    deleteButton.onclick = () => deleteButtonFunc(task._id);
  
    taskElement.appendChild(divButton);
  
    // Add on html
    // if (!taskText.trim()) {
    //   alert("Please fill out the task.");
    //   } else {
    //   todoList.appendChild(taskElement);
    // }

    todoList.appendChild(taskElement);
    todoInput.focus();
  });
}

const clearForm = async () => {
  await deleteData(`http://localhost:8000/deleteAll`);
  todoInput.focus();
  renderTasks();
};

window.onload = async () => {
  const formHadler = async (event) => {
    taskText = todoInput.value;
    event.preventDefault();    

    // Send task
    const sendTask = {
      task: taskText,
      isCheck: false,
    };

    // Send on backend 
    sendData("http://localhost:8000/createTask", JSON.stringify(sendTask));
    todoInput.value = "";
    await renderTasks();
  };

  todoClearForm.onclick = () => clearForm();
  todoBut_t.addEventListener("click", formHadler);
  await renderTasks();
};
