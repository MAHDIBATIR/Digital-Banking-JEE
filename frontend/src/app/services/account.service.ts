import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BankAccount, CurrentAccount, SavingAccount } from '../models/account.model';
import { AccountHistory } from '../models/operation.model';
import { OperationRequest, TransferRequest } from '../models/operation.model';
import { environment } from '../../environments/environment';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private apiUrl = `${environment.apiUrl}/accounts`;

  constructor(private http: HttpClient) { }

  getAccounts(): Observable<BankAccount[]> {
    return this.http.get<BankAccount[]>(this.apiUrl);
  }

  getAccount(id: string): Observable<BankAccount> {
    return this.http.get<BankAccount>(`${this.apiUrl}/${id}`);
  }

  getAccountHistory(accountId: string): Observable<AccountHistory> {
    return this.http.get<AccountHistory>(`${this.apiUrl}/${accountId}/pageOperations?page=0&size=10`);
  }

  getAccountHistoryByPage(accountId: string, page: number, size: number): Observable<AccountHistory> {
    return this.http.get<AccountHistory>(`${this.apiUrl}/${accountId}/pageOperations?page=${page}&size=${size}`);
  }

  debit(operationRequest: OperationRequest): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/debit`, operationRequest);
  }

  credit(operationRequest: OperationRequest): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/credit`, operationRequest);
  }

  transfer(transferRequest: TransferRequest): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/transfer`, transferRequest);
  }

  saveCurrentAccount(balance: number, overDraft: number, customerId: number): Observable<CurrentAccount> {
    return this.http.post<CurrentAccount>(
      `${this.apiUrl}/current?initialBalance=${balance}&overDraft=${overDraft}&customerId=${customerId}`,
      {}
    );
  }

  saveSavingAccount(balance: number, interestRate: number, customerId: number): Observable<SavingAccount> {
    return this.http.post<SavingAccount>(
      `${this.apiUrl}/saving?initialBalance=${balance}&interestRate=${interestRate}&customerId=${customerId}`,
      {}
    );
  }

  getAllAccounts(): Observable<Array<BankAccount>> {
    console.log('Fetching all accounts from:', this.apiUrl);
    return this.http.get<Array<BankAccount>>(this.apiUrl)
      .pipe(
        tap(accounts => console.log('Accounts response:', accounts))
      );
  }
}
