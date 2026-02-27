import { HttpClient, HttpParams } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { tap } from 'rxjs/internal/operators/tap';

export enum TaskPriority {
  LOW = 0,
  MEDIUM = 1,
  HIGH = 2,
}

// CRITICAL: This service is responsible for all interactions with the backend API related to tasks. It uses Angular's HttpClient to make HTTP requests and signals to manage the state of tasks in the UI.
@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private http = inject(HttpClient); // Inject HttpClient to make API calls
  private apiUrl = 'http://localhost:3000/tasks'; // Base URL for task-related API endpoints

  tasks = signal<any[]>([]); // Signal to hold the list of tasks, allowing components to reactively update when tasks change
  isLoading = signal<boolean>(false); // Signal to indicate loading state for better UX

  // automaticall keep track of completed tasks count using a computed signal
  completedTasksCount = computed<number>(
    () => this.tasks().filter((t) => t.status === 'Done').length,
  );

  // Derives a percentage for a progress bar
  completionPercentage = computed<number>(() => {
    const total = this.tasks().length;
    return total === 0 ? 0 : (this.completedTasksCount() / total) * 100;
  });

  getTasks() {
    this.isLoading.set(true); // Set loading state to true before making the API call
    this.http.get<any[]>(this.apiUrl).subscribe({
      next: (data) => {
        this.tasks.set(data);
      }, // Update the tasks signal with the response data
      error: (err) => {
        console.error('Error fetching tasks:', err);
      },
      complete: () => {
        this.isLoading.set(false);
      }, // Reset loading state after the API call completes
    }); // Subscribe to the observable to trigger the HTTP request and update the tasks signal with the response
  }

  addTask(task: string) {
    this.http.post(this.apiUrl, { title: task }).subscribe(() => {
      this.getTasks(); // Refresh the tasks list after adding a new task
    });
  }

  deleteTask(id: string) {
    // 1. Remove from UI immediately (Optimistic)
    this.tasks.update((allTasks) => allTasks.filter((t) => t._id !== id));

    // 2. Sync with Backend
    this.http.delete(`${this.apiUrl}/${id}`).subscribe({
      error: (err) => {
        console.error('Delete failed, refreshing list...', err);
        this.getTasks(); // If server fails, revert by fetching original data
      },
    });
  }

  toggleStatus(task: any) {
    // Toggle the status between 'Done' and 'Pending'
    const newStatus = task.status === 'Done' ? 'Pending' : 'Done';

    // 1. Update UI immediately (Optimistic)
    this.tasks.update((currentTasks) =>
      currentTasks.map((t) => (t._id === task._id ? { ...t, status: newStatus } : t)),
    );
    // 2. Sync with Backend: Send a PATCH request to update the task status in the backend. The backend will handle the logic to update the task in the database and return the updated task data if needed.
    this.http.patch(`${this.apiUrl}/${task._id}`, { status: newStatus }).subscribe({
      error: (err) => {
        console.error('Status update failed, refreshing list...', err);
        this.getTasks(); // If server fails, revert by fetching original data
      },
    });
  }

  searchTasks(term: string) {
    // If search is empty, we trigger getTasks and return an empty observable
    // because getTasks already handles the subscription/signal update internally.
    if (!term.trim()) {
      this.getTasks();
      return []; // Return empty array to satisfy switchMap
    }

    const params = new HttpParams().set('q', term);

    // We return the Observable here so switchMap in the component can manage it
    return this.http.get<any[]>(`${this.apiUrl}/search`, { params }).pipe(
      tap((results) => {
        this.tasks.set(results); // Update the signal reactively
      }),
    );
  }

  // Implement for mergemap parrallel search if needed in the future
  getTaskDetails(id: string) {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  // Implementation for concatMap (Sequential)
  updatePriority(id: string, priority: TaskPriority) {
    return this.http.patch(`${this.apiUrl}/${id}`, { priority });
  }
}
