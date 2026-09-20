const users = [
    {
        id: 1,
        name: "John",
        email: "john@gmail.com",
        status: "Active"
    },
    {
        id: 2,
        name: "David",
        email: "david@gmail.com",
        status: "Active"
    },
    {
        id: 3,
        name: "Sarah",
        email: "sarah@gmail.com",
        status: "Inactive"
    }
];

const userTableBody = document.getElementById("userTableBody");
const searchUser = document.getElementById("searchUser");

const editModal = document.getElementById("editModal");
const editForm = document.getElementById("editForm");
const editName = document.getElementById("editName");
const editEmail = document.getElementById("editEmail");
const editStatus = document.getElementById("editStatus");
const closeModal = document.getElementById("closeModal");

let editingUserId = null;

function displayUsers(userList) {

    userTableBody.innerHTML = "";

    userList.forEach(function (user) {

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>${user.status}</td>
            <td>
                <button onclick="editUser(${user.id})">Edit</button>
                <button onclick="deleteUser(${user.id})">Delete</button>
            </td>
        `;

        userTableBody.appendChild(row);
    });
}

displayUsers(users);

searchUser.addEventListener("input", function () {

    const searchValue = searchUser.value.toLowerCase();

    const filteredUsers = users.filter(function (user) {

        return (
            user.name.toLowerCase().includes(searchValue) ||
            user.email.toLowerCase().includes(searchValue)
        );

    });

    displayUsers(filteredUsers);
});

function deleteUser(id) {

    const confirmDelete = confirm("Are you sure you want to delete this user?");

    if (!confirmDelete) {
        return;
    }

    const userIndex = users.findIndex(function (user) {
        return user.id === id;
    });

    users.splice(userIndex, 1);

    displayUsers(users);
}

function editUser(id) {

    const user = users.find(function (user) {
        return user.id === id;
    });

    editingUserId = id;

    editName.value = user.name;
    editEmail.value = user.email;
    editStatus.value = user.status;

    editModal.style.display = "flex";
}

editForm.addEventListener("submit", function (event) {

    event.preventDefault();

    const user = users.find(function (user) {
        return user.id === editingUserId;
    });

    user.name = editName.value;
    user.email = editEmail.value;
    user.status = editStatus.value;

    editModal.style.display = "none";

    displayUsers(users);
});

closeModal.addEventListener("click", function () {
    editModal.style.display = "none";
});