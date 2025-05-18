import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Customer } from '../../../../../../Projet JEE/frontend/src/app/models/customer.model';
import { CustomerService } from '../../../../../../Projet JEE/frontend/src/app/services/customer.service';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss']
})
export class CustomersComponent implements OnInit {
  customers: Customer[] = [];
  searchFormGroup: FormGroup;
  customerFormGroup: FormGroup;
  errorMessage: string = '';
  isEditMode: boolean = false;
  currentCustomerId?: number;

  constructor(private customerService: CustomerService, private fb: FormBuilder) {
    this.searchFormGroup = this.fb.group({
      keyword: ['']
    });

    this.customerFormGroup = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit(): void {
    this.loadCustomers();
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

  searchCustomers(): void {
    const keyword = this.searchFormGroup.value.keyword;
    this.customerService.searchCustomers(keyword).subscribe({
      next: (data) => {
        this.customers = data;
      },
      error: (err) => {
        this.errorMessage = err.message;
      }
    });
  }

  deleteCustomer(customer: Customer): void {
    if (confirm(`Are you sure you want to delete ${customer.name}?`)) {
      this.customerService.deleteCustomer(customer.id).subscribe({
        next: () => {
          this.loadCustomers();
        },
        error: (err) => {
          this.errorMessage = err.message;
        }
      });
    }
  }

  saveCustomer(): void {
    const customer = this.customerFormGroup.value;

    if (this.isEditMode && this.currentCustomerId) {
      customer.id = this.currentCustomerId;
      this.customerService.updateCustomer(customer).subscribe({
        next: () => {
          this.loadCustomers();
          this.customerFormGroup.reset();
          this.isEditMode = false;
          this.currentCustomerId = undefined;
        },
        error: (err) => {
          this.errorMessage = err.message;
        }
      });
    } else {
      this.customerService.saveCustomer(customer).subscribe({
        next: () => {
          this.loadCustomers();
          this.customerFormGroup.reset();
        },
        error: (err) => {
          this.errorMessage = err.message;
        }
      });
    }
  }

  editCustomer(customer: Customer): void {
    this.customerFormGroup.patchValue({
      name: customer.name,
      email: customer.email
    });
    this.currentCustomerId = customer.id;
    this.isEditMode = true;
  }

  cancelEdit(): void {
    this.customerFormGroup.reset();
    this.isEditMode = false;
    this.currentCustomerId = undefined;
  }
}
