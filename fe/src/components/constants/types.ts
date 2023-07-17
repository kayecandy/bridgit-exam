export type FinancialInfo = {
  salaryPerQuarter?: number;
  totalCreditCardDebt?: number;
  currentHomeLoanDebt?: number;
  currentCarLoanDebt?: number;
  totalSavings?: number;
  stockName?: string;
  stockQuantity?: number;
};

export type PersonalInfo = {
  firstName?: string;
  lastName?: string;
  email?: string;
  location?: string;
  dateOfBirth?: string;
  license?: File[];
};
