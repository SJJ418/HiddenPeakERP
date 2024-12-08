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
            completeOrder: document.getElementById("completeOrderDialog"),
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
        // Navigation links
        Object.entries(this.sections).forEach(([linkId, sectionId]) => {
            document.getElementById(linkId)?.addEventListener("click", () => this.switchSection(sectionId, linkId));
        });

        // Sign-out button
        this.buttons.signOut?.addEventListener("click", () => this.signOut());

        // Form submissions
        this.forms.processOrder?.addEventListener("submit", (e) => this.submitOrder(e, 'process'));
        this.forms.editOrder?.addEventListener("submit", (e) => this.submitOrder(e, 'edit'));
        this.forms.delayOrder?.addEventListener("submit", (e) => this.submitOrder(e, 'delay'));

        // Shipping section buttons
        this.buttons.shipOrder?.addEventListener("click", () => this.openModal('shippingLabel', 'completed'));
        this.buttons.editShipping?.addEventListener("click", () => this.openModal('editShipping'));
        this.buttons.cancelShipping?.addEventListener("click", () => this.openModal('cancelShipping'));
        this.buttons.tracking?.addEventListener("click", () => this.trackOrder());

        // Production section buttons
        this.buttons.processOrder?.addEventListener("click", () => this.openModal('processOrder', 'pending'));
        this.buttons.editOrder?.addEventListener("click", () => this.openModal('editOrder'));
        this.buttons.cancelOrder?.addEventListener("click", () => this.openModal('cancelOrder'));
        this.buttons.delayOrder?.addEventListener("click", () => this.openModal('delayOrder', 'in_progress'));
        this.buttons.completeOrder?.addEventListener("click", () => this.completeOrder());
    }

    // Load initial data
    loadInitialData() {
        this.loadTableData('production');
        this.loadTableData('shipping');
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

    // Populate production or shipping table
    populateTable(tableBody, orders, type) {
        tableBody.innerHTML = "";
        orders.forEach(order => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td><input type="checkbox" data-id="${order.id}"></td>
                <td>${order.orderId}</td>
                <td>${order.product}</td>
                <td>${order.quantity}</td>
                <td>${order.status}</td>
                <td>${type === 'production' ? order.orderDate : order.shippingDate || "-"}</td>
                <td>${type === 'production' ? order.dueDate : order.estimatedArrival || "-"}</td>
                <td>${order.priority}</td>
            `;
            tableBody.appendChild(row);
        });
    }

    // Open modals based on action
    openModal(modalName, status = null) {
        this.selectedOrderId = this.getSelectedOrderId(status);
        if (this.selectedOrderId) {
            this.modals[modalName].style.display = "flex";
        } else {
            alert(`Please select an order with status: ${status || 'any'}.`);
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
        try {
            const response = await fetch(`${this.apiUrl}/orders/complete`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: this.selectedOrderId }),
            });
            if (response.ok) {
                alert("Order marked as completed.");
                this.modals.completeOrder.style.display = "none";
                this.loadTableData('production');
            } else {
                alert("Failed to complete order.");
            }
        } catch (error) {
            console.error("Error completing order:", error);
        }
    }

    // Utility to get selected order ID with optional status filter
    getSelectedOrderId(status = null) {
        const checkboxes = Array.from(document.querySelectorAll('#productionTableBody input[type="checkbox"]:checked'));
        if (checkboxes.length === 1) {
            const orderId = checkboxes[0].dataset.id;
            const orderRow = checkboxes[0].closest("tr");
            const orderStatus = orderRow.cells[4].textContent.toLowerCase();
            if (!status || orderStatus === status) {
                return orderId;
            } else {
                alert(`Please select an order with status: ${status}.`);
                return null;
            }
        } else if (checkboxes.length > 1) {
            alert("Please select only one order at a time.");
        } else {
            alert("Please select an order.");
        }
        return null;
    }
}

// Initialize Production Dashboard on page load
document.addEventListener("DOMContentLoaded", () => {
    const apiUrl = "http://localhost:8080/api"; // Backend API URL
    const dashboard = new ProductionDashboard(apiUrl);
    dashboard.showInitialSection();
});
