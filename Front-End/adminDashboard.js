class AdminDashboard {
  constructor(apiUrl) {
    this.apiUrl = apiUrl;

    // Front-end: Cache DOM elements
    this.homeLink = document.getElementById('homeLink');
    this.usersLink = document.getElementById('usersLink');
    this.homeSection = document.getElementById('homeSection');
    this.usersSection = document.getElementById('usersSection');
    this.addUserModal = document.getElementById('addUserModal');
    this.addUserButton = document.getElementById('addUser');
    this.closeModal = this.addUserModal.querySelector('.close');
    this.addUserForm = document.getElementById('addUserForm');
    this.saveAndAddAnotherButton = document.getElementById('saveAndAddAnother');
    this.cancelButton = this.addUserModal.querySelector('.btn-cancel');
    this.searchInput = document.getElementById('searchInput');
    this.statusFilter = document.getElementById('statusFilter');
    this.departmentFilter = document.getElementById('departmentFilter');
    this.selectAllCheckbox = document.getElementById('selectAll');
    this.userTableBody = document.getElementById('userTableBody');
    this.signOutButton = document.getElementById('signOut');

    // Initialize event listeners and load initial data
    this.initializeEvents();
    this.initializeDashboard();
  }

  // Setup event listeners for user interactions
  initializeEvents() {
    this.homeLink.addEventListener('click', () => this.switchSection(this.homeSection, this.homeLink));
    this.usersLink.addEventListener('click', () => this.switchSection(this.usersSection, this.usersLink));
    this.signOutButton.addEventListener('click', this.signOut);
    this.addUserButton.addEventListener('click', () => this.toggleModal(true));
    this.closeModal.addEventListener('click', () => this.toggleModal(false));
    this.cancelButton.addEventListener('click', () => this.toggleModal(false));
    this.saveAndAddAnotherButton.addEventListener('click', (event) => this.saveAndAddAnother(event));
    window.addEventListener('click', (event) => {
      if (event.target === this.addUserModal) this.toggleModal(false);
    });
    this.addUserForm.addEventListener('submit', (event) => this.handleAddUser(event));
    this.searchInput.addEventListener('input', () => this.applyFilters());
    this.statusFilter.addEventListener('change', () => this.applyFilters());
    this.departmentFilter.addEventListener('change', () => this.applyFilters());
    this.selectAllCheckbox.addEventListener('change', () => this.toggleSelectAll());
  }

  // Dashboard initialization (calls back-end APIs to populate data)
  initializeDashboard() {
    this.fetchStateBoxes(); // Back-end: Fetch and display dashboard statistics
    this.fetchActivities(); // Back-end: Fetch and display recent activities
    this.fetchUsers();      // Back-end: Fetch and render users
    this.initializeGraphs(); // Front-end: Initialize charts/graphs
  }

  // ====================== BACK-END API CALLS ====================== //

  // Fetch dashboard stats (e.g., total orders, out-of-stock items)
  async fetchStateBoxes() {
    try {
      const response = await fetch(`${this.apiUrl}/dashboard-stats`);
      if (!response.ok) throw new Error('Failed to fetch state boxes');
      const data = await response.json();

      // Update UI with fetched data
      document.getElementById('totalOrders').querySelector('h1').innerText = data.totalOrders;
      document.getElementById('outofStock').querySelector('h1').innerText = data.outOfStock;
      document.getElementById('ordersShipped').querySelector('h1').innerText = data.ordersShipped;
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
        <td>${user.firstName} ${user.lastName}</td>
        <td>${user.status}</td>
        <td>${user.department}</td>
        <td>${user.position}</td>
        <td>${user.lastLogin}</td>
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

  // Sign-out modal handling
  signOut() {
    const modal = document.getElementById('signOutModal');
    const closeModal = modal.querySelector('.outModal-close');
    const confirmButton = document.getElementById('confirmSignOut');
    const cancelButton = document.getElementById('cancelSignOut');

    // Show the modal
    modal.style.display = 'flex';

    // Close the modal on cancel or close button
    cancelButton.addEventListener('click', () => modal.style.display = 'none');
    closeModal.addEventListener('click', () => modal.style.display = 'none');

    // Confirm sign out and redirect
    confirmButton.addEventListener('click', () => window.location.href = 'welcome.html');

    // Close the modal if clicked outside
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
  const apiUrl = 'http://localhost:8000/api'; // Back-end: API URL
  new AdminDashboard(apiUrl);
});
