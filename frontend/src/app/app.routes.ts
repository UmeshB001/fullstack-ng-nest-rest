import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { TaskList } from './components/task-list/task-list';
import { LoginComponent } from './components/login/login';

export const routes: Routes = [
  { path: 'tasks', component: TaskList, canActivate: [authGuard] }, // Protected route for task list, only accessible if authenticated
  { path: 'login', component: LoginComponent }, // Public route for login
  {
    path: 'register',
    loadComponent: () => import('./components/register/register').then((m) => m.RegisterComponent),
  }, // Lazy load the RegisterComponent for better performance
];
