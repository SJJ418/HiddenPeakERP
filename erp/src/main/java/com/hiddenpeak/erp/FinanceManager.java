package com.hiddenpeak.erp;

import com.hiddenpeak.erp.dal.Invoice;
import com.hiddenpeak.erp.dal.PurchaseOrder;
import com.hiddenpeak.erp.dal.manager.DashboardData;
import com.hiddenpeak.erp.dal.production.ProductionData;
import com.hiddenpeak.erp.repository.InvoiceRepository;
import com.hiddenpeak.erp.repository.PurchaseOrderRepository;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/**
 * Manages the interactions between the REST APIs and the Invoice database
 */
@Component
@Slf4j
public class FinanceManager {

  @Autowired
  InvoiceRepository invoiceRepository;

  /**
   * Query the database for all Invoices
   * @return a List of all invoices in the database
   */
  public List<Invoice> getAllInvoices() {
    List<Invoice> invoices = new ArrayList<>();
    invoiceRepository.findAll().forEach(invoices::add);
    return invoices;
  }

  /**
   * Get the finance data statistics
   * @return a DashboardData object containing finance statistics
   */
  public DashboardData getFinanceData() {
    return new DashboardData(getAllInvoices().size(), 0, 0);
  }

}
