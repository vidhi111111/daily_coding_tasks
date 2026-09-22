const API_URL = "http://localhost:3000/employees";

let employees = [];
let filteredEmployees = [];

let currentPage = 1;
let itemsPerPage = 10;

let sortField = "name";
let sortDirection = "asc";

let employeeToDelete = null;

async function getEmployees() {
    const response = await fetch(API_URL);

    if (!response.ok) {
        throw new Error("Failed to fetch employees");
    }

    return response.json();
}

async function getEmployeeById(id) {
    const response = await fetch(`${API_URL}/${id}`);

    if (!response.ok) {
        throw new Error("Employee not found");
    }

    return response.json();
}

async function createEmployee(employee) {
    const response = await fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(employee)
    });

    if (!response.ok) {
        throw new Error("Failed to create employee");
    }

    return response.json();
}

async function updateEmployee(id, employee) {
    const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(employee)
    });

    if (!response.ok) {
        throw new Error("Failed to update employee");
    }

    return response.json();
}

async function deleteEmployee(id) {
    const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE"
    });

    if (!response.ok) {
        throw new Error("Failed to delete employee");
    }

    return response.json();
}

async function loadEmployees() {
    showLoading();

    try {
        employees = await getEmployees();
        currentPage = 1;
        updateDashboard();
        applyFilters();
    } catch (error) {
        console.error(error);
        showError();
    }
}

function updateDashboard() {
    const total = employees.length;

    const activeEmployees = employees.filter(
        employee => employee.status === "Active"
    ).length;

    let activeProjects = 0;

    employees.forEach(employee => {
        employee.projects.forEach(project => {
            if (project.status === "Active") {
                activeProjects++;
            }
        });
    });

    const unassignedEmployees = employees.filter(
        employee => employee.projects.length === 0
    ).length;

    document.getElementById("totalEmployees").textContent = total;
    document.getElementById("activeEmployees").textContent = activeEmployees;
    document.getElementById("activeProjects").textContent = activeProjects;
    document.getElementById("unassignedEmployees").textContent = unassignedEmployees;
}

function applyFilters() {
    const searchText = document.getElementById("searchInput").value
        .toLowerCase()
        .trim();

    const department = document.getElementById("departmentFilter").value;
    const status = document.getElementById("statusFilter").value;
    const projectStatus = document.getElementById("projectStatusFilter").value;

    filteredEmployees = employees.filter(employee => {
        const matchesSearch =
            employee.name.toLowerCase().includes(searchText) ||
            employee.email.toLowerCase().includes(searchText);

        const matchesDepartment =
            department === "All" ||
            employee.department === department;

        const matchesStatus =
            status === "All" ||
            employee.status === status;

        const matchesProjectStatus =
            projectStatus === "All" ||
            employee.projects.some(
                project => project.status === projectStatus
            );

        return (
            matchesSearch &&
            matchesDepartment &&
            matchesStatus &&
            matchesProjectStatus
        );
    });

    sortField = document.getElementById("sortField").value;

    sortEmployees();

    currentPage = 1;

    displayEmployees();
}

function sortEmployees() {
    filteredEmployees.sort((a, b) => {
        let valueA;
        let valueB;

        if (sortField === "name") {
            valueA = a.name.toLowerCase();
            valueB = b.name.toLowerCase();
        } else if (sortField === "projects") {
            valueA = a.projects.length;
            valueB = b.projects.length;
        } else if (sortField === "joiningDate") {
            valueA = new Date(a.joiningDate);
            valueB = new Date(b.joiningDate);
        } else if (sortField === "status") {
            valueA = a.status;
            valueB = b.status;
        }

        if (valueA < valueB) {
            return sortDirection === "asc" ? -1 : 1;
        }

        if (valueA > valueB) {
            return sortDirection === "asc" ? 1 : -1;
        }

        return 0;
    });
}

function changeSortOrder() {
    sortDirection = sortDirection === "asc" ? "desc" : "asc";

    const button = document.getElementById("sortOrder");

    button.textContent =
        sortDirection === "asc"
            ? "↑ Ascending"
            : "↓ Descending";

    sortEmployees();
    displayEmployees();
}

