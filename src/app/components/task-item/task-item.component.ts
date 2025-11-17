import { Component, Input, Output, EventEmitter, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { Task } from '../../models/task.model';
import { NgForm } from '@angular/forms';
import { LookupService } from '../../services/lookup.service';
import { combineLatest, Subscription } from 'rxjs';
import { Priority } from 'src/app/models/priority.model';
import { TaskStatus } from 'src/app/models/task-status.model';


@Component({
  selector: 'app-task-item',
  templateUrl: './task-item.component.html',
  styleUrls: ['./task-item.component.scss']
})
export class TaskItemComponent implements OnInit, OnDestroy {
    private lookupSub?: Subscription;
  @Input() task: Task = {} as Task;
  @Output() saved = new EventEmitter<Task>();
  @Output() cancelled = new EventEmitter<void>();

  @ViewChild('taskForm') taskForm: NgForm | undefined;

  statuses: TaskStatus[] = [];
  priorities: Priority[] = [];

  constructor(private lookupService: LookupService) {}

  ngOnInit(): void {
    this.lookupSub = combineLatest([
      this.lookupService.getStatuses(),
      this.lookupService.getPriorities()
    ]).subscribe(([statuses, priorities]) => {
      this.statuses = statuses;
      this.priorities = priorities;
      if (!this.task || !this.task.id || this.task.id === 0) {
        if (!this.task.statusId && this.statuses.length) this.task.statusId = this.statuses[0].id;
        if (!this.task.priorityId && this.priorities.length) this.task.priorityId = this.priorities[0].id;
        if (!this.task.dueDate) this.task.dueDate = new Date();
      }
    });
  }

  save() {
    if (this.taskForm?.form?.invalid) return;
    this.saved.emit(this.task);
  }

  cancel() {
    this.cancelled.emit();
  }

  updateDueDate(event: string) {
    this.task.dueDate = event ? new Date(event) : undefined;
  }

  
  ngOnDestroy(): void {
    if (this.lookupSub) {
      this.lookupSub.unsubscribe();
    }
  }
}
