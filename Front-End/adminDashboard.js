class AdminDashboard {
  constructor(apiUrl) {
    this.apiUrl = apiUrl;

    // Cache DOM elements with safe checks
    this.homeLink = document.getElementById('homeLink');
    this.usersLink = document.getElementById('usersLink');
    this.homeSection = document.getElementById('homeSection');
    this.usersSection = document.getElementById('usersSection');
    this.addUserModal = document.getElementById('addUserModal');
    this.addUserButton = document.getElementById('addUser');
    this.closeModal = this.addUserModal ? this.addUserModal.querySelector('.close') : null;
    this.addUserForm = document.getElementById('addUserForm');
    this.saveAndAddAnotherButton = document.querySelector('.btn-secondary');
    this.cancelButton = this.addUserModal ? this.addUserModal.querySelector('.btn-cancel') : null;
    this.searchInput = document.getElementById('searchInput');
    this.statusFilter = document.getElementById('statusFilter');
    this.departmentFilter = document.getElementById('departmentFilter');
    this.selectAllCheckbox = document.getElementById('selectAll');
    this.userTableBody = document.getElementById('userTableBody');
    this.signOutButton = document.getElementById('signOut');

    this.initializeEvents();
    this.initializeDashboard();
  }

  initializeDashboard() {
    this.fetchStateBoxes();
    //this.fetchActivities();
    this.fetchUsers();
    //this.initializeGraphs();
  }

  initializeEvents() {
    if (this.homeLink) {
      this.homeLink.addEventListener('click', () => this.switchSection(this.homeSection, this.homeLink));
    }
    if (this.usersLink) {
      this.usersLink.addEventListener('click', () => this.switchSection(this.usersSection, this.usersLink));
    }
    if (this.signOutButton) {
      this.signOutButton.addEventListener('click', () => this.signOut());
    }
    if (this.addUserButton) {
      this.addUserButton.addEventListener('click', () => this.toggleModal(true));
    }
    if (this.closeModal) {
      this.closeModal.addEventListener('click', () => this.toggleModal(false));
    }
    if (this.cancelButton) {
      this.cancelButton.addEventListener('click', () => this.toggleModal(false));
    }
    if (this.saveAndAddAnotherButton) {
      this.saveAndAddAnotherButton.addEventListener('click', (event) => this.saveAndAddAnother(event));
    }
    if (this.addUserForm) {
      this.addUserForm.addEventListener('submit', (event) => this.handleAddUser(event));
    }
    if (this.searchInput) {
      this.searchInput.addEventListener('input', () => this.applyFilters());
    }
    if (this.statusFilter) {
      this.statusFilter.addEventListener('change', () => this.applyFilters());
    }
    if (this.departmentFilter) {
      this.departmentFilter.addEventListener('change', () => this.applyFilters());
    }
    if (this.selectAllCheckbox) {
      this.selectAllCheckbox.addEventListener('change', () => this.toggleSelectAll());
    }
  }

  // ====================== BACK-END API CALLS ====================== //

  // Fetch and display recent activities
  async fetchActivities() {
    try {
      const response = await fetch(`${this.apiUrl}/activities`);
      if (!response.ok) throw new Error('Failed to fetch activities');
      const activities = await response.json();

      // Update UI with fetched data
      const activityList = document.getElementById('activityList');
      activityList.innerHTML = activities.map(activity => `<li>${activity}</li>`).join('');
    } catch (error) {
      console.error('Error fetching activities:', error);
    }
  }

// Update stats boxes dynamically
updateStatsBoxes(stats) {
  // Safely update stats boxes if data exists
  if (stats.users !== undefined) {
    document.getElementById('users').querySelector('h1').innerText = stats.users;
  }
  if (stats.activeUsers !== undefined) {
    document.getElementById('activeUsers').querySelector('h1').innerText = stats.activeUsers;
  }
  if (stats.departments !== undefined) {
    document.getElementById('departments').querySelector('h1').innerText = stats.departments;
  }
}

// Fetch dashboard stats (e.g., total orders, out-of-stock items)
async fetchStateBoxes() {
  try {
    const response = await fetch(`${this.apiUrl}/dashboard-stats`);
    if (!response.ok) throw new Error('Failed to fetch state boxes');
    const data = await response.json();
    this.updateStatsBoxes(data); // Use the reusable method
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
  }
}

// Add user and update the table and stats without refreshing
async handleAddUser(event) {
  event.preventDefault();
  const formData = new FormData(this.addUserForm);

  try {
    const response = await fetch(`${this.apiUrl}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(Object.fromEntries(formData))
    });

    if (response.ok) {
      const newUser = await response.json(); // Get the newly added user from the API response
      this.addUserToTable(newUser); // Add the user to the table dynamically

      // Update the stats dynamically (e.g., increment users and activeUsers count)
      this.updateStatsBoxes({
        users: parseInt(document.getElementById('users').querySelector('h1').innerText) + 1,
        activeUsers: parseInt(document.getElementById('activeUsers').querySelector('h1').innerText) + 1 // Assuming the new user is active
      });

      this.addUserForm.reset(); // Reset the form
      this.toggleModal(false); // Close the modal
      alert('User added successfully');
      
      // Optional: Refresh the stats from the server to ensure consistency
      this.fetchStateBoxes();
    } else {
      const errorMsg = await response.json();
      alert(`Error adding user: ${errorMsg.message}`);
    }
  } catch (error) {
    console.error('Error adding user:', error);
    alert('Network error. Please try again later.');
  }
}

// Add user dynamically to the table
addUserToTable(user) {
  const newRow = document.createElement('tr');
  newRow.innerHTML = `
    <td><input type="checkbox" class="user-checkbox"></td>
    <td>${user.userId}</td>
    <td>${user.status || 'ACTIVE'}</td> <!-- Default to ACTIVE if not provided -->
    <td>${user.role || 'N/A'}</td> <!-- Default to N/A if role is not provided -->
    <td>${user.lastLogin || 'Today'}</td> <!-- Default to Today if not provided -->
  `;
  this.userTableBody.appendChild(newRow);
}

// Save and add another user without reloading the page
async saveAndAddAnother(event) {
  event.preventDefault();
  const formData = new FormData(this.addUserForm);

  try {
    const response = await fetch(`${this.apiUrl}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(Object.fromEntries(formData))
    });

    if (response.ok) {
      const newUser = await response.json(); // Get the newly added user from the API response
      this.addUserToTable(newUser); // Add the user to the table dynamically
      this.addUserForm.reset(); // Reset the form but keep the modal open
      alert('User added successfully');
      
      // Optional: Refresh the stats from the server to ensure consistency
      this.fetchStateBoxes();
    } else {
      const errorMsg = await response.json();
      alert(`Error adding user: ${errorMsg.message}`);
    }
  } catch (error) {
    console.error('Error adding user:', error);
    alert('Network error. Please try again later.');
  }
}

