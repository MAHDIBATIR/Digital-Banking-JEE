import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { Customer } from '../models/customer.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private apiUrl = `${environment.apiUrl}/customers`;

  constructor(private http: HttpClient) { }

  getCustomers(): Observable<Customer[]> {
    console.log('Fetching all customers from:', this.apiUrl);
    return this.http.get<Customer[]>(this.apiUrl)
      .pipe(
        tap(customers => console.log('Customers loaded:', customers)),
        catchError(this.handleError)
      );
  }

  searchCustomers(keyword: string): Observable<Customer[]> {
    return this.http.get<Customer[]>(`${this.apiUrl}/search?keyword=${keyword}`)
      .pipe(catchError(this.handleError));
  }

  getCustomer(id: number): Observable<Customer> {
    console.log(`Fetching customer with ID ${id}`);
    return this.http.get<Customer>(`${this.apiUrl}/${id}`)
      .pipe(
        tap(customer => console.log('Customer details:', customer)),
        catchError(this.handleError)
      );
  }

  saveCustomer(customer: Customer): Observable<Customer> {
    return this.http.post<Customer>(this.apiUrl, customer)
      .pipe(catchError(this.handleError));
  }

  updateCustomer(customer: Customer): Observable<Customer> {
    return this.http.put<Customer>(`${this.apiUrl}/${customer.id}`, customer)
      .pipe(catchError(this.handleError));
  }

  deleteCustomer(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    console.error('API Error:', error);

    let errorMessage = 'An unknown error occurred';
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }

    return throwError(() => errorMessage);
  }
}
