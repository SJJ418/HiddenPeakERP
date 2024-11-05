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

  // Handle form submission
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
        alert('Saved successfully!');
        this.closeModal(modal);
        this.loadInitialData();
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
    if (data) this.updateDashboard(data);
  }

  // Update dashboard with data
  updateDashboard(data) {
    document.getElementById('totalOrders').querySelector('h1').innerText = data.orders;
    document.getElementById('outofStock').querySelector('h1').innerText = data.outOfStock;
    document.getElementById('ordersShipped').querySelector('h1').innerText = data.ordersShipped;
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
          <td>${item.id || item.itemId}</td>
          <td>${item.name || item.itemName}</td>
          <td>${item.quantity || ''}</td>
          <td>${item.status || ''}</td>
          <td>${item.category || ''}</td>
          <td>${item.cost || ''}</td>
          <td>${item.vendor || ''}</td>
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
