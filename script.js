const API_URL = "https://jsonplaceholder.typicode.com/todos";

let todos = [];
let currentPage = 1;
const todosPerPage = 10;

const todoList = document.getElementById("todoList");
const loading = document.getElementById("loading");
const searchInput = document.getElementById("searchInput");
const fromDate = document.getElementById("fromDate");
const toDate = document.getElementById("toDate");

const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

async function fetchTodos() {
  try {
    loading.style.display = "block";
    const res = await fetch(API_URL);
    const data = await res.json();
    todos = data.slice(0, 100).map(todo => ({
      ...todo,
      date: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString().split("T")[0] 
    }));
    renderTodos();
  } catch (err) {
    alert("Failed to fetch todos: " + err.message);
  } finally {
    loading.style.display = "none";
  }
}

function renderTodos() {
  let filtered = [...todos];

  const search = searchInput.value.toLowerCase();
  if (search) {
    filtered = filtered.filter(todo => todo.title.toLowerCase().includes(search));
  }

  if (fromDate.value) {
    filtered = filtered.filter(todo => todo.date >= fromDate.value);
  }

  if (toDate.value) {
    filtered = filtered.filter(todo => todo.date <= toDate.value);
  }

  const start = (currentPage - 1) * todosPerPage;
  const end = start + todosPerPage;
  const pageItems = filtered.slice(start, end);

  todoList.innerHTML = "";
  pageItems.forEach(todo => {
    const li = document.createElement("li");
    li.className = "list-group-item d-flex justify-content-between";
    li.innerHTML = `
      <div>
        <strong>${todo.title}</strong><br />
        <small>${todo.date}</small>
      </div>
      <span class="badge bg-${todo.completed ? 'success' : 'warning'}">
        ${todo.completed ? "Completed" : "Pending"}
      </span>
    `;
    todoList.appendChild(li);
  });

  prevBtn.disabled = currentPage === 1;
  nextBtn.disabled = end >= filtered.length;
}

document.getElementById("todoForm").addEventListener("submit", async function (e) {
  e.preventDefault();
  const title = document.getElementById("todoTitle").value;
  const date = document.getElementById("todoDate").value;

  const newTodo = {
    id: Date.now(),
    title,
    completed: false,
    date,
    userId: 1
  };

  todos.unshift(newTodo);
  document.getElementById("todoForm").reset();
  currentPage = 1;
  renderTodos();
});

searchInput.addEventListener("input", () => {
  currentPage = 1;
  renderTodos();
});
fromDate.addEventListener("change", () => {
  currentPage = 1;
  renderTodos();
});
toDate.addEventListener("change", () => {
  currentPage = 1;
  renderTodos();
});

prevBtn.addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    renderTodos();
  }
});
nextBtn.addEventListener("click", () => {
  currentPage++;
  renderTodos();
});

fetchTodos();
