class ProductionDashboard {
    constructor(apiUrl) {
        this.apiUrl = apiUrl;
        this.initElements();
        this.initEvents();
        this.loadInitialData();
    }

    // Cache DOM elements
    initElements() {
        this.sections = {
            homeLink: 'homeSection',
            productionLink: 'productionSection',
            shippingLink: 'shippingSection'
        };

        // Modals
        this.modals = {
            processOrder: document.getElementById("processOrderModal"),
            editOrder: document.getElementById("editOrderModal"),
            delayOrder: document.getElementById("delayOrderModal"),
            cancelOrder: document.getElementById("cancelOrderDialog"),
            completeOrder: document.getElementById("completeOrderModal"),
            shippingLabel: document.getElementById("shippingLabelModal"),
            signOut: document.getElementById("signOutModal")
        };

        // Tables and Forms
        this.productionTableBody = document.getElementById("productionTableBody");
        this.shippingTableBody = document.getElementById("shippingTableBody");
        this.forms = {
            processOrder: document.getElementById("processOrderForm"),
            editOrder: document.getElementById("editOrderForm"),
            delayOrder: document.getElementById("delayOrderForm")
        };

        // Buttons
        this.buttons = {
            signOut: document.getElementById("signOut"),
            shipOrder: document.getElementById("shipOrderButton"),
            editShipping: document.getElementById("editShippingButton"),
            cancelShipping: document.getElementById("cancelShippingButton"),
            tracking: document.getElementById("trackingButton"),
            processOrder: document.getElementById("processOrderButton"),
            editOrder: document.getElementById("editOrderButton"),
            cancelOrder: document.getElementById("cancelOrderButton"),
            delayOrder: document.getElementById("delayOrderButton"),
            completeOrder: document.getElementById("completeOrderButton")
        };
    }

// Initialize event listeners
initEvents() {
    // Navigation links for switching sections
    Object.entries(this.sections).forEach(([linkId, sectionId]) => {
        document.getElementById(linkId)?.addEventListener("click", () => this.switchSection(sectionId, linkId));
    });

    // Sign-out button and confirmation modal
    this.buttons.signOut?.addEventListener("click", () => this.signOut());

    // Form submissions for various actions (process, edit, delay orders)
    this.forms?.processOrder?.addEventListener("submit", (e) => this.submitOrder(e, 'process'));
    this.forms?.editOrder?.addEventListener("submit", (e) => this.submitOrder(e, 'edit'));
    this.forms?.delayOrder?.addEventListener("submit", (e) => this.submitOrder(e, 'delay'));

    // Shipping section buttons
    this.buttons.shipOrder?.addEventListener("click", () => {
        this.selectedOrderId = this.getSelectedOrderId("completed", "shippingTableBody");
        if (this.selectedOrderId) {
            this.openModal("shippingLabel", "completed");
        }
    });
    this.buttons.editShipping?.addEventListener("click", () => this.openModal('editShipping')); // Edit shipping modal
    this.buttons.cancelShipping?.addEventListener("click", () => this.openModal('cancelShipping')); // Cancel shipping modal
    this.buttons.tracking?.addEventListener("click", () => this.trackOrder()); // Tracking information

    // Production section buttons
    this.buttons.processOrder?.addEventListener("click", () => this.openModal('processOrder', 'pending')); // Open Process Order modal
    this.buttons.editOrder?.addEventListener("click", () => this.openModal('editOrder')); // Open Edit Order modal
    this.buttons.cancelOrder?.addEventListener("click", () => this.openModal('cancelOrder')); // Open Cancel Order modal
    this.buttons.delayOrder?.addEventListener("click", () => this.openModal('delayOrder', 'in_progress')); // Open Delay Order modal
    this.buttons.completeOrder?.addEventListener("click", () => this.openModal('completeOrder', 'in_progress')); // Open Complete Order modal

    // Confirm Complete Order action in the modal
    document.getElementById("confirmCompleteOrder")?.addEventListener("click", () => this.completeOrder());

    // Close button for Complete Order modal
    document.querySelector("#completeOrderModal .close")?.addEventListener("click", () => {
        this.modals.completeOrder.style.display = "none"; // Hide modal when close button is clicked
    });
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

    // Load initial data
    loadInitialData() {
        this.fetchDashboardData();
        this.loadTableData('production');
        this.loadTableData('shipping');
    }

    // Fetch and display dashboard data
    async fetchDashboardData() {
        const data = await this.fetchData('/production-data');
        if (data) this.updateDashboard(data);
    }

    // Update dashboard with data
    updateDashboard(data) {
        document.getElementById('pendingOrders').querySelector('h1').innerText = data.pendingOrders;
        document.getElementById('inProductionOrders').querySelector('h1').innerText = data.ordersInProduction;
        document.getElementById('completedOrders').querySelector('h1').innerText = data.completedOrders;
    }

    // Show the initial active section
    showInitialSection() {
        Object.values(this.sections).forEach(sectionId => {
            document.getElementById(sectionId)?.classList.remove('active-section');
        });
        document.getElementById(this.sections.homeLink)?.classList.add('active-section');
    }

    // Section switching
    switchSection(sectionId, activeLinkId) {
        document.querySelectorAll(".content > div").forEach(div => (div.style.display = "none"));
        document.querySelectorAll(".menu li").forEach(li => li.classList.remove("active"));
        document.getElementById(sectionId).style.display = "block";
        document.getElementById(activeLinkId).classList.add("active");
    }

    signOut() {
        const modal = this.modals.signOut;
        const closeModal = modal.querySelector(".outModal-close");
        const confirmButton = document.getElementById("confirmSignOut");
        const cancelButton = document.getElementById("cancelSignOut");
    
        if (modal) {
            modal.style.display = "flex"; // Open the modal
        }
    
        // Close modal when cancel button is clicked
        cancelButton?.addEventListener("click", () => {
            modal.style.display = "none";
        });
    
        // Close modal when close icon (×) is clicked
        closeModal?.addEventListener("click", () => {
            modal.style.display = "none";
        });
    
        // Redirect when confirming sign-out
        confirmButton?.addEventListener("click", () => {
            window.location.href = "welcome.html";
        });
    
        // Close modal when clicking outside the modal content
        window.addEventListener("click", (event) => {
            if (event.target === modal) {
                modal.style.display = "none";
            }
        });
    }    

    // Load data for production or shipping tables
    async loadTableData(type) {
        const endpoint = type === 'production' ? '/orders' : '/orders/completed';
        const tableBody = type === 'production' ? this.productionTableBody : this.shippingTableBody;

        try {
            const response = await fetch(`${this.apiUrl}${endpoint}`);
            if (response.ok) {
                const orders = await response.json();
                this.populateTable(tableBody, orders, type);
            } else {
                console.error(`Failed to fetch ${type} data.`);
            }
        } catch (error) {
            console.error(`Error loading ${type} data:`, error);
        }
    }

// Populate production table with order data
populateTable(tableBody, orders) {
    tableBody.innerHTML = ""; // Clear the table body before populating new data
    orders.forEach(order => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td><input type="checkbox" data-id="${order.id}"></td>
            <td>${order.orderId}</td>
            <td>${order.product}</td>
            <td>${order.quantity}</td>
            <td>${order.status}</td>
            <td>${order.orderDate || "-"}</td>
            <td>${order.dueDate || "-"}</td>
            <td>${order.priority}</td>
        `;
        tableBody.appendChild(row); // Add the row to the table
    });
}


// Open a modal for a specific action
openModal(modalName, status = null, tableBodyId = "productionTableBody") {
    this.selectedOrderId = this.getSelectedOrderId(status, tableBodyId); // Pass the appropriate table body ID
    if (this.selectedOrderId) {
        this.modals[modalName].style.display = "flex"; // Show the modal
    }
}




    // Submit order changes based on form type
    async submitOrder(event, actionType) {
        event.preventDefault();
        const formData = new FormData(this.forms[`${actionType}Order`]);
        const data = Object.fromEntries(formData.entries());
        data.id = this.selectedOrderId;

        const endpoint = `/orders/${actionType}`;
        try {
            const response = await fetch(`${this.apiUrl}${endpoint}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            if (response.ok) {
                alert(`Order ${actionType}ed successfully.`);
                this.modals[`${actionType}Order`].style.display = "none";
                this.loadTableData('production');
            } else {
                alert(`Failed to ${actionType} order.`);
            }
        } catch (error) {
            console.error(`Error ${actionType}ing order:`, error);
        }
    }

    // Track a selected order
    async trackOrder() {
        if (!this.selectedOrderId) {
            alert("Order ID is undefined. Please select an order to track.");
            return;
        }
        // Proceed with fetch if selectedOrderId is valid
        try {
            const response = await fetch(`${this.apiUrl}/orders/track/${this.selectedOrderId}`);
            
        } catch (error) {
            console.error("Error fetching tracking information:", error);
        }
    }
    

// Complete a selected order
async completeOrder() {
    this.selectedOrderId = this.getSelectedOrderId("in_progress"); // Ensure the selected order has "in_progress" status
    if (!this.selectedOrderId) {
        alert("No valid order selected for completion.");
        return; // Exit if no valid order is selected
    }

    try {
        const response = await fetch(`${this.apiUrl}/orders/complete`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: this.selectedOrderId }), // Send selected order ID in the payload
        });

