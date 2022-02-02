// SizeBar Processing
var flag = true;
var barButton = document.querySelector('.bar');
var sizeBar = document.querySelector('.sizebar');
barButton.onclick = function(e) {
    if(sizeBar.style.opacity == 0) {
        sizeBar.style.opacity = 1;
        sizeBar.style.transform = "translateX(0)";
    }
    else {
        sizeBar.style.opacity = 0;
        sizeBar.style.transform = "translateX(-100%)";
    }
};
var sizebarItems = document.querySelectorAll('.nav-link');
sizebarItems.forEach(function(sizebarItem) {
    sizebarItem.onclick = function() {
        var activeItem = document.querySelector('.active');
        activeItem.classList.remove('active'); 
        activeItem.classList.add('link-dark');
        sizebarItem.classList.toggle('active');
        sizebarItem.classList.toggle('link-dark');
    }  
})
// KeyBoard Input
var keyboardInput = document.getElementById('user__input');
keyboardInput.addEventListener('input', function() {
    if(keyboardInput.value.length > 40) {
        keyboardInput.parentNode.children[1].style.right = "-25px";        
    }
    else {
        keyboardInput.parentNode.children[1].style.right = "8px"; 
    }
});
keyboardInput.addEventListener('keyup', function(e){
    e.preventDefault();
    if(e.keyCode == 13) {
        let val = keyboardInput.value.trim();
        if(val) {
            addDatabase(val, false);
            insertElement(val, false);
        }
        else alert('Your input is empty. Please try again!');
        keyboardInput.value = '';
    }
});
//Button Input
var buttonInput = document.querySelector('.adder span');
buttonInput.addEventListener('click', function(e){
    e.preventDefault();
    let val = keyboardInput.value.trim();
    if(val) {
        addDatabase(val, false);
        insertElement(val, false);
    }
    else alert('Your input is empty. Please try again!');
    keyboardInput.value = '';
});
//Render browser
var todoBlock = document.getElementById('todoBlock');
async function renderBrowser() {
    var todoApi = 'https://todify-api.herokuapp.com/tasks/';
    fetch(todoApi).then(response => response.json())
    .then(function(todos) {
        var htmls = todos.map(function(todo) {
            if(todo.completed) {
                return `<li class="todo__item draggable completed" draggable="true" id="${todo._id}">
                <div class="todo__text">
                    <p>${todo.name}</p>
                    <input type="checkbox" checked>
                </div>
                <i class="fa fa-trash-alt deletedItem"></i>
            </li>`;
            }
            else {
                return `<li class="todo__item draggable" draggable="true" id="${todo._id}">
                    <div class="todo__text">
                        <p>${todo.name}</p>
                        <input type="checkbox">
                    </div>
                    <i class="fa fa-trash-alt deletedItem"></i>
                </li>`;
            }
        })
        todoBlock.innerHTML = htmls.join('');
        var todoItems = todoBlock.querySelectorAll('.todo__item');
        todoItems.forEach(function(todo) {
            todo.addEventListener('click', function() {
                this.classList.toggle('completed');
                var currentStatus = this.querySelector('.todo__text input').checked;
                this.querySelector('.todo__text input').checked = !currentStatus;
                changeDatabase(todo.id, currentStatus);
            });
            todo.querySelector('.deletedItem').addEventListener('click', function() {
                deleteDatabase(todo.id);
                this.parentElement.remove();
            });
            // Drag and drop
            todo.addEventListener('dragstart', () => {
                todo.classList.add('dragging');
            })
            todo.addEventListener('dragend', () => {
                todo.classList.remove('dragging');
            })
        });
        todoBlock.addEventListener('dragover', e => {
            e.preventDefault()
            const afterElement = getDragAfterElement(todoBlock, e.clientY)
            const draggable = document.querySelector('.dragging')
            if (afterElement == null) {
                todoBlock.appendChild(draggable)
            } 
            else {
                todoBlock.insertBefore(draggable, afterElement)
            }
        })
        function getDragAfterElement(container, y) {
            const draggableElements = [...container.querySelectorAll('.draggable:not(.dragging)')];
            return draggableElements.reduce((closest, child) => {
              const box = child.getBoundingClientRect();
              const offset = y - box.top - box.height / 2
              if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
              } 
              else {
                return closest;
              }
            }, { offset: Number.NEGATIVE_INFINITY }).element
        }
        // Interact with sizebar
        var todoContent = document.querySelector('.todo__content');
        var defaultContent = todoContent.innerHTML;
        var homeMode = document.querySelector('#all');
        var activeMode = document.querySelector('#active');
        var completedMode = document.querySelector('#completed');
        homeMode.addEventListener('click', () => {
            todoContent.innerHTML = defaultContent;
            var todoBlock = todoContent.querySelector('#todoBlock');
            var todoItems = todoBlock.querySelectorAll('.todo__item');
            todoItems.forEach(function(todo) {
                todo.addEventListener('click', function() {
                    this.classList.toggle('completed');
                    var currentStatus = this.querySelector('.todo__text input').checked;
                    this.querySelector('.todo__text input').checked = !currentStatus;
                    changeDatabase(todo.id, currentStatus);
                });
                todo.querySelector('.deletedItem').addEventListener('click', function() {
                    deleteDatabase(todo.id);
                    this.parentElement.remove();
                });
                // Drag and drop
                todo.addEventListener('dragstart', () => {
                    todo.classList.add('dragging');
                })
                todo.addEventListener('dragend', () => {
                    todo.classList.remove('dragging');
                })
            });
            todoBlock.addEventListener('dragover', e => {
                e.preventDefault()
                const afterElement = getDragAfterElement(todoBlock, e.clientY)
                const draggable = document.querySelector('.dragging')
                if (afterElement == null) {
                    todoBlock.appendChild(draggable)
                } 
                else {
                    todoBlock.insertBefore(draggable, afterElement)
                }
            })
            function getDragAfterElement(container, y) {
                const draggableElements = [...container.querySelectorAll('.draggable:not(.dragging)')];
                return draggableElements.reduce((closest, child) => {
                const box = child.getBoundingClientRect();
                const offset = y - box.top - box.height / 2
                if (offset < 0 && offset > closest.offset) {
                    return { offset: offset, element: child };
                } 
                else {
                    return closest;
                }
                }, { offset: Number.NEGATIVE_INFINITY }).element;
            }
        });
        activeMode.addEventListener('click', () => {
            var todoBlock = todoContent.querySelector('#todoBlock');
            var activeElement = todoBlock.querySelectorAll('.todo__item:not(.completed)');
            var newBlock = document.createElement('ul');
            newBlock.id = 'todoBlock';
            newBlock.innerHTML = '<h3>ACTIVE</h3>';
            activeElement.forEach(function(active) {
                var newElement = document.createElement('li');
                newElement.className = 'todo__item draggable';
                newElement.id = `${active.id}`;
                newElement.draggable = true;
                newElement.innerHTML = `
                <div class="todo__text">
                    <p>${active.innerText}</p>
                    <input type="checkbox">
                </div>
                <i class="fa fa-trash-alt deletedItem"></i>`;
                newBlock.appendChild(newElement);
            })
            todoContent.innerHTML = newBlock.outerHTML;
        });
        completedMode.addEventListener('click', () => {
            var todoBlock = todoContent.querySelector('#todoBlock');
            var completedElement = todoBlock.querySelectorAll('.completed');
            var newBlock = document.createElement('ul');
            newBlock.id = 'todoBlock';
            newBlock.innerHTML = '<h3>COMPLETED</h3>';
            completedElement.forEach(function(completed) {
                var newElement = document.createElement('li');
                newElement.className = 'todo__item draggable completed';
                newElement.id = `${completed.id}`;
                newElement.draggable = true;
                newElement.innerHTML = `
                <div class="todo__text">
                    <p>${completed.innerText}</p>
                    <input type="checkbox" checked>
                </div>
                <i class="fa fa-trash-alt deletedItem"></i>`;
                newBlock.appendChild(newElement);
            })
            todoContent.innerHTML = newBlock.outerHTML;
        });
    });
}
function insertElement(val, status) {
    var todo = document.createElement('li');
    todo.className = 'todo__item draggable';
    todo.draggable = true;
    todo.innerHTML = `<div class="todo__text">
        <p>${val}</p>
        <input type="checkbox" checked>
    </div>
    <i class="fa fa-trash-alt deletedItem"></i>`;
    todo.querySelector('input').checked = status;
    todo.addEventListener('click', function() {
        this.classList.toggle('completed');
        var currentStatus = this.querySelector('.todo__text input').checked;
        this.querySelector('.todo__text input').checked = !currentStatus;
    });
    todo.querySelector('.deletedItem').addEventListener('click', function() {
        this.parentElement.remove();
    });
    todoBlock.appendChild(todo);
}
async function addDatabase(val, status) {
    var todoApi = 'https://todify-api.herokuapp.com/tasks/';
    let options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify({
            name: val,
            completed : status,
        })
    };
    await fetch(todoApi, options);
    renderBrowser();
}
async function deleteDatabase(id) {
    var todoApi = 'https://todify-api.herokuapp.com/tasks/';
    let options = {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
    };
    await fetch(todoApi + id, options);
}
async function changeDatabase(id, status) {
    var todoApi = 'https://todify-api.herokuapp.com/tasks/';
    let options = {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify({
            completed : !status,
        }),
    }
    await fetch(todoApi + id, options);
    renderBrowser();
}
//Clear All
async function clearDataBase(todos) {
    if(todos.length == 0) return;
    for(var i = 0; i < todos.length; i++) {
        await deleteDatabase(todos[i]._id);
    }
}
var clearAll = document.querySelector('.todo__content i');
clearAll.onclick = async function() {
    var todoApi = 'https://todify-api.herokuapp.com/tasks/';
    fetch(todoApi).then(response => response.json())
    .then(function(todos) { 
        var accepted = confirm("Would you like to clear all!");
        if(accepted) clearDataBase(todos);
        for(var i = 0; i < todos.length; i++) { 
            todoBlock.removeChild(todoBlock.children[`${todos[i]._id}`]);
        }
    })
}
renderBrowser();