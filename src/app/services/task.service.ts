import { Injectable } from '@angular/core';
import { PagedTasks, Task } from '../models/task.model';
import { TaskSearchRequest } from '../models/task-search.model';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class TaskService {
    private readonly base = `${environment.apiBaseUrl}/api/tasks`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Task[]> {
    return this.http.get<Task[]>(this.base);
  }

  get(id: number): Observable<Task> {
    return this.http.get<Task>(`${this.base}/${id}`);
  }

  create(task: Partial<Task>): Observable<Task> {
    return this.http.post<Task>(this.base, task);
  }

  update(id: number, task: Partial<Task>): Observable<Task> {
    return this.http.put<Task>(`${this.base}/${id}`, task);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }

  getTasks(
    page: number = 0,
    pageSize: number = 10,
    sortField: string = '',
    sortOrder: string = 'asc',
    search: string = ''
  ): Observable<PagedTasks> {
    let params = new HttpParams()
      .set('page', page)
      .set('pageSize', pageSize)
      .set('sortField', sortField)
      .set('sortOrder', sortOrder);

    if (search) {
      params = params.set('search', search);
    }

    return this.http.get<PagedTasks>(this.base, { params });
  }

  

  search(body: TaskSearchRequest): Observable<PagedTasks> {
    const url = `${this.base}/search`;
     return this.http.post<PagedTasks>(url, body);
  }
}

