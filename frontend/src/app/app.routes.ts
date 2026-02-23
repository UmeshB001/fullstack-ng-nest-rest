import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { TaskList } from './components/task-list/task-list';
import { LoginComponent } from './components/login/login'

export const routes: Routes = [
    { path: 'tasks', component: TaskList, canActivate: [authGuard] },
    { path: 'login', component: LoginComponent },
];
