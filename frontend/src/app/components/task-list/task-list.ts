import { Component, effect, inject, OnInit, signal, viewChild } from '@angular/core';
import { ScrollingModule, CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { TaskPriority, TaskService } from '../../services/task.service';
import { AuthService } from '../../guards/auth.service';
import { CommonModule } from '@angular/common';
import { TaskCardComponent } from '../task-card/task-card.component';
import {
  debounce,
  distinctUntilChanged,
  Subject,
  switchMap,
  takeUntil,
  from,
  concatMap,
} from 'rxjs';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-task-list',
  standalone: true, // 1. Ensure standalone is true
  imports: [ScrollingModule, CommonModule, TaskCardComponent], // Note: Angular 17+ Control Flow (@if/@for) doesn't need imports here!
  templateUrl: './task-list.html',
  styleUrl: './task-list.css',
})
export class TaskList implements OnInit {
  viewport = viewChild(CdkVirtualScrollViewport);
  constructor() {
    effect(() => {
      const currentTasks = this.taskService.tasks();
      console.log(`Vault Synced: ${currentTasks.length} tasks recorded.`);
      localStorage.setItem('tasks', JSON.stringify(currentTasks));
    });
  }

  // 2. Inject services
  // public allows the HTML template to access authService.userRole()
  public authService = inject(AuthService);
  public taskService = inject(TaskService);

  private $destroy = new Subject<void>(); // For cleanup in ngOnDestroy
  searchControl = new FormControl(''); // For the bonus search feature

  // Track the ID of the currently expanded task (null means none are open)
  expandedTaskId = signal<string | null>(null);

  handleToggleExpand(taskId: string) {
    console.log('Clicked Task ID:', taskId);
    console.log('Current Expanded ID:', this.expandedTaskId());
    this.expandedTaskId.update((prevId) => (prevId === taskId ? null : taskId));

    // Give the DOM to animate then  tell the viewport to recalculate
    setTimeout(() => {
      this.viewport()?.checkViewportSize();
    }, 300);
  }

  ngOnInit() {
    this.taskService.getTasks();
    // 1. RxJs switchMap: Search logic
    this.searchControl.valueChanges
      .pipe(
        debounce(() => new Promise((resolve) => setTimeout(resolve, 300))), // Debounce for 300ms
        distinctUntilChanged(), // Only emit if the value has changed
        switchMap((searchTerm) => this.taskService.searchTasks(searchTerm ?? '')), // Call the search API in the service
        takeUntil(this.$destroy), // Cleanup on destroy
      )
      .subscribe();
  }

  // concatMap : Sequential Processing (e.g., updating task priorities one at a time)
  bulkUpdate(ids: string[]) {
    from(ids)
      .pipe(
        concatMap((id) => this.taskService.updatePriority(id, TaskPriority.HIGH)),
        takeUntil(this.$destroy),
      )
      .subscribe({
        next: () => console.log('Priority updated for a task'),
        error: (err) => console.error('Error updating priority:', err),
        complete: () => console.log('All priorities updated'),
      });
  }

  ngOnDestroy() {
    this.$destroy.next();
    this.$destroy.complete();
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

  // **
  //  * trackTaskById helps Angular CDK Virtual Scroll identify items.
  //  * Instead of re-creating the whole DOM, it only updates the specific task.
  //  */
  trackTaskById(index: number, task: { _id: string }): string {
    return task._id;
  }
}
