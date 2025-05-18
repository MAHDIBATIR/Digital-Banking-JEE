import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgChartsModule } from 'ng2-charts';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { AccountService } from '../../services/account.service';
import { CustomerService } from '../../services/customer.service';
import { AuthService } from '../../services/auth.service';
import { Customer } from '../../models/customer.model';
import { BankAccount } from '../../models/account.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, NgChartsModule]
})
export class DashboardComponent implements OnInit {
  username: string = '';
  customers: Customer[] = [];
  accounts: BankAccount[] = [];
  isAdmin: boolean = false;

  totalCustomers: number = 0;
  totalAccounts: number = 0;
  totalBalance: number = 0;

  // Account Type Distribution Chart
  accountTypeChartData: ChartConfiguration<'pie'>['data'] = {
    labels: ['Current Accounts', 'Saving Accounts'],
    datasets: [{
      data: [0, 0],
      backgroundColor: ['#4E73DF', '#1CC88A'],
      hoverBackgroundColor: ['#2E59D9', '#17A673'],
      hoverBorderColor: "rgba(234, 236, 244, 1)",
    }]
  };

  accountTypeChartOptions: ChartOptions<'pie'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Account Types Distribution'
      }
    }
  };

  // Balance Distribution Chart
  balanceChartData: ChartConfiguration<'bar'>['data'] = {
    labels: ['< $1000', '$1000-$5000', '$5000-$10000', '> $10000'],
    datasets: [{
      data: [0, 0, 0, 0],
      backgroundColor: [
        '#4E73DF',
        '#1CC88A',
        '#36B9CC',
        '#F6C23E'
      ],
      borderColor: [
        '#4E73DF',
        '#1CC88A',
        '#36B9CC',
        '#F6C23E'
      ],
      borderWidth: 1
    }]
  };

  balanceChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true
      }
    },
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: true,
        text: 'Account Balance Distribution'
      }
    }
  };

  constructor(
    private accountService: AccountService,
    private customerService: CustomerService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.username = this.authService.getUsername();
    this.isAdmin = this.authService.hasRole('ADMIN');
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    // Only load customers if user is admin
    if (this.isAdmin) {
      this.customerService.getCustomers().subscribe({
        next: (data: Customer[]) => {
          this.customers = data;
          this.totalCustomers = data.length;
        },
        error: (err: any) => {
          console.error('Error loading customers', err);
          // Handle error gracefully
          this.totalCustomers = 0;
        }
      });
    }

    // Load accounts for the current user
    this.accountService.getAllAccounts().subscribe({
      next: (data: BankAccount[]) => {
        console.log('Accounts loaded:', data);
        this.accounts = data;
        this.totalAccounts = data.length;
        this.calculateTotalBalance();
        this.updateAccountTypeChart();
        this.updateBalanceDistributionChart();
      },
      error: (err: any) => {
        console.error('Error loading accounts', err);
        // Handle error gracefully
        this.accounts = [];
        this.totalAccounts = 0;
        this.totalBalance = 0;
      }
    });
  }

  calculateTotalBalance(): void {
    this.totalBalance = this.accounts.reduce((sum, account) => sum + account.balance, 0);
  }

  updateAccountTypeChart(): void {
    const currentAccounts = this.accounts.filter(acc => acc.type === 'CurrentAccount').length;
    const savingAccounts = this.accounts.filter(acc => acc.type === 'SavingAccount').length;

    console.log('Chart data - Account types:', { currentAccounts, savingAccounts });

    // Force chart update by creating a new data array
    this.accountTypeChartData = {
      labels: ['Current Accounts', 'Saving Accounts'],
      datasets: [{
        data: [currentAccounts, savingAccounts],
        backgroundColor: ['#4E73DF', '#1CC88A'],
        hoverBackgroundColor: ['#2E59D9', '#17A673'],
        hoverBorderColor: "rgba(234, 236, 244, 1)"
      }]
    };
  }

  updateBalanceDistributionChart(): void {
    const lessThan1000 = this.accounts.filter(acc => acc.balance < 1000).length;
    const between1000And5000 = this.accounts.filter(acc => acc.balance >= 1000 && acc.balance < 5000).length;
    const between5000And10000 = this.accounts.filter(acc => acc.balance >= 5000 && acc.balance < 10000).length;
    const moreThan10000 = this.accounts.filter(acc => acc.balance >= 10000).length;

    console.log('Chart data - Balance distribution:', {
      lessThan1000,
      between1000And5000,
      between5000And10000,
      moreThan10000
    });

    // Force chart update by creating a new data array
    this.balanceChartData = {
      labels: ['< $1000', '$1000-$5000', '$5000-$10000', '> $10000'],
      datasets: [{
        data: [lessThan1000, between1000And5000, between5000And10000, moreThan10000],
        backgroundColor: [
          '#4E73DF',
          '#1CC88A',
          '#36B9CC',
          '#F6C23E'
        ],
        borderColor: [
          '#4E73DF',
          '#1CC88A',
          '#36B9CC',
          '#F6C23E'
        ],
        borderWidth: 1
      }]
    };
  }
}