function displayEmployees() {
    const tableBody = document.getElementById("employeeTableBody");

    tableBody.innerHTML = "";

    if (filteredEmployees.length === 0) {
        showEmpty();
        document.getElementById("pageNumbers").innerHTML = "";
        return;
    }

    hideMessages();

    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;

    const pageEmployees = filteredEmployees.slice(start, end);

    pageEmployees.forEach(employee => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${employee.name}</td>
            <td>${employee.email}</td>
            <td>${employee.department}</td>
            <td>${employee.projects.length}</td>
            <td>${employee.joiningDate}</td>
            <td>
                <span class="status ${employee.status.toLowerCase()}">
                    ${employee.status}
                </span>
            </td>
            <td>
                <div class="action-buttons">
                    <button class="view-btn">View</button>
                    <button class="edit-btn">Edit</button>
                    <button class="delete-btn">Delete</button>
                </div>
            </td>
        `;

        row.querySelector(".view-btn").addEventListener("click", function () {
            viewEmployee(employee.id);
        });

        row.querySelector(".edit-btn").addEventListener("click", function () {
            openEditModal(employee.id);
        });

        row.querySelector(".delete-btn").addEventListener("click", function () {
            openDeleteModal(employee.id);
        });

        tableBody.appendChild(row);
    });

    createPagination();
}

function createPagination() {
    const pageNumbers = document.getElementById("pageNumbers");

    pageNumbers.innerHTML = "";

    const totalPages = Math.ceil(
        filteredEmployees.length / itemsPerPage
    );

    for (let i = 1; i <= totalPages; i++) {
        const button = document.createElement("button");

        button.textContent = i;
        button.classList.add("page-number");

        if (i === currentPage) {
            button.classList.add("active");
        }

        button.onclick = function () {
            currentPage = i;
            displayEmployees();
        };

        pageNumbers.appendChild(button);
    }
}

function previousPage() {
    if (currentPage > 1) {
        currentPage--;
        displayEmployees();
    }
}

function nextPage() {
    const totalPages = Math.ceil(
        filteredEmployees.length / itemsPerPage
    );

    if (currentPage < totalPages) {
        currentPage++;
        displayEmployees();
    }
}

function changeItemsPerPage() {
    itemsPerPage = Number(
        document.getElementById("itemsPerPage").value
    );

    currentPage = 1;

    displayEmployees();
}

async function viewEmployee(id) {
    try {
        const employee = await getEmployeeById(id);

        const projectHTML =
            employee.projects.length > 0
                ? employee.projects.map(project => `
                    <div class="project-item">
                        <span>${project.name}</span>
                        <span>${project.status}</span>
                    </div>
                `).join("")
                : "<p>No projects assigned.</p>";

        document.getElementById("employeeDetails").innerHTML = `
            <div class="detail-item">
                <strong>Name</strong>
                ${employee.name}
            </div>

            <div class="detail-item">
                <strong>Email</strong>
                ${employee.email}
            </div>

            <div class="detail-item">
                <strong>Mobile</strong>
                ${employee.mobile}
            </div>

            <div class="detail-item">
                <strong>Department</strong>
                ${employee.department}
            </div>

            <div class="detail-item">
                <strong>Joining Date</strong>
                ${formatDate(employee.joiningDate)}
            </div>

            <div class="detail-item">
                <strong>Status</strong>
                ${employee.status}
            </div>

            <div class="detail-item">
                <strong>Projects</strong>
                <div class="project-list">
                    ${projectHTML}
                </div>
            </div>
        `;

        document.getElementById("detailsModal").style.display = "flex";
    } catch (error) {
        alert("Unable to load employee details.");
    }
}

function openAddModal() {
    document.getElementById("formTitle").textContent = "Add Employee";
    document.getElementById("employeeForm").reset();
    document.getElementById("employeeId").value = "";
    clearErrors();

    document.getElementById("employeeModal").style.display = "flex";
}

async function openEditModal(id) {
    try {
        const employee = await getEmployeeById(id);

        document.getElementById("formTitle").textContent = "Edit Employee";
        document.getElementById("employeeId").value = employee.id;
        document.getElementById("name").value = employee.name;
        document.getElementById("email").value = employee.email;
        document.getElementById("mobile").value = employee.mobile;
        document.getElementById("department").value = employee.department;
        document.getElementById("joiningDate").value = employee.joiningDate;
        document.getElementById("status").value = employee.status;

        clearErrors();

        document.getElementById("employeeModal").style.display = "flex";
    } catch (error) {
        alert("Unable to load employee.");
    }
}

document.getElementById("employeeForm").addEventListener(
    "submit",
    async function (event) {
        event.preventDefault();

        if (!validateForm()) {
            return;
        }

        const employeeId =
            document.getElementById("employeeId").value;

        const employee = {
            name: document.getElementById("name").value.trim(),
            email: document.getElementById("email").value.trim(),
            mobile: document.getElementById("mobile").value.trim(),
            department: document.getElementById("department").value,
            joiningDate: document.getElementById("joiningDate").value,
            status: document.getElementById("status").value
        };

        try {
            if (employeeId) {
                const oldEmployee =
                    await getEmployeeById(employeeId);

                employee.id = Number(employeeId);
                employee.projects = oldEmployee.projects;

                await updateEmployee(employeeId, employee);
            } else {
                employee.projects = [];
                await createEmployee(employee);
            }

            closeModal("employeeModal");
            await loadEmployees();
        } catch (error) {
            alert("Unable to save employee.");
        }
    }
);

function validateForm() {
    clearErrors();

    let valid = true;

    const name =
        document.getElementById("name").value.trim();

    const email =
        document.getElementById("email").value.trim();

    const mobile =
        document.getElementById("mobile").value.trim();

    const department =
        document.getElementById("department").value;

    const joiningDate =
        document.getElementById("joiningDate").value;

    const status =
        document.getElementById("status").value;

    if (name === "") {
        showFieldError(
            "nameError",
            "Name is required."
        );

        valid = false;
    }

    const emailPattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
        showFieldError(
            "emailError",
            "Enter a valid email."
        );

        valid = false;
    }

    const mobilePattern =
        /^[0-9]{10}$/;

    if (!mobilePattern.test(mobile)) {
        showFieldError(
            "mobileError",
            "Mobile number must contain 10 digits."
        );

        valid = false;
    }

    if (department === "") {
        showFieldError(
            "departmentError",
            "Select a department."
        );

        valid = false;
    }

    if (joiningDate === "") {
        showFieldError(
            "joiningDateError",
            "Joining date is required."
        );

        valid = false;
    }

    if (status === "") {
        showFieldError(
            "statusError",
            "Select employee status."
        );

        valid = false;
    }

    return valid;
}

function showFieldError(id, message) {
    document.getElementById(id).textContent = message;
}

function clearErrors() {
    document.querySelectorAll(".form-group small")
        .forEach(error => {
            error.textContent = "";
        });
}

function openDeleteModal(id) {
    employeeToDelete = id;

    document.getElementById("deleteModal").style.display = "flex";
}

async function confirmDelete() {
    if (!employeeToDelete) {
        return;
    }

    try {
        await deleteEmployee(employeeToDelete);

        employeeToDelete = null;

        closeModal("deleteModal");

        await loadEmployees();
    } catch (error) {
        alert("Unable to delete employee.");
    }
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = "none";
}

function showLoading() {
    document.getElementById("loading").style.display = "block";
    document.getElementById("errorMessage").style.display = "none";
    document.getElementById("emptyMessage").style.display = "none";
}

function showError() {
    document.getElementById("loading").style.display = "none";
    document.getElementById("errorMessage").style.display = "block";
}

function showEmpty() {
    document.getElementById("loading").style.display = "none";
    document.getElementById("errorMessage").style.display = "none";
    document.getElementById("emptyMessage").style.display = "block";
}

function hideMessages() {
    document.getElementById("loading").style.display = "none";
    document.getElementById("errorMessage").style.display = "none";
    document.getElementById("emptyMessage").style.display = "none";
}

function formatDate(date) {
    const newDate = new Date(date);

    return newDate.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    });
}

const themeToggle = document.getElementById("themeToggle");

themeToggle.addEventListener("click", function () {
    document.body.classList.toggle("dark-mode");

    const isDarkMode =
        document.body.classList.contains("dark-mode");

    if (isDarkMode) {
        themeToggle.textContent = " Light Mode";
        localStorage.setItem("theme", "dark");
    } else {
        themeToggle.textContent = "Dark Mode";
        localStorage.setItem("theme", "light");
    }
});

const savedTheme = localStorage.getItem("theme");

if (savedTheme === "dark") {
    document.body.classList.add("dark-mode");
    themeToggle.textContent = " Light Mode";
}

loadEmployees();