import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
// import { TaskService } from './services/task.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('frontend');
  // taskService = inject(TaskService);

  // ngOnInit() {
  //   this.taskService.getTasks();
  // }

  // handleAddTask(input: HTMLInputElement) {
  //   if (input.value.trim() !== '') {
  //     this.taskService.addTask(input.value.trim());
  //     input.value = '';// clear input after adding task
  //   }
  // }

} 