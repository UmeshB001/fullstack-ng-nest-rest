import { Component, inject, OnInit, signal } from '@angular/core';
import { TaskService } from '../../services/task.service';

@Component({
  selector: 'app-task-list',
  imports: [],
  templateUrl: './task-list.html',
  styleUrl: './task-list.css',
})
export class TaskList implements OnInit {
protected readonly title = signal('frontend');
  taskService = inject(TaskService);

  ngOnInit() {
    this.taskService.getTasks();
  }

  handleAddTask(input: HTMLInputElement) {
    if (input.value.trim() !== '') {
      this.taskService.addTask(input.value.trim());
      input.value = '';// clear input after adding task
    }
  }
}
