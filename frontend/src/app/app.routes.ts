import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { AdminGuard } from './guards/admin.guard';

// Component imports
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { CustomersComponent } from './components/customers/customers.component';
import { AccountsComponent } from './components/accounts/accounts.component';
import { AccountDetailsComponent } from './components/account-details/account-details.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ProfileComponent } from './components/profile/profile.component';

export const routes: Routes = [
  // Home route - we'll use the dashboard as our home page for authenticated users
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },

  // Auth routes
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  // Admin-only routes
  { path: 'customers', component: CustomersComponent, canActivate: [AuthGuard, AdminGuard] },
  { path: 'customers/:id', component: CustomersComponent, canActivate: [AuthGuard, AdminGuard] },
  { path: 'accounts', component: AccountsComponent, canActivate: [AuthGuard, AdminGuard] },
  { path: 'accounts/:id', component: AccountDetailsComponent, canActivate: [AuthGuard, AdminGuard] },

  // Routes for all authenticated users
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },

  // Default route
  { path: '**', redirectTo: '/login', pathMatch: 'full' }
];
