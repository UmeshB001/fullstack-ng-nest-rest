import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';

// CRITICAL: This service is responsible for all interactions with the backend API related to tasks. It uses Angular's HttpClient to make HTTP requests and signals to manage the state of tasks in the UI.
@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private http = inject(HttpClient); // Inject HttpClient to make API calls
  private apiUrl = 'http://localhost:3000/tasks'; // Base URL for task-related API endpoints

  tasks = signal<any[]>([]); // Signal to hold the list of tasks, allowing components to reactively update when tasks change

  getTasks() {
    // This method fetches the list of tasks from the backend API and updates the tasks signal with the response data. Components that subscribe to this signal will automatically update their UI when the tasks change.
    // subscribe() is necessary to actually execute the HTTP request and handle the response. Without subscribe(), the Observable returned by http.get() would not be activated, and the API call would not be made.
    this.http.get<any[]>(this.apiUrl).subscribe((data) => {
      this.tasks.set(data); // Update the tasks signal with the fetched data, triggering UI updates in any component that uses this signal
    });
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
    // Update the task status in the backend
    this.http.patch(`${this.apiUrl}/${task._id}`, { status: newStatus }).subscribe(() => {
      this.getTasks(); // Refresh the tasks list after toggling the status
    });
  }
}
