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

  // Fetch dashboard stats (e.g., total orders, out-of-stock items)
  async fetchStateBoxes() {
    try {
      const response = await fetch(`${this.apiUrl}/dashboard-stats`);
      if (!response.ok) throw new Error('Failed to fetch state boxes');
      const data = await response.json();

      // Update UI with fetched data
      document.getElementById('users').querySelector('h1').innerText = data.users;
      document.getElementById('activeUsers').querySelector('h1').innerText = data.activeUsers;
      document.getElementById('departments').querySelector('h1').innerText = data.departments;
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    }
  }

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

  // Add new user (via form submission)
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
        alert('User added successfully');
        this.fetchUsers(); // Refresh the user list
        this.toggleModal(false); // Close the modal
        this.addUserForm.reset(); // Reset the form
      } else {
        const errorMsg = await response.json();
        alert(`Error adding user: ${errorMsg.message}`);
      }
    } catch (error) {
      console.error('Error adding user:', error);
      alert('Network error. Please try again later.');
    }
  }

  // Save user and allow adding another one (modal remains open)
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
        alert('User added successfully');
        this.fetchUsers(); // Refresh the user list
        this.addUserForm.reset(); // Reset form but keep modal open
      } else {
        const errorMsg = await response.json();
        alert(`Error adding user: ${errorMsg.message}`);
      }
    } catch (error) {
      console.error('Error adding user:', error);
      alert('Network error. Please try again later.');
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
