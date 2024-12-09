package com.hiddenpeak.erp.dal.finance;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class FinanceData {
  int totalInvoices;
  int pendingPayments;
  int completedPayments;
}