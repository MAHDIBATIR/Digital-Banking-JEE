import { Customer } from './customer.model';

export interface BankAccount {
  id: string;
  balance: number;
  createdAt: Date;
  status: string;
  customerDTO: Customer;
  type: string;
}

export interface CurrentAccount extends BankAccount {
  overDraft: number;
}

export interface SavingAccount extends BankAccount {
  interestRate: number;
}
