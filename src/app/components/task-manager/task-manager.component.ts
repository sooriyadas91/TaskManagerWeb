import { Component, ViewChild } from '@angular/core';
import { LazyLoadEvent, MessageService } from 'primeng/api';
import { TaskService } from '../../services/task.service';
import { TaskSearchRequest } from '../../models/task-search.model';
import { Task } from '../../models/task.model';
import { ConfirmModalComponent } from 'src/app/shared/components/confirm-modal/confirm-modal.component';
import { ToastrService } from 'ngx-toastr';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BsComponentRef } from 'ngx-bootstrap/component-loader';

@Component({
  selector: 'app-task-manager',
  templateUrl: './task-manager.component.html',
   styleUrls: ['./task-manager.component.scss']
})
export class TaskManagerComponent {
  @ViewChild('dt') table: any;
  tasks: Task[] = [];
  totalRecords = 0;
  loading = false;
  searchTerm = '';
  selectedTask?: Task;
  bsModalRef! : BsModalRef;

  constructor(private taskService: TaskService, private readonly toastr: ToastrService, private readonly modalService :BsModalService) {}

  loadTasks(event?: LazyLoadEvent) {
    this.loading = true;
    const page = (event?.first ?? 0) / (event?.rows ?? 10);
    const pageSize = event?.rows ?? 10;
    const sortField = event?.sortField ?? '';
    const sortOrder = event?.sortOrder === 1 ? 'asc' : 'desc';

    const body: TaskSearchRequest = {
      page,
      pageSize,
      sortField,
      sortOrder,
      search: this.searchTerm
    };

    this.taskService.search(body).subscribe({
      next: (res) => {
        this.tasks = res.items;
        this.totalRecords = res.totalCount;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  onSearchChange() {
    if (this.table) {
      this.table.first = 0; // reset page
      this.loadTasks();
    }
  }

  openAddTaskModal() {
    this.selectedTask = this.createEmptyTask();
  }

  editTask(task: Task) {
    this.selectedTask = { ...task };
  }

  save(task: Task) {
    if (task.id === 0) {
      this.taskService.create(task).subscribe(() => {
        this.toastr.success('Task added successfully', 'Added');
        this.loadTasks();
        this.selectedTask = undefined;
      });
    } else {
      this.taskService.update(task.id, task).subscribe(() => {
        this.toastr.success('Task updated successfully', 'Updated');
        this.loadTasks();
        this.selectedTask = undefined;
      });
    }
  }

 deleteTask(task: Task) { 
  const initialState = { message: 'Are you sure you want to delete this task?', 
  onConfirm: () => { 
      this.taskService.delete(task.id).subscribe(() => {
        this.toastr.success('Task deleted successfully', 'Deleted');
        this.loadTasks();
      });
   } 
  }; 
  this.bsModalRef = this.modalService.show(ConfirmModalComponent, { initialState });
 }

  getDueDateClass(dueDate?: Date) {
    if (!dueDate) return '';
    const today = new Date();
    const taskDate = new Date(dueDate);
    const diff = (taskDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);
    if (diff < 0) return 'text-danger';
    if (diff < 3) return 'text-warning ';
    return '';
  }
  createEmptyTask(): Task {
    return {
      id: 0,
      title: '',
      description: '',
      assignee: '',
      statusId: 0,
      priorityId: 0,
      dueDate: new Date()
    };
  }
}
