const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const categorySelect = document.getElementById("categorySelect");
const filterSelect = document.getElementById("filterSelect"); 
const searchInput = document.getElementById("searchInput");
const taskList = document.getElementById("taskList");

const totalCount = document.getElementById("totalCount");
const completedCount = document.getElementById("completedCount");
const pendingCount = document.getElementById("pendingCount");

let tasks = [];

function addTask(event) {
    event.preventDefault();
    const newTask = {
        id: Date.now(),
        text: taskInput.value,
        category: categorySelect.value,
        completed: false,
        isEditing: false
    };
    tasks.push(newTask);
    taskInput.value = '';
    renderTasks();
}

function handleTaskClick(event) {
    const target = event.target;
    const li = target.closest('li');
    if (!li) return;
    const taskId = Number(li.dataset.id);

    if (target.classList.contains('deleteBtn')) {
        tasks = tasks.filter(t => t.id !== taskId);
    } 
    else if (target.classList.contains('editBtn')) {
        tasks = tasks.map(t => t.id === taskId ? { ...t, isEditing: true } : t);
    }
    else if (target.classList.contains('saveBtn')) {
        const inputField = li.querySelector('.edit-input');
        tasks = tasks.map(t => t.id === taskId ? { ...t, text: inputField.value, isEditing: false } : t);
    }
    else if (target.classList.contains('task-text')) {
        tasks = tasks.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t);
    }
    renderTasks();
}

function renderTasks() {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const pending = total - completed;

    totalCount.textContent = total;
    completedCount.textContent = completed;
    pendingCount.textContent = pending;

    taskList.innerHTML = '';
    
    const currentFilter = filterSelect.value;
    const searchText = searchInput.value.toLowerCase();

    const filteredTasks = tasks.filter(task => {
        const matchesCategory = currentFilter === "All" || task.category === currentFilter;
        const matchesSearch = task.text.toLowerCase().includes(searchText);
        return matchesCategory && matchesSearch;
    });

    filteredTasks.forEach(task => {
        const li = document.createElement('li');
        li.dataset.id = task.id;
        if (task.completed) li.classList.add('completed');

        if (task.isEditing) {
            li.innerHTML = `
                <input type="text" class="edit-input" value="${task.text}">
                <button class="saveBtn">Save</button>
            `;
            setTimeout(() => {
                const input = li.querySelector('.edit-input');
                if (input) input.focus();
            }, 1);
        } else {
            li.innerHTML = `
                <div class="task-content">
                    <span class="category-badge badge-${task.category.toLowerCase()}">${task.category}</span>
                    <span class="task-text">${task.text}</span>
                </div>
                <div class="actions">
                    <button class="editBtn">Edit</button>
                    <button class="deleteBtn">Delete</button>
                </div>
            `;
        }
        taskList.appendChild(li);
    });
}

taskForm.addEventListener('submit', addTask);
taskList.addEventListener('click', handleTaskClick);
filterSelect.addEventListener('change', renderTasks);
searchInput.addEventListener('input', renderTasks);