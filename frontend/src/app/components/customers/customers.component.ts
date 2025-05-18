import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Customer } from '../../models/customer.model';
import { CustomerService } from '../../services/customer.service';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterModule]
})
export class CustomersComponent implements OnInit {
  customers: Customer[] = [];
  selectedCustomer: Customer | null = null;
  searchFormGroup: FormGroup;
  customerFormGroup: FormGroup;
  errorMessage: string = '';
  isEditMode: boolean = false;
  currentCustomerId?: number;
  isDetailsView: boolean = false;

  constructor(
    private customerService: CustomerService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.searchFormGroup = this.fb.group({
      keyword: ['']
    });

    this.customerFormGroup = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit(): void {
    // Check if we're in details view
    this.route.paramMap.subscribe(params => {
      const customerId = params.get('id');
      if (customerId) {
        this.isDetailsView = true;
        this.loadCustomerDetails(+customerId);
      } else {
        this.isDetailsView = false;
        this.loadCustomers();
      }
    });
  }

  loadCustomerDetails(id: number): void {
    this.customerService.getCustomer(id).subscribe({
      next: (data) => {
        this.selectedCustomer = data;
      },
      error: (err) => {
        this.errorMessage = typeof err === 'string' ? err : 'Failed to load customer details';
        console.error('Error loading customer details:', err);
      }
    });
  }

  loadCustomers(): void {
    this.customerService.getCustomers().subscribe({
      next: (data) => {
        this.customers = data;
      },
      error: (err) => {
        this.errorMessage = typeof err === 'string' ? err : 'Failed to load customers';
        console.error('Error loading customers:', err);
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
        this.errorMessage = typeof err === 'string' ? err : 'Failed to search customers';
        console.error('Error searching customers:', err);
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
          this.errorMessage = typeof err === 'string' ? err : 'Failed to delete customer';
          console.error('Error deleting customer:', err);
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
          this.errorMessage = typeof err === 'string' ? err : 'Failed to update customer';
          console.error('Error updating customer:', err);
        }
      });
    } else {
      this.customerService.saveCustomer(customer).subscribe({
        next: () => {
          this.loadCustomers();
          this.customerFormGroup.reset();
        },
        error: (err) => {
          this.errorMessage = typeof err === 'string' ? err : 'Failed to save customer';
          console.error('Error saving customer:', err);
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

  backToList(): void {
    this.router.navigate(['/customers']);
  }
}
