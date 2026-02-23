import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/tasks';

  tasks = signal<any[]>([]);

  getTasks() {
    this.http.get<any[]>(this.apiUrl).subscribe((data) => {
      this.tasks.set(data);
    });
  }

  addTask(task: string) {
    this.http.post(this.apiUrl, { title:task }).subscribe(() => {
      this.getTasks(); // Refresh the tasks list after adding a new task
    });
  }

  deleteTask(id: string) {
   // 1. Remove from UI immediately (Optimistic)
  this.tasks.update(allTasks => allTasks.filter(t => t._id !== id));

  // 2. Sync with Backend
  this.http.delete(`${this.apiUrl}/${id}`).subscribe({
    error: (err) => {
      console.error('Delete failed, refreshing list...', err);
      this.getTasks(); // If server fails, revert by fetching original data
    }
  });
}

toggleStatus(task: any) {
  const newStatus = task.status === 'Done' ? 'Pending' : 'Done';
  this.http.patch(`${this.apiUrl}/${task._id}`, { status: newStatus }).subscribe(() => {
    this.getTasks(); // Refresh the tasks list after toggling the status
  });
}
}
