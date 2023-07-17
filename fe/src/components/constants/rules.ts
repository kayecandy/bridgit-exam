import { VTextField } from "vuetify/lib/components/index.mjs";
import { FinancialInfo, PersonalInfo } from "./types";

export type ApiError = {
  code: string;
  message: string;
};

export const ERRORS: Record<
  keyof PersonalInfo | keyof FinancialInfo | "stockName" | "stockQuantity",
  Array<ApiError>
> = {
  // totalCreditCardDebt: ["invalid-credit-card-debt-amount-error"],
  dateOfBirth: [
    {
      code: "missing-date-of-birth-error",
      message: "Posted payload is missing date of birth",
    },
    {
      code: "invalid-applicant-age-error",
      message: "Applicant must be 18 years or older",
    },
    {
      code: "invalid-date-of-birth-error",
      message: "Date of birth must be YYYY-MM-DD format",
    },
  ],
  firstName: [
    {
      code: "invalid-first-name-length-error",
      message: "Applicant first name must be between 1 - 50 characters",
    },
    {
      code: "missing-first-name-error",
      message: "Posted payload is missing first name",
    },
  ],
  lastName: [
    {
      code: "invalid-last-name-length-error",
      message: "Applicant last name must be between 1 - 50 characters",
    },
    {
      code: "missing-last-name-error",
      message: "Posted payload is missing last name",
    },
  ],
  email: [
    {
      code: "invalid-email-length-error",
      message: "Applicant email must be between 1 - 50 characters",
    },
    {
      code: "missing-email-error",
      message: "Posted payload is missing email",
    },
    {
      code: "invalid-email-format-error",
      message: "Applicant email must be a valid format",
    },
  ],
  location: [
    {
      code: "invalid-location-length-error",
      message: "Applicant location must be between 1 - 50 characters",
    },
    {
      code: "missing-location-error",
      message: "Posted payload is missing location",
    },
  ],
  license: [
    {
      code: "invalid-license-upload-size-error",
      message: "Uploaded file must be 1000 to 5000000 bytes base64 string",
    },
    {
      code: "invalid-license-format-error",
      message: "Uploaded file must be in PNG, JPEG or GIF formats",
    },
    {
      code: "missing-license-upload-error",
      message: "Posted payload is missing license upload",
    },
  ],
  salaryPerQuarter: [
    {
      code: "missing-salary-per-quarter-error",
      message: "Posted payload is missing salary per quarter",
    },
  ],
  totalCreditCardDebt: [
    {
      code: "invalid-credit-card-debt-amount-error",
      message: "Credit card debt must be greater than or equal to 0",
    },
    {
      code: "missing-credit-card-debt-amount-error",
      message: "Posted payload is missing credit card debt amount",
    },
  ],
  currentHomeLoanDebt: [
    {
      code: "invalid-home-loan-debt-error",
      message: "Home loan debt must be greater than or equal to 0",
    },
    {
      code: "missing-home-loan-debt-error",
      message: "Posted payload is missing home loan debt amount",
    },
  ],
  currentCarLoanDebt: [
    {
      code: "invalid-car-loan-debt-error",
      message: "Car loan debt must be greater than or equal to 0",
    },
    {
      code: "missing-car-loan-debt-error",
      message: "Posted payload is missing car loan debt amount",
    },
  ],
  totalSavings: [
    {
      code: "invalid-savings-amount-error",
      message: "Savings amount must be greater than or equal to 0",
    },
    {
      code: "missing-savings-amount-error",
      message: "Posted payload is missing savings amount",
    },
  ],
  stockName: [
    {
      code: "invalid-stock-name-length-error",
      message: "Stock name must be between 1 - 50 characters",
    },
    {
      code: "invalid-stock-name-error",
      message: "Stock name must be valid",
    },
    {
      code: "missing-stock-name-error",
      message: "Posted payload is missing stock name",
    },
  ],
  stockQuantity: [
    {
      code: "invalid-stock-quantity-error",
      message: "Stock quantity must be between 1 and 1000",
    },
    {
      code: "missing-stock-quantity-error",
      message: "Posted payload is missing stock quantity",
    },
  ],
};

export type CreateRule = (
  key: keyof PersonalInfo | keyof FinancialInfo
) => VTextField["rules"];
