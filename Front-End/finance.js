class FinanceDashboard {
    constructor(apiUrl) {
      this.apiUrl = apiUrl;
      this.initElements();
      this.initEvents();
      this.loadInitialData();
    }

    // Initialize and cache DOM elements
    initElements() {
      this.sections = {
        homeLink: 'homeSection',
        invoicesLink: 'invoicesSection',
        paymentsLink: 'paymentsSection',
        reportsLink: 'reportsSection',
      };

      // Modals
      this.paymentHistoryModal = document.getElementById('paymentHistoryModal');
      this.sendReminderModal = document.getElementById('sendReminderModal');
      this.exportInvoiceModal = document.getElementById('exportInvoiceModal');
      this.markReconciledModal = document.getElementById('markReconciledModal');
      this.refundPaymentModal = document.getElementById('refundPaymentModal');
      this.generateReceiptModal = document.getElementById('generateReceiptModal');
      this.downloadReportModal = document.getElementById('downloadReportModal');
      this.emailReportModal = document.getElementById('emailReportModal');
      this.viewReportSummaryModal = document.getElementById('viewReportSummaryModal');
      this.signOutModal = document.getElementById('signOutModal');

      // Table bodies
      this.invoiceTableBody = document.getElementById('invoiceTableBody');
      this.paymentTableBody = document.getElementById('paymentTableBody');
      this.reportTableBody = document.getElementById('reportTableBody');

      // Search inputs
      this.invoiceSearchInput = document.getElementById('invoiceSearchInput');
      this.paymentSearchInput = document.getElementById('paymentSearchInput');
      this.reportSearchInput = document.getElementById('reportSearchInput');
    }

    // Initialize event listeners
    initEvents() {
      // Section navigation
      Object.entries(this.sections).forEach(([linkId, sectionId]) => {
        document.getElementById(linkId).addEventListener('click', () =>
          this.switchSection(sectionId, linkId)
        );
      });

      // Invoice actions
      document.getElementById('viewPaymentHistory').addEventListener('click', () =>
        this.openModal(this.paymentHistoryModal)
      );
      document.getElementById('sendReminder').addEventListener('click', () =>
        this.sendReminder()
      );
      document.getElementById('exportInvoice').addEventListener('click', () =>
        this.openModal(this.exportInvoiceModal)
      );

      // Payment actions
      document.getElementById('markReconciled').addEventListener('click', () =>
        this.markAsReconciled()
      );
      document.getElementById('refundPayment').addEventListener('click', () =>
        this.openModal(this.refundPaymentModal)
      );
      document.getElementById('generateReceipt').addEventListener('click', () =>
        this.openModal(this.generateReceiptModal)
      );

      // Report actions
      document.getElementById('downloadReport').addEventListener('click', () =>
        this.openModal(this.downloadReportModal)
      );
      document.getElementById('emailReport').addEventListener('click', () =>
        this.openModal(this.emailReportModal)
      );
      document.getElementById('viewReportSummary').addEventListener('click', () =>
        this.viewReportSummary()
      );

      // Search functionality
      this.setupSearch(this.invoiceSearchInput, this.invoiceTableBody);
      this.setupSearch(this.paymentSearchInput, this.paymentTableBody);
      this.setupSearch(this.reportSearchInput, this.reportTableBody);

      // Add close functionality for modals
      document.querySelectorAll('.close, .btn-cancel').forEach(closeButton => {
        closeButton.addEventListener('click', () => {
          const modal = closeButton.closest('.modal, .outModal');
          if (modal) this.closeModal(modal);
        });
      });

      // Filters and sorting
      document.getElementById('reportTypeFilter').addEventListener('change', event => {
        this.filterTable(event.target.value, this.reportTableBody, 'type');
      });

      document.getElementById('reportSorting').addEventListener('change', event => {
        this.sortTable(event.target.value, this.reportTableBody);
      });

      // Sign-out functionality
      this.signOutButton = document.getElementById('signOut');
      this.signOutButton.addEventListener('click', () => this.signOut());
    }

    // Load initial data
    loadInitialData() {
      this.fetchDashboardData();
      this.fetchInvoices();
      this.fetchPayments();
      this.fetchReports();
    }

    // Switch between sections
    switchSection(sectionId, activeLinkId) {
      document.querySelectorAll('.content > div').forEach(div => (div.style.display = 'none'));
      document.querySelectorAll('.menu li').forEach(li => li.classList.remove('active'));
      document.getElementById(sectionId).style.display = 'block';
      document.getElementById(activeLinkId).classList.add('active');
    }

    // Open modal
    openModal(modal) {
      modal.style.display = 'flex';
    }

    // Close modal
    closeModal(modal) {
      modal.style.display = 'none';
    }

    // ====================== FETCH DATA ====================== //

    // Fetch dashboard data
    async fetchDashboardData() {
      const data = await this.fetchData('/finance-dashboard');
      if (data) this.updateDashboard(data);
    }

    // Update dashboard metrics
    updateDashboard(data) {
      document.getElementById('totalInvoices').querySelector('h1').innerText = data.totalInvoices;
      document.getElementById('pendingPayments').querySelector('h1').innerText = data.pendingPayments;
      document.getElementById('completedPayments').querySelector('h1').innerText = data.completedPayments;
    }

    // Fetch and populate invoices
    async fetchInvoices() {
      const invoices = await this.fetchData('/invoices');
      if (invoices) this.populateTable(invoices, this.invoiceTableBody);
    }

    // Fetch and populate payments
    async fetchPayments() {
      const payments = await this.fetchData('/payments');
      if (payments) this.populateTable(payments, this.paymentTableBody);
    }

    // Fetch and populate reports
    async fetchReports() {
      const reports = await this.fetchData('/reports');
      if (reports) this.populateTable(reports, this.reportTableBody);
    }

    // Populate table with data
    populateTable(data, tableBody) {
      tableBody.innerHTML = data
        .map(
          item => `
            <tr>
              <td><input type="checkbox" data-id="${item.invoiceId}"></td>
              <td>${item.invoiceId}</td>
              <td>${item.client}</td>
              <td>${item.amount}</td>
              <td>${item.status}</td>
              <td>${item.dueDate}</td>
              <td>
                <button class="btn-secondary download-btn" data-id="${item.invoiceId}">Action</button>
              </td>
            </tr>`
        )
        .join('');
    }

    // Fetch data from the API
    async fetchData(endpoint) {
      try {
        document.getElementById('loading').style.display = 'block';
        const response = await fetch(`${this.apiUrl}${endpoint}`);
        document.getElementById('loading').style.display = 'none';
        if (!response.ok) throw new Error(`Failed to fetch from ${endpoint}`);
        return await response.json();
      } catch (error) {
        console.error('Fetch error:', error);
        document.getElementById('loading').style.display = 'none';
        return null;
      }
    }

    // ====================== ACTION HANDLERS ====================== //

    // Send reminder for selected invoice
    async sendReminder() {
      const invoiceId = this.getSelectedInvoiceId();
      if (!invoiceId) {
        alert('Please select an invoice to send a reminder.');
        return;
      }
      try {
        const response = await fetch(`${this.apiUrl}/invoices/${invoiceId}/reminder`, {
          method: 'POST',
        });
        if (!response.ok) throw new Error('Failed to send reminder');
        alert('Reminder sent successfully!');
      } catch (error) {
        console.error('Send reminder error:', error);
      }
    }

    // Mark payment as reconciled
    async markAsReconciled() {
      const paymentId = this.getSelectedPaymentId();
      if (!paymentId) {
        alert('Please select a payment to mark as reconciled.');
        return;
      }
      try {
        const response = await fetch(`${this.apiUrl}/payments/${paymentId}/reconcile`, {
          method: 'POST',
        });
        if (!response.ok) throw new Error('Failed to mark payment as reconciled');
        alert('Payment marked as reconciled!');
      } catch (error) {
        console.error('Reconcile payment error:', error);
      }
    }

    // Helper to get selected invoice ID
    getSelectedInvoiceId() {
      const selected = this.invoiceTableBody.querySelector('input[type="checkbox"]:checked');
      return selected ? selected.dataset.id : null;
    }

    // Helper to get selected payment ID
    getSelectedPaymentId() {
      const selected = this.paymentTableBody.querySelector('input[type="checkbox"]:checked');
      return selected ? selected.dataset.id : null;
    }

    // ====================== REPORT SUMMARY ====================== //

    async viewReportSummary() {
        try {
          const data = await this.fetchData('/reports/summary');
          if (!data) throw new Error('No data returned from summary report API.');

          // Populate the modal with fetched data
          document.querySelector('#viewReportSummaryModal .summary-content').innerHTML = `
            <p><strong>Total Payments:</strong> ${data.totalPayments || 'N/A'}</p>
            <p><strong>Pending Invoices:</strong> ${data.pendingInvoices || 'N/A'}</p>
            <p><strong>Refunds Processed:</strong> ${data.refundsProcessed || 'N/A'}</p>
            <p><strong>Total Transactions:</strong> ${data.totalTransactions || 'N/A'}</p>`;

          // Open the modal after populating content
          this.openModal(this.viewReportSummaryModal);
        } catch (error) {
          console.error('Error fetching or displaying report summary:', error);
          alert('Failed to load report summary. Please try again later.');
        }
      }


    // ====================== SEARCH FUNCTIONALITY ====================== //

    // Setup search functionality
    setupSearch(input, tableBody) {
      input.addEventListener('input', () => {
        const query = input.value.toLowerCase();
        Array.from(tableBody.children).forEach(row => {
          row.style.display = row.innerText.toLowerCase().includes(query) ? '' : 'none';
        });
      });
    }

    // ====================== SIGN-OUT ====================== //

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

  // Initialize Finance Dashboard
  document.addEventListener('DOMContentLoaded', () => {
    const apiUrl = 'http://localhost:8080/api'; // Update with backend URL
    new FinanceDashboard(apiUrl);
  });
