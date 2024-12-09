class ModalManager {
    // The constructor initializes the modal elements and buttons by selecting them from the DOM
    // It also registers event listeners for user interactions.
    constructor() {
        this.registrationModal = document.getElementById("registrationModal");  // Registration modal element
        this.loginModal = document.getElementById("loginModal");  // Login modal element
        this.createAccountModal = document.getElementById("createAccountModal");  // Create account modal element
        this.roleSelect = document.getElementById("roleSelect");  // Dropdown for selecting user role
        this.storeDetails = document.getElementById("storeDetails");  // Additional store details (displayed conditionally)
        this.registerButton = document.getElementById("registerButton");  // Register button for showing create account modal
        this.closeButton = document.querySelector(".closeCreate");  // Close button for closing create account modal
        this.createAccountForm = document.getElementById("createAccountForm");  // Form for creating an account
        this.loginForm = document.getElementById("loginForm");  // Form for logging in
        this.customAlert = document.getElementById("customAlert");  // Custom alert element for showing messages
        this.customAlertMessage = document.getElementById("customAlertMessage");  // Message text inside the custom alert

        // Register all event listeners to handle user interactions
        this.registerEventListeners();
    }

    // Registers event listeners for buttons, form submissions, and role selection changes
    registerEventListeners() {
        this.registerButton.addEventListener("click", () => this.showCreateAccountModal());  // Show create account modal when register button is clicked
        this.closeButton.addEventListener("click", () => this.closeCreateAccountModal());  // Close create account modal when close button is clicked
        this.roleSelect.addEventListener("change", () => this.toggleStoreDetails());  // Toggle visibility of store details based on role selection
        this.createAccountForm.addEventListener("submit", (event) => this.handleCreateAccount(event));  // Handle create account form submission
        this.loginForm.addEventListener("submit", (event) => this.handleLogin(event));  // Handle login form submission

        // Automatically show modals after a delay (2 seconds)
        setTimeout(() => this.showModals(), 2000);
    }

    // Displays the registration and login modals with a delay for smooth transitions
    showModals() {
        setTimeout(() => {
            this.registrationModal.style.display = 'block';  // Show registration modal
            this.loginModal.style.display = 'block';  // Show login modal
            setTimeout(() => {
                this.registrationModal.style.transform = 'translateX(0)';  // Animate registration modal
                this.loginModal.style.transform = 'translateX(0)';  // Animate login modal
            }, 10);
        }, 1000);  // Wait 1 second before showing modals
    }

    // Show the create account modal with a smooth animation
    showCreateAccountModal() {
        this.createAccountModal.style.display = 'block';  // Display the create account modal
        setTimeout(() => {
            this.createAccountModal.style.transform = 'translateX(0)';  // Animate the modal into view
        }, 10);
    }

    // Close the create account modal with a smooth animation
    closeCreateAccountModal() {
        this.createAccountModal.style.transform = 'translateX(100%)';  // Slide the modal out of view
        setTimeout(() => {
            this.createAccountModal.style.display = 'none';  // Hide the modal after the animation completes
        }, 750);  // Wait for the animation to finish (0.75s)
    }

    // Toggles the visibility of the store details section based on the selected role
    toggleStoreDetails() {
        this.storeDetails.style.display = this.roleSelect.value === "StoreOwner" ? 'block' : 'none';  // Show store details if "StoreOwner" is selected
    }

    // Handles the submission of the create account form by sending form data to the server
    handleCreateAccount(event) {
        event.preventDefault();  // Prevent default form submission behavior
        const formData = new FormData(this.createAccountForm);  // Gather form data
        const data = {};
        formData.forEach((value, key) => {
            data[key] = value;  // Convert form data to a simple object
        });

        // Send form data to the server using the fetch API
        fetch('http://localhost:8080/createAccount', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)  // Send form data as JSON
        })
        .then(response => {
            if (response.status == 200) {
               this.showAlert('Account created successfully!', false);  // Show success message
                this.createAccountModal.style.display = 'none';  // Hide create account modal
                this.createAccountForm.reset();  // Reset the form
                this.loginModal.style.display = 'block';  // Show login modal
            } else {
                this.showAlert('Error creating account: ' + data.message);  // Show error message
            }
        })
        .catch(error => {
            console.error('Error:', error);  // Log any error
            this.showAlert('Unable to create account. Please try again later.');  // Show a generic error message
        });
    }

    // Handles the submission of the login form by sending login credentials to the server
    handleLogin(event) {
        event.preventDefault();  // Prevent default form submission behavior
        const formData = new FormData(this.loginForm);  // Gather form data
        const data = {};
        formData.forEach((value, key) => {
            data[key] = value;  // Convert form data to a simple object
        });

        // Send login data to the server using the fetch API
        fetch('http://localhost:8080/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)  // Send login data as JSON
        })
        .then(response => {
            // Check if the request was successful
            if (!response.ok) {
                this.showAlert('Unable to sign in. Please check your credentials and try again.');  // Show error message
            } else {
                // Parse the response body based on the content type
                if (response.headers.get('Content-Type').includes('application/json')) {
                    return response.json(); // Parse as JSON
                } else if (response.headers.get('Content-Type').includes('text/plain')) {
                    return response.text(); // Parse as plain text
                } else {
                    // Handle other content types or throw an error
                    throw new Error('Unsupported content type');
                }
            }
          })
        .then(data => {
            this.redirectUser(data.role);  // Redirect the user based on their role
        })
        .catch(error => {
            console.error('Error:', error);  // Log any error
            this.showAlert('Unable to sign in. Please check your credentials and try again.');  // Show a generic error message
        });
    }

    // Redirects the user to the appropriate dashboard based on their role
    redirectUser(userRole) {
        const roleToURL = {
            Admin: 'adminDashboard.html',
            OpsManager: 'managerDashboard.html',
            Production: 'production.html',
            Finance: 'finance.html',
        };

        // Get the URL for the user's role or default to 'support.html'
        const url = roleToURL[userRole] || 'support.html';
        if (url) {
            window.location.href = url;  // Redirect the user to the dashboard
        } else {
            this.showAlert('Invalid role. Please contact support.');  // Show an alert if the role is invalid
        }
    }

    // Displays a custom alert message to the user
    showAlert(message, isError = true) {
        this.customAlertMessage.textContent = message;  // Set the alert message
        this.customAlert.style.backgroundColor = isError ? '#c0392b' : '#27ae60';  // Set alert color based on error/success
        this.customAlert.classList.remove('hidden');  // Make the alert visible
        this.customAlert.style.display = 'flex';  // Display the alert
        this.customAlert.style.opacity = 1;  // Set alert opacity

        // Hide the alert after 3 seconds
        setTimeout(() => this.hideAlert(), 3000);
    }

    // Hides the custom alert after showing it
    hideAlert() {
        this.customAlert.style.opacity = 0;  // Fade out the alert
        setTimeout(() => {
            this.customAlert.style.display = 'none';  // Hide the alert after fading out
        }, 300);
    }
}

// Initialize the ModalManager once the DOM content has fully loaded
document.addEventListener("DOMContentLoaded", () => {
    new ModalManager();
});