        if (response.ok) {
            alert("Order marked as completed.");
            this.modals.completeOrder.style.display = "none"; // Close the modal after success
            this.loadTableData('production'); // Reload production table data
        } else {
            alert("Failed to complete order.");
        }
    } catch (error) {
        console.error("Error completing order:", error);
    }
}


// Utility to get selected order ID with optional status filter
getSelectedOrderId(status = null, tableBodyId = "productionTableBody") {
    const tableBody = document.getElementById(tableBodyId); // Use the passed table body
    const checkboxes = Array.from(tableBody.querySelectorAll('input[type="checkbox"]:checked'));

    // Check if no checkbox is selected
    if (checkboxes.length === 0) {
        alert("Please select an order.");
        return null; // Exit early if no checkbox is selected
    }

    // Ensure only one checkbox is selected
    if (checkboxes.length > 1) {
        alert("Please select only one order at a time.");
        return null; // Exit early if more than one checkbox is selected
    }

    // Validate the selected order's status
    const selectedCheckbox = checkboxes[0];
    const orderId = selectedCheckbox.dataset.id; // Get the order ID
    const orderRow = selectedCheckbox.closest("tr"); // Get the selected row
    const orderStatus = orderRow.cells[4].textContent.trim().toLowerCase();

    if (status && orderStatus !== status.toLowerCase()) {
        alert(`Please select an order with status: ${status}.`);
        return null; // Exit if status does not match
    }

    return orderId; // Return the valid order ID
}
}

// Initialize Production Dashboard on page load
document.addEventListener("DOMContentLoaded", () => {
    const apiUrl = "http://localhost:8080/api"; // Backend API URL
    const dashboard = new ProductionDashboard(apiUrl);
    dashboard.showInitialSection();
});
