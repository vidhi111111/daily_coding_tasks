const users = [];

const userTableBody = document.getElementById("userTableBody");
const userTableContainer = document.getElementsByClassName("table-container")[0];
const loadingState = document.getElementsByClassName("loading-state");
const paginationContainer = document.getElementsByClassName("pagination")[0];
const searchInput = document.getElementById("searchUser");
const roleFilter = document.getElementById("roleFilter");
const sortByName = document.getElementById("sortBy");
const retryButton = document.getElementById("retryBtn");


const errorState = document.getElementsByClassName("error-state")[0];


const editModal = document.getElementById("editModal");
const editUserForm = document.getElementById("editUserForm");

const editUserId = document.getElementById("editUserId");
const editName = document.getElementById("editName");
const editEmail = document.getElementById("editEmail");
const editStatus = document.getElementById("editStatus");

const cancelEdit = document.getElementById("cancelEdit");

const rowsPerPage = 10;
let currentPage = 1;
let currentUserList = [];


function displayUsers(userList) {

    currentUserList = userList;
    const totalPages = Math.ceil(userList.length / rowsPerPage);

    if (totalPages === 0) {
        currentPage = 1;
    } else if (currentPage > totalPages) {
        currentPage = totalPages;
    }
    userTableBody.innerHTML = "";

    if (userList.length === 0) {
        userTableBody.innerHTML = `
            <tr>
                <td colspan="4">No users found.</td>
            </tr>
        `;
        return;
    }

    userTableContainer.style.display = "block";
    loadingState[0].style.display = "none";

    const startIndex = (currentPage - 1) * rowsPerPage;
    const pagedUsers = currentUserList.slice(startIndex, startIndex + rowsPerPage);

    console.log("pagedUser : ", pagedUsers)

    pagedUsers.forEach(function (user) {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${user.firstName} ${user.lastName}</td>
            <td>${user.email}</td>
            <td>${user.role}</td>
            <td>${user.age}</td>
            <td>${user.phone}</td>


            <td>

                <button class="delete-btn" onclick="deleteUser(${user.id})">
                    Delete
                </button>
            </td>
        `;

        userTableBody.appendChild(row);
    });


    renderPagination();


}


function renderPagination() {
    const totalPages = Math.ceil(currentUserList.length / rowsPerPage);

    paginationContainer.style.display = totalPages > 1 ? "flex" : "none";

    paginationContainer.innerHTML = "";

    const previousButton = document.createElement("button");
    previousButton.className = "pagination-btn";
    previousButton.textContent = "Previous";
    previousButton.disabled = currentPage === 1;

    previousButton.addEventListener("click", function () {
        currentPage--;
        displayUsers(currentUserList);
    });

    paginationContainer.appendChild(previousButton);

    for (let page = 1; page <= totalPages; page++) {
        const pageButton = document.createElement("button");

        pageButton.className = "page-btn active-page";
        pageButton.textContent = page;


        pageButton.addEventListener("click", function () {
            currentPage = page;
            displayUsers(currentUserList);
        });

        paginationContainer.appendChild(pageButton);
    }

    const nextButton = document.createElement("button");
    nextButton.className = "pagination-btn";
    nextButton.textContent = "Next";
    nextButton.disabled = currentPage === totalPages;

    nextButton.addEventListener("click", function () {
        currentPage++;
        displayUsers(currentUserList);
    });

    paginationContainer.appendChild(nextButton);
}


function fetchUsers() {

    fetch("https://dummyjson.com/users")
        .then((response) => response.json())
        .then((data) => {
            // console.log("Fetched users:", data.users);
            errorState.style.display = "none";
            users.push(...data.users);
            displayUsers(users);
        })
        .catch((error) => {
            loadingState[0].style.display = "none";
            errorState.style.display = "block";
            console.error("Error fetching users:", error);
        });
}

retryButton.addEventListener("click", function() {
    fetchUsers();
});


searchInput.addEventListener("input", function () {
    const searchValue = searchInput.value.toLowerCase().trim();
    currentPage = 1;

    const filteredUsers = users.filter(function (user) {
        return (
            `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchValue) ||
            user.email.toLowerCase().includes(searchValue)
        );
    });

    displayUsers(filteredUsers);
});


function deleteUser(id) {
    const user = users.find(function (user) {
        return user.id === id;
    });

    if (!user) {
        return;
    }

    const userIndex = users.findIndex(function (user) {
        return user.id === id;
    });

    users.splice(userIndex, 1);

    displayUsers(users);
}


roleFilter.addEventListener("change", function () {
    const selectedRole = roleFilter.value;
    const filteredUsers = selectedRole === "all" ? users : users.filter(user => user.role === selectedRole);
    displayUsers(filteredUsers);
})


sortByName.addEventListener("change", function () {
    const selectedSort = sortByName.value;

    if (selectedSort === "name-za") {
        const sortedUsers = [...currentUserList].sort((a, b) => {
            const nameA = `${a.firstName} ${a.lastName}`.toLowerCase();
            const nameB = `${b.firstName} ${b.lastName}`.toLowerCase();
            return nameB.localeCompare(nameA);
        });
        displayUsers(sortedUsers);
    }

    else {
        const sortedUsers = [...currentUserList].sort((a, b) => {
            const nameA = `${a.firstName} ${a.lastName}`.toLowerCase();
            const nameB = `${b.firstName} ${b.lastName}`.toLowerCase();
            return nameA.localeCompare(nameB);
        });
        displayUsers(sortedUsers);
    }

 
})

cancelEdit.addEventListener("click", function () {
    editModal.style.display = "none";
});


fetchUsers();

displayUsers(users);