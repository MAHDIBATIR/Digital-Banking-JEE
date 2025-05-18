import { Component, OnInit } from '@angular/core';
import { ChartConfiguration, ChartData } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { CustomerService } from '../../services/customer.service';
import { AccountService } from '../../services/account.service';
import { BankAccount } from '../../models/account.model';
import { Customer } from '../../models/customer.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  customers: Customer[] = [];
  accounts: BankAccount[] = [];
  totalCustomers: number = 0;
  totalAccounts: number = 0;
  totalCurrentAccounts: number = 0;
  totalSavingAccounts: number = 0;
  totalDebitOperations: number = 0;
  totalCreditOperations: number = 0;
  isLoading: boolean = true;
  errorMessage: string = '';

  // Pie chart for account types
  public accountTypePieChartData: ChartData<'pie'> = {
    labels: ['Current Accounts', 'Saving Accounts'],
    datasets: [{
      data: [0, 0]
    }]
  };
  
  public accountTypePieChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
    }
  };
  
  // Bar chart for balance distribution
  public balanceBarChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [
      { data: [], label: 'Account Balance' }
    ]
  };
  
  public balanceBarChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true
      }
    },
    plugins: {
      legend: {
        display: true,
      }
    }
  };
  
  // Doughnut chart for operations
  public operationsDoughnutChartData: ChartData<'doughnut'> = {
    labels: ['Debit Operations', 'Credit Operations'],
    datasets: [{
      data: [0, 0]
    }]
  };
  
  public operationsDoughnutChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      }
    }
  };

  constructor(
    private customerService: CustomerService,
    private accountService: AccountService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.isLoading = true;
    
    // Load customers
    this.customerService.getCustomers().subscribe({
      next: (customers) => {
        this.customers = customers;
        this.totalCustomers = customers.length;
        
        // Load accounts
        this.accountService.getAccounts().subscribe({
          next: (accounts) => {
            this.accounts = accounts;
            this.totalAccounts = accounts.length;
            this.analyzeData();
            this.isLoading = false;
          },
          error: (err) => {
            this.errorMessage = err.message;
            this.isLoading = false;
          }
        });
      },
      error: (err) => {
        this.errorMessage = err.message;
        this.isLoading = false;
      }
    });
  }

  analyzeData(): void {
    // Count account types
    this.totalCurrentAccounts = this.accounts.filter(account => account.type === 'CurrentAccount').length;
    this.totalSavingAccounts = this.accounts.filter(account => account.type === 'SavingAccount').length;
    
    // Update account type pie chart
    this.accountTypePieChartData.datasets[0].data = [this.totalCurrentAccounts, this.totalSavingAccounts];
    
    // Prepare balance distribution data
    const customerNames: string[] = [];
    const balances: number[] = [];
    
    // Take up to 10 accounts for the bar chart
    const displayAccounts = this.accounts.slice(0, 10);
    
    displayAccounts.forEach(account => {
      const customerName = account.customerDTO?.name || 'Unknown';
      customerNames.push(`${customerName} (${account.id.substring(0, 8)}...)`);
      balances.push(account.balance);
    });
    
    this.balanceBarChartData.labels = customerNames;
    this.balanceBarChartData.datasets[0].data = balances;
    
    // For demo purposes, we'll just set some random values for operations
    // In a real app, this would come from the backend
    this.totalDebitOperations = Math.floor(Math.random() * 100) + 50;
    this.totalCreditOperations = Math.floor(Math.random() * 100) + 30;
    
    this.operationsDoughnutChartData.datasets[0].data = [this.totalDebitOperations, this.totalCreditOperations];
  }
}
