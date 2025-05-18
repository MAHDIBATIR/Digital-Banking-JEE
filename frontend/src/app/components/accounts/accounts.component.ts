import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BankAccount } from '../../models/account.model';
import { Customer } from '../../models/customer.model';
import { AccountService } from '../../services/account.service';
import { CustomerService } from '../../services/customer.service';

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.scss']
})
export class AccountsComponent implements OnInit {
  accounts: BankAccount[] = [];
  customers: Customer[] = [];
  errorMessage: string = '';
  successMessage: string = '';
  currentAccountForm: FormGroup;
  savingAccountForm: FormGroup;
  accountType: string = 'current';

  constructor(
    private accountService: AccountService,
    private customerService: CustomerService,
    private fb: FormBuilder
  ) {
    this.currentAccountForm = this.fb.group({
      initialBalance: [0, [Validators.required, Validators.min(0)]],
      overDraft: [0, [Validators.required, Validators.min(0)]],
      customerId: ['', Validators.required]
    });

    this.savingAccountForm = this.fb.group({
      initialBalance: [0, [Validators.required, Validators.min(0)]],
      interestRate: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
      customerId: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadAccounts();
    this.loadCustomers();
  }

  loadAccounts(): void {
    this.accountService.getAccounts().subscribe({
      next: (data) => {
        this.accounts = data;
      },
      error: (err) => {
        this.errorMessage = err.message;
      }
    });
  }

  loadCustomers(): void {
    this.customerService.getCustomers().subscribe({
      next: (data) => {
        this.customers = data;
      },
      error: (err) => {
        this.errorMessage = err.message;
      }
    });
  }

  saveCurrentAccount(): void {
    if (this.currentAccountForm.invalid) {
      return;
    }
    
    const { initialBalance, overDraft, customerId } = this.currentAccountForm.value;

    this.accountService.saveCurrentAccount(initialBalance, overDraft, customerId).subscribe({
      next: () => {
        this.successMessage = 'Current account created successfully';
        this.errorMessage = '';
        this.loadAccounts();
        this.currentAccountForm.reset({
          initialBalance: 0,
          overDraft: 0,
          customerId: ''
        });
        setTimeout(() => {
          this.successMessage = '';
        }, 3000);
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Error creating current account';
        this.successMessage = '';
      }
    });
  }

  saveSavingAccount(): void {
    if (this.savingAccountForm.invalid) {
      return;
    }
    
    const { initialBalance, interestRate, customerId } = this.savingAccountForm.value;

    this.accountService.saveSavingAccount(initialBalance, interestRate, customerId).subscribe({
      next: () => {
        this.successMessage = 'Saving account created successfully';
        this.errorMessage = '';
        this.loadAccounts();
        this.savingAccountForm.reset({
          initialBalance: 0,
          interestRate: 0,
          customerId: ''
        });
        setTimeout(() => {
          this.successMessage = '';
        }, 3000);
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Error creating saving account';
        this.successMessage = '';
      }
    });
  }

  toggleAccountType(type: string): void {
    this.accountType = type;
  }

  getAccountType(account: BankAccount): string {
    return account.type === 'CurrentAccount' ? 'Current Account' : 'Saving Account';
  }

  getAccountTypeValue(account: BankAccount): string {
    if (account.type === 'CurrentAccount') {
      return `Overdraft: ${(account as any).overDraft}`;
    } else {
      return `Interest Rate: ${(account as any).interestRate}%`;
    }
  }
}
