import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule, CurrencyPipe, DatePipe, NgClass } from '@angular/common';
import { BankAccount, CurrentAccount, SavingAccount } from '../../models/account.model';
import { AccountHistory, OperationRequest, TransferRequest } from '../../models/operation.model';
import { AccountService } from '../../services/account.service';

@Component({
  selector: 'app-account-details',
  templateUrl: './account-details.component.html',
  styleUrls: ['./account-details.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    CurrencyPipe,
    DatePipe,
    NgClass
  ]
})
export class AccountDetailsComponent implements OnInit {
  accountId: string = '';
  account: BankAccount | null = null;
  accountHistory: AccountHistory | null = null;
  errorMessage: string = '';
  successMessage: string = '';
  operationFormGroup: FormGroup;
  transferFormGroup: FormGroup;
  currentPage: number = 0;
  pageSize: number = 10;
  totalPages: number = 0;
  selectedOperation: string = 'DEBIT';

  constructor(
    private route: ActivatedRoute,
    private accountService: AccountService,
    private fb: FormBuilder
  ) {
    this.operationFormGroup = this.fb.group({
      amount: ['', [Validators.required, Validators.min(1)]],
      description: ['', Validators.required]
    });

    this.transferFormGroup = this.fb.group({
      accountDestination: ['', Validators.required],
      amount: ['', [Validators.required, Validators.min(1)]],
      description: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.accountId = this.route.snapshot.params['id'];
    this.loadAccount();
    this.loadAccountHistory();
  }

  loadAccount(): void {
    this.accountService.getAccount(this.accountId).subscribe({
      next: (data) => {
        this.account = data;
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Error loading account details';
      }
    });
  }

  loadAccountHistory(): void {
    this.accountService.getAccountHistoryByPage(this.accountId, this.currentPage, this.pageSize).subscribe({
      next: (data) => {
        this.accountHistory = data;
        this.totalPages = data.totalPages;
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Error loading account operations';
      }
    });
  }

  goToPage(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page;
      this.loadAccountHistory();
    }
  }

  getPages(): number[] {
    const pages: number[] = [];
    for (let i = 0; i < this.totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }

  setOperation(operation: string): void {
    this.selectedOperation = operation;
  }

  executeOperation(): void {
    if (this.operationFormGroup.invalid) {
      return;
    }

    const operationRequest: OperationRequest = {
      accountId: this.accountId,
      amount: this.operationFormGroup.value.amount,
      description: this.operationFormGroup.value.description
    };

    if (this.selectedOperation === 'DEBIT') {
      this.accountService.debit(operationRequest).subscribe({
        next: () => {
          this.successMessage = 'Debit operation executed successfully';
          this.errorMessage = '';
          this.operationFormGroup.reset();
          this.loadAccount();
          this.loadAccountHistory();
          setTimeout(() => {
            this.successMessage = '';
          }, 3000);
        },
        error: (err) => {
          this.errorMessage = err.error?.message || 'Error executing debit operation';
          this.successMessage = '';
        }
      });
    } else if (this.selectedOperation === 'CREDIT') {
      this.accountService.credit(operationRequest).subscribe({
        next: () => {
          this.successMessage = 'Credit operation executed successfully';
          this.errorMessage = '';
          this.operationFormGroup.reset();
          this.loadAccount();
          this.loadAccountHistory();
          setTimeout(() => {
            this.successMessage = '';
          }, 3000);
        },
        error: (err) => {
          this.errorMessage = err.error?.message || 'Error executing credit operation';
          this.successMessage = '';
        }
      });
    }
  }

  executeTransfer(): void {
    if (this.transferFormGroup.invalid) {
      return;
    }

    const transferRequest: TransferRequest = {
      accountSource: this.accountId,
      accountDestination: this.transferFormGroup.value.accountDestination,
      amount: this.transferFormGroup.value.amount,
      description: this.transferFormGroup.value.description
    };

    this.accountService.transfer(transferRequest).subscribe({
      next: () => {
        this.successMessage = 'Transfer operation executed successfully';
        this.errorMessage = '';
        this.transferFormGroup.reset();
        this.loadAccount();
        this.loadAccountHistory();
        setTimeout(() => {
          this.successMessage = '';
        }, 3000);
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Error executing transfer operation';
        this.successMessage = '';
      }
    });
  }

  getAccountType(): string {
    return this.account?.type === 'CurrentAccount' ? 'Current Account' : 'Saving Account';
  }

  getOperationBadgeClass(operation: string): string {
    return operation === 'DEBIT' ? 'bg-danger' : 'bg-success';
  }

  // Get overdraft with proper type casting
  getOverDraft(): number {
    if (this.account && this.account.type === 'CurrentAccount') {
      return (this.account as CurrentAccount).overDraft;
    }
    return 0;
  }

  // Get interest rate with proper type casting
  getInterestRate(): number {
    if (this.account && this.account.type === 'SavingAccount') {
      return (this.account as SavingAccount).interestRate;
    }
    return 0;
  }
}
