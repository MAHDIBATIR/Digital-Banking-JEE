import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { AdminGuard } from './guards/admin.guard';

// Component imports
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { CustomersComponent } from './components/customers/customers.component';
import { AccountsComponent } from './components/accounts/accounts.component';
import { AccountDetailsComponent } from './components/account-details/account-details.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';

const routes: Routes = [
  // Home route - we'll use the dashboard as our home page for authenticated users
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },

  // Auth routes
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  // Protected routes
  { path: 'customers', component: CustomersComponent, canActivate: [AuthGuard] },
  { path: 'accounts', component: AccountsComponent, canActivate: [AuthGuard] },
  { path: 'accounts/:id', component: AccountDetailsComponent, canActivate: [AuthGuard] },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },

  // Default route
  { path: '**', redirectTo: '/dashboard', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
