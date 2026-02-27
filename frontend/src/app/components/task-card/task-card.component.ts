import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  OnChanges,
  OnDestroy,
  OnInit,
  output,
  signal,
  SimpleChanges,
} from '@angular/core';
import { StatusColorPipe } from '../../pipes/status-color.pipe';
import { HoverShadowDirective } from '../../directives/hover-shadow.directive';
import { Subject } from 'rxjs/internal/Subject';
import { debounceTime } from 'rxjs/internal/operators/debounceTime';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'task-card',
  standalone: true,
  imports: [CommonModule, StatusColorPipe, HoverShadowDirective],
  template: `<div
    appHoverShadow
    (click)="!isProcessing() && onCardClick($event)"
    class="group relative bg-white/5 p-4 rounded-xl border border-white/10 flex flex-col gap-2 transition-all hover:border-indigo-500/30 cursor-pointer"
  >
    @if (isProcessing()) {
      <div
        class="absolute inset-0 z-10 bg-slate-950/40 backdrop-blur-[1px] rounded-xl flex items-center justify-center animate-in fade-in duration-200"
      >
        <div
          class="w-5 h-5 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"
        ></div>
      </div>
    }
    <div class="flex justify-between items-center">
      <div class="flex-1">
        <h4
          [class]="task().status | statusColor"
          class="text-lg font-medium transition-all duration-500"
          [class.opacity-50]="task().status === 'Done'"
        >
          {{ task().title }}
        </h4>
      </div>

      <div class="flex items-center gap-3">
        <button
          (click)="$event.stopPropagation(); statusUpdate.emit(task())"
          [title]="task().status === 'Done' ? 'Mark as Pending' : 'Mark as Complete'"
          class="relative flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all duration-300 active:scale-90"
          [ngClass]="{
            'bg-emerald-500/20 border-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]':
              task().status === 'Done',
            'bg-transparent border-slate-600 hover:border-indigo-500': task().status !== 'Done',
          }"
        >
          @if (task().status === 'Done') {
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5 text-emerald-500"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clip-rule="evenodd"
              />
            </svg>
          } @else {
            <div
              class="w-2 h-2 rounded-full bg-slate-600 group-hover:bg-indigo-500 transition-colors"
            ></div>
          }
        </button>

        <button
          (click)="$event.stopPropagation(); confirmDelete()"
          class="opacity-0 group-hover:opacity-100 focus:opacity-100 p-2 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all transform hover:scale-110 active:scale-95"
          title="Delete Task"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>
      </div>
    </div>

    @if (isExpanded()) {
      <div
        class="mt-2 pt-3 border-t border-white/5 text-slate-400 text-sm animate-in fade-in slide-in-from-top-1 duration-300"
      >
        <p class="leading-relaxed">
          {{ task().description || 'No detailed objectives provided for this task.' }}
        </p>
        <div class="mt-3 flex gap-2">
          <span
            class="text-[10px] px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-slate-500 uppercase tracking-widest"
          >
            ID: {{ task()._id.slice(-6) }}
          </span>
        </div>
      </div>
    }
  </div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskCardComponent implements OnChanges, OnInit, OnDestroy {
  // old @Input & @Output approach replaced by signal based input/output for better performance and cleaner code
  //   @Input() task: any;
  //   @Output() statusUpdate = new EventEmitter<any>();
  //   @Output() deleteRequest = new EventEmitter<string>();

  private clickSubject = new Subject<string>();

  constructor() {
    this.clickSubject.pipe(debounceTime(100), takeUntilDestroyed()).subscribe((taskId) => {
      this.toggleExpand.emit(taskId);
    });
  }

  task = input.required<any>();
  // receive state from parent
  isExpanded = input<boolean>(false); // Local state to manage expansion of task details
  toggleExpand = output<string>(); // Notifies parent to change state
  statusUpdate = output<any>();
  deleteRequest = output<string>();

  // 3. Computed Signal based on Input
  // This automatically updates whenever the 'task' input changes!
  isDone = computed(() => this.task().status === 'Done');
  // 1. Local UI state for the loader
  isProcessing = signal<boolean>(false);

  onCardClick(event: Event) {
    // 2. Prevent the browser from highlighting text on rapid clicks
    event.preventDefault();
    // Prevent toggle if user is selecting text (Standard Senior UX)
    if (window.getSelection()?.toString()) return;

    // Emit the ID to the parent handleToggleExpand()
    this.toggleExpand.emit(this.task()._id);
  }

  confirmDelete() {
    if (confirm(`Are you sure you want to delete "${this.task().title}"?`)) {
      this.deleteRequest.emit(this.task()._id);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['task']) {
      console.log('Task data updated via @Input:', changes['task'].currentValue);
    }
  }

  ngOnInit() {
    console.log('Task Card initialized for:', this.task()?.title);
  }

  notifyParent() {
    this.statusUpdate.emit(this.task().title);
  }

  ngOnDestroy() {
    console.log('Cleanup: Task Card destroyed for:', this.task()?.title);
  }
}
