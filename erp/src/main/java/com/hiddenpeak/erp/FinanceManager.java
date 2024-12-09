package com.hiddenpeak.erp;

import com.hiddenpeak.erp.dal.Invoice;
import com.hiddenpeak.erp.dal.finance.FinanceData;
import com.hiddenpeak.erp.repository.InvoiceRepository;
import java.util.ArrayList;
import java.util.List;
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
   * @return a FinanceData object containing finance statistics
   */
  public FinanceData getFinanceData() {
    return new FinanceData(getAllInvoices().size(), 0, 0);
  }

}
