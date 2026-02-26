import { Component, inject, OnInit, signal } from '@angular/core';
import { TaskService } from '../../services/task.service';
import { AuthService } from '../../guards/auth.service';

@Component({
  selector: 'app-task-list',
  standalone: true, // 1. Ensure standalone is true
  imports: [], // Note: Angular 17+ Control Flow (@if/@for) doesn't need imports here!
  templateUrl: './task-list.html',
  styleUrl: './task-list.css',
})
export class TaskList implements OnInit {
  // 2. Inject services
  // public allows the HTML template to access authService.userRole()
  public authService = inject(AuthService);
  public taskService = inject(TaskService);

  ngOnInit() {
    // 3. Initial data fetch
    this.taskService.getTasks();
  }

  handleAddTask(input: HTMLInputElement) {
    const taskTitle = input.value.trim();

    if (taskTitle) {
      // 4. Pass the string to the service
      this.taskService.addTask(taskTitle);

      // 5. Clear the input field for a better User Experience
      input.value = '';
    }
  }

  handleLogout() {
    this.authService.logout(); // Assuming your authService has a logout method that clears the JWT
    // Navigate back to login
  }
}