// Fetch and display user data
async fetchUsers() {
  try {
    const response = await fetch(`${this.apiUrl}/users`);
    if (!response.ok) throw new Error('Failed to fetch users');
    const users = await response.json();
    this.renderUserTable(users); // Populate the user table in the UI
  } catch (error) {
    console.error('Error fetching users:', error);
  }
}
  // ====================== END BACK-END API CALLS ====================== //

  // ====================== FRONT-END UI UPDATES ====================== //

  // Render users into the table
  renderUserTable(users) {
    this.userTableBody.innerHTML = users.map(user => `
      <tr>
        <td><input type="checkbox" class="user-checkbox"></td>
        <td>${user.userId}</td>
        <td>ACTIVE</td>
        <td>${user.role}</td>
        <td>Today</td>
      </tr>
    `).join('');
  }

  // Switch between dashboard sections
  switchSection(section, link) {
    document.querySelector('.active-section').classList.remove('active-section');
    section.classList.add('active-section');
    document.querySelector('.menu .active').classList.remove('active');
    link.classList.add('active');
  }

  signOut() {
    const modal = document.getElementById('signOutModal');
    const closeModal = modal.querySelector('.outModal-close');
    const confirmButton = document.getElementById('confirmSignOut');
    const cancelButton = document.getElementById('cancelSignOut');

    console.log("Sign-out modal opened"); // Debugging line
    modal.style.display = 'flex';

    cancelButton.addEventListener('click', () => {
      modal.style.display = 'none';
      console.log("Sign-out modal closed");
    });
    closeModal.addEventListener('click', () => modal.style.display = 'none');

    confirmButton.addEventListener('click', () => window.location.href = 'welcome.html');

    window.addEventListener('click', (event) => {
      if (event.target === modal) {
        modal.style.display = 'none';
      }
    });
  }


  // Show or hide the add user modal
  toggleModal(visible) {
    this.addUserModal.style.display = visible ? 'flex' : 'none';
  }

  // Apply filters to the user table
  applyFilters() {
    const searchText = this.searchInput.value.toLowerCase();
    const status = this.statusFilter.value;
    const department = this.departmentFilter.value;

    Array.from(this.userTableBody.children).forEach(row => {
      const [nameCell, statusCell, departmentCell] = [row.cells[1], row.cells[2], row.cells[3]];
      const matchesSearch = nameCell.innerText.toLowerCase().includes(searchText);
      const matchesStatus = !status || statusCell.innerText === status;
      const matchesDepartment = !department || departmentCell.innerText === department;

      row.style.display = matchesSearch && matchesStatus && matchesDepartment ? '' : 'none';
    });
  }

  // Select/deselect all users in the table
  toggleSelectAll() {
    const checkboxes = document.querySelectorAll('.user-checkbox');
    checkboxes.forEach(checkbox => checkbox.checked = this.selectAllCheckbox.checked);
  }

  // Initialize graphs/charts
  initializeGraphs() {
    new Chart(document.getElementById('engagementGraph').getContext('2d'), {
      type: 'line',
      data: { /* Add chart data */ },
      options: { /* Add chart options */ }
    });

    new Chart(document.getElementById('eventGraph').getContext('2d'), {
      type: 'bar',
      data: { /* Add chart data */ },
      options: { /* Add chart options */ }
    });

    new Chart(document.getElementById('monthlyGraph').getContext('2d'), {
      type: 'pie',
      data: { /* Add chart data */ },
      options: { /* Add chart options */ }
    });
  }
}

// Initialize the Admin Dashboard when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const apiUrl = 'http://localhost:8080/api'; // Back-end: API URL
  new AdminDashboard(apiUrl);
});
