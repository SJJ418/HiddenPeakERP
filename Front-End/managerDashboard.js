class ManagerDashboard {
  constructor(apiUrl) {
    this.apiUrl = apiUrl;
    this.initElements();
    this.initEvents();
    this.loadInitialData();
  }

  // Front-end: Cache DOM elements
    initElements() {
    this.sections = {
      homeLink: 'homeSection',
      ordersLink: 'ordersSection',
      inventoryLink: 'inventorySection',
    };

    this.addOrderModal = document.getElementById('addOrderModal');
    this.addInventoryModal = document.getElementById('addInventoryModal');
    this.orderTableBody = document.getElementById('orderTableBody');
    this.inventoryTableBody = document.getElementById('inventoryTableBody');
    this.vendorDropdown = document.getElementById('vendorName');
    this.newVendorField = document.getElementById('newVendorField');
    this.signOutButton = document.getElementById('signOut');
    this.initializeFilters();
  }

  // Initialize event listeners
  initEvents() {
    // Switch sections based on menu links
    Object.entries(this.sections).forEach(([linkId, sectionId]) => {
      document.getElementById(linkId).addEventListener('click', () =>
        this.switchSection(sectionId, linkId)
      );
    });

    // Setup modals
    this.setupModal('addOrder', this.addOrderModal, 'addOrderForm');
    this.setupModal('addInventory', this.addInventoryModal, 'addInventoryForm', () =>
      this.populateVendors()
    );

    // Handle vendor dropdown change
    this.vendorDropdown.addEventListener('change', () => this.handleNewVendor());

    // Handle sign-out button click
    this.signOutButton.addEventListener('click', () => this.signOut());

    // Setup search functionality for both orders and inventory
    this.setupSearch('searchInput', this.orderTableBody);
    this.setupSearch('inventorySearchInput', this.inventoryTableBody);
  }

  // Load initial data on dashboard
  loadInitialData() {
    this.fetchDashboardData();
    this.fetchOrders();
    this.fetchInventory();
  }

  // Switch between sections
  switchSection(sectionId, activeLinkId) {
    document.querySelectorAll('.content > div').forEach(div => (div.style.display = 'none'));
    document.querySelectorAll('.menu li').forEach(li => li.classList.remove('active'));
    document.getElementById(sectionId).style.display = 'block';
    document.getElementById(activeLinkId).classList.add('active');
  }

  // Setup modals with navigation, close, and submit logic
  setupModal(openButtonId, modal, formId, extraSetup = null) {
    const closeButton = modal.querySelector('.close');
    const cancelButton = modal.querySelector('#cancelBtn');
    const prevButton = modal.querySelector('#prevBtn');
    const nextButton = modal.querySelector('#nextBtn');
    const tabLinks = modal.querySelectorAll('.tab-link');
    const form = document.getElementById(formId);
    let currentTab = 0;

    // Open modal and display first tab
    document.getElementById(openButtonId).addEventListener('click', () => {
      modal.style.display = 'flex';
      this.showTab(modal, currentTab);
      this.updateTabUnderline(tabLinks, currentTab);
    });

    // Close modal on close or cancel button click
    closeButton.addEventListener('click', () => this.closeModal(modal));
    cancelButton.addEventListener('click', () => this.closeModal(modal));

    // Handle previous and next buttons
    prevButton.addEventListener('click', () => this.changeTab(modal, form, -1, tabLinks));
    nextButton.addEventListener('click', () => this.changeTab(modal, form, 1, tabLinks));

    // Tab navigation via tab links
    tabLinks.forEach((link, index) => {
      link.addEventListener('click', () => {
        currentTab = index;
        this.showTab(modal, currentTab);
        this.updateTabUnderline(tabLinks, currentTab);
      });
    });

    // Handle form submission
    form.addEventListener('submit', async event => {
      event.preventDefault();
      await this.submitForm(formId, modal);
    });

    // Call any extra setup function
    if (extraSetup) extraSetup();
  }

  // Close modal
  closeModal(modal) {
    modal.style.display = 'none';
  }

  // Show the current tab in the modal
  showTab(modal, index) {
    const tabs = modal.querySelectorAll('.tab-content');
    const prevButton = modal.querySelector('#prevBtn');
    const nextButton = modal.querySelector('#nextBtn');

    tabs.forEach((tab, i) => (tab.style.display = i === index ? 'block' : 'none'));
    prevButton.style.display = index === 0 ? 'none' : 'inline-block';
    nextButton.textContent = index === tabs.length - 1 ? 'Submit' : 'Next';
  }

  // Change tab based on step
  changeTab(modal, form, step, tabLinks) {
    const tabs = modal.querySelectorAll('.tab-content');
    let currentTab = Array.from(tabs).findIndex(tab => tab.style.display === 'block');

    if (step === 1 && !this.validateTab(form, currentTab)) {
      alert('Please fill all required fields.');
      return;
    }

    currentTab += step;

    if (currentTab >= tabs.length) {
      form.requestSubmit();
    } else {
      this.showTab(modal, currentTab);
      this.updateTabUnderline(tabLinks, currentTab);
    }
  }

  // Update tab underline to indicate active tab
  updateTabUnderline(tabLinks, index) {
    tabLinks.forEach(link => link.classList.remove('active'));
    tabLinks[index].classList.add('active');
  }

  // Validate required inputs in the current tab
  validateTab(form, index) {
    const inputs = form.querySelectorAll(`.tab-content:nth-of-type(${index + 1}) input[required]`);
    return Array.from(inputs).every(input => input.value.trim() !== '');
  }

  // Populate vendor dropdown with vendors
  populateVendors() {
    const vendors = ['Vendor A', 'Vendor B', 'Vendor C'];
    this.vendorDropdown.innerHTML = vendors
      .map(vendor => `<option value="${vendor}">${vendor}</option>`)
      .join('');

    const addNewOption = document.createElement('option');
    addNewOption.value = 'add-new';
    addNewOption.textContent = 'Add New Vendor';
    this.vendorDropdown.appendChild(addNewOption);
  }

  // Handle "Add New Vendor" option selection
  handleNewVendor() {
    const selectedValue = this.vendorDropdown.value;
    this.newVendorField.style.display = selectedValue === 'add-new' ? 'block' : 'none';
  }

  // Add a new vendor to the dropdown
  addVendorToDropdown(vendorName) {
    const newOption = document.createElement('option');
    newOption.value = vendorName;
    newOption.textContent = vendorName;
    this.vendorDropdown.insertBefore(newOption, this.vendorDropdown.querySelector('[value="add-new"]'));
    this.vendorDropdown.value = vendorName;
  }

// ====================== BACK-END API CALLS ====================== //

// Dynamically update stats box
updateStatsBoxes(stats) {
  if (stats.orders !== undefined) {
    document.getElementById('totalOrders').querySelector('h1').innerText = stats.orders;
  }
  if (stats.outOfStock !== undefined) {
    document.getElementById('outofStock').querySelector('h1').innerText = stats.outOfStock;
  }
  if (stats.ordersShipped !== undefined) {
    document.getElementById('ordersShipped').querySelector('h1').innerText = stats.ordersShipped;
  }
}

// Add new order to the table dynamically
addOrderToTable(order) {
  const newRow = document.createElement('tr');
  newRow.innerHTML = `
    <td><input type="checkbox"></td>
    <td>${order.orderId}</td>
    <td>${order.customerName}</td>
    <td>${order.cost || ''}</td>
    <td>${order.status || 'Pending'}</td>
    <td>${order.quantity || ''}</td>
    <td>${order.dueDate || ''}</td>
    <td>${order.zip || ''}</td>
  `;
  this.orderTableBody.appendChild(newRow);
}

// Add new inventory item to the table dynamically
addInventoryToTable(inventory) {
  const newRow = document.createElement('tr');
  newRow.innerHTML = `
    <td><input type="checkbox"></td>
    <td>${inventory.itemId}</td>
    <td>${inventory.itemName}</td>
    <td>${inventory.cost || ''}</td>
    <td>${inventory.status || ''}</td>
    <td>${inventory.quantity || ''}</td>
    <td>${inventory.inventoryDate || ''}</td>
  `;
  this.inventoryTableBody.appendChild(newRow);
}

// Handle form submission for orders and inventory
async submitForm(formId, modal) {
  const formData = new FormData(document.getElementById(formId));
  const data = Object.fromEntries(formData.entries());

  const newVendorName = document.getElementById('newVendorName').value.trim();
  if (newVendorName) this.addVendorToDropdown(newVendorName);

  try {
    const response = await fetch(`${this.apiUrl}/${formId.split('Form')[0]}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      const savedData = await response.json();
      alert('Saved successfully!');

      if (formId === 'addOrderForm') {
        // Add the new order to the table dynamically
        this.addOrderToTable(savedData);

        // Update stats dynamically
        this.updateStatsBoxes({
          orders: parseInt(document.getElementById('totalOrders').querySelector('h1').innerText) + 1,
        });
      } else if (formId === 'addInventoryForm') {
        // Add the new inventory item to the table dynamically
        this.addInventoryToTable(savedData);

        // Update stats dynamically (e.g., out-of-stock count)
        this.updateStatsBoxes({
          outOfStock: parseInt(document.getElementById('outofStock').querySelector('h1').innerText) + 1,
        });
      }

      this.closeModal(modal);

      // Optionally refresh stats from the server for consistency
      this.fetchDashboardData();
    } else {
      const error = await response.json();
      alert(`Error: ${error.message}`);
    }
  } catch (error) {
    console.error('Error submitting form:', error);
    alert('Network error. Please try again.');
  }
}

// Fetch and display dashboard data
async fetchDashboardData() {
  const data = await this.fetchData('/dashboard-data');
  if (data) this.updateStatsBoxes(data);
}

// Fetch orders and populate the table
async fetchOrders() {
  const orders = await this.fetchData('/orders');
  if (orders) this.populateTable(orders, this.orderTableBody);
}

// Fetch inventory and populate the table
async fetchInventory() {
  const inventory = await this.fetchData('/inventory');
  if (inventory) this.populateTable(inventory, this.inventoryTableBody);
}

// Populate table with data
populateTable(data, tableBody) {
  tableBody.innerHTML = data
    .map(
      item => `
      <tr>
        <td><input type="checkbox"></td>
        <td>${item.orderId || item.itemId}</td>
        <td>${item.customerName || item.itemName}</td>
        <td>${item.cost || ''}</td>
        <td>${item.status || ''}</td>
        <td>${item.quantity || ''}</td>
        <td>${item.dueDate || item.inventoryDate || ''}</td>
      </tr>`
    )
    .join('');
}

// Fetch data from the API
async fetchData(endpoint) {
  try {
    const response = await fetch(`${this.apiUrl}${endpoint}`);
    if (!response.ok) throw new Error(`Failed to fetch from ${endpoint}`);
    return await response.json();
  } catch (error) {
    console.error('Fetch error:', error);
    return null;
  }
}

// ====================== END BACK-END API CALLS ====================== //

// Filtering and sorting logic for orders and inventory
applyFilters() {
  this.filterOrders();    // Apply filters to the order table
  this.filterInventory(); // Apply filters to the inventory table
}

// Filter and sort orders
filterOrders() {
  const searchText = document.getElementById('searchInput').value.toLowerCase(); // Search input
  const status = document.getElementById('statusFilter').value;                 // Status filter
  const sortBy = document.getElementById('sorting').value;                      // Sorting dropdown

  // Get all rows from the orders table
  const rows = Array.from(this.orderTableBody.children);

  // Filter rows based on search text and status
  const filteredRows = rows.filter(row => {
    const [orderIdCell, customerCell, , statusCell] = row.cells; // Relevant cells for filtering
    const matchesSearch = customerCell.innerText.toLowerCase().includes(searchText);
    const matchesStatus = !status || statusCell.innerText.toLowerCase() === status.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  // Sort rows based on the selected sort option
  filteredRows.sort((a, b) => {
    switch (sortBy) {
      case 'date':
        return new Date(a.cells[6].innerText) - new Date(b.cells[6].innerText); // Compare dates
      case 'customer':
        return a.cells[1].innerText.localeCompare(b.cells[1].innerText);        // Compare customer names
      case 'status':
        return a.cells[4].innerText.localeCompare(b.cells[4].innerText);        // Compare statuses
      default:
        return 0; // No sorting
    }
  });

  // Clear and re-populate the table with filtered and sorted rows
  this.orderTableBody.innerHTML = '';
  filteredRows.forEach(row => this.orderTableBody.appendChild(row));
}

// Filter and sort inventory
filterInventory() {
  const searchText = document.getElementById('inventorySearchInput').value.toLowerCase(); // Search input
  const status = document.getElementById('inventoryStatusFilter').value;                  // Status filter
  const sortBy = document.getElementById('inventorySorting').value;                       // Sorting dropdown

  // Get all rows from the inventory table
  const rows = Array.from(this.inventoryTableBody.children);

  // Filter rows based on search text and status
  const filteredRows = rows.filter(row => {
    const [itemIdCell, itemNameCell, , statusCell] = row.cells; // Relevant cells for filtering
    const matchesSearch = itemNameCell.innerText.toLowerCase().includes(searchText);
    const matchesStatus = !status || statusCell.innerText.toLowerCase() === status.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  // Sort rows based on the selected sort option
  filteredRows.sort((a, b) => {
    switch (sortBy) {
      case 'quantity':
        return parseInt(a.cells[2].innerText, 10) - parseInt(b.cells[2].innerText, 10); // Compare quantities
      case 'category':
        return a.cells[5].innerText.localeCompare(b.cells[5].innerText);                // Compare categories
      case 'vendor':
        return a.cells[6].innerText.localeCompare(b.cells[6].innerText);                // Compare vendors
      default:
        return 0; // No sorting
    }
  });

  // Clear and re-populate the table with filtered and sorted rows
  this.inventoryTableBody.innerHTML = '';
  filteredRows.forEach(row => this.inventoryTableBody.appendChild(row));
}

// Initialize filtering and sorting
initializeFilters() {
  // Orders filtering
  document.getElementById('searchInput').addEventListener('input', () => this.applyFilters());
  document.getElementById('statusFilter').addEventListener('change', () => this.applyFilters());
  document.getElementById('sorting').addEventListener('change', () => this.applyFilters());

  // Inventory filtering
  document.getElementById('inventorySearchInput').addEventListener('input', () => this.applyFilters());
  document.getElementById('inventoryStatusFilter').addEventListener('change', () => this.applyFilters());
  document.getElementById('inventorySorting').addEventListener('change', () => this.applyFilters());
}

  // Setup search functionality
  setupSearch(inputId, tableBody) {
    const input = document.getElementById(inputId);
    input.addEventListener('input', () => {
      const query = input.value.toLowerCase();
      Array.from(tableBody.children).forEach(row => {
        row.style.display = row.innerText.toLowerCase().includes(query) ? '' : 'none';
      });
    });
  }

  // Handle sign-out logic
  signOut() {
    const modal = document.getElementById('signOutModal');
    const closeModal = modal.querySelector('.outModal-close');
    const confirmButton = document.getElementById('confirmSignOut');
    const cancelButton = document.getElementById('cancelSignOut');

    modal.style.display = 'flex';

    cancelButton.addEventListener('click', () => {
      modal.style.display = 'none';
    });

    closeModal.addEventListener('click', () => {
      modal.style.display = 'none';
    });

    confirmButton.addEventListener('click', () => {
      window.location.href = 'welcome.html';
    });

    window.addEventListener('click', event => {
      if (event.target === modal) modal.style.display = 'none';
    });
  }
}

// Initialize Manager Dashboard
document.addEventListener('DOMContentLoaded', () => {
  const apiUrl = 'http://localhost:8080/api'; // Update with backend URL
  new ManagerDashboard(apiUrl);
});
