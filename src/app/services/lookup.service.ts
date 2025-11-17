import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { TaskStatus } from '../models/task-status.model';
import { Priority } from '../models/priority.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class LookupService {
  private base = `${environment.apiBaseUrl}/api/Lookups`;
  private statuses$ = new BehaviorSubject<TaskStatus[]>([]);
  private priorities$ = new BehaviorSubject<Priority[]>([]);

  constructor(private http: HttpClient) {
    this.refreshStatuses();
    this.refreshPriorities();
  }

  getStatuses(): Observable<TaskStatus[]> {
    return this.statuses$.asObservable();
  }

  refreshStatuses(): void {
    this.http.get<TaskStatus[]>(`${this.base}/statuses`).pipe(
      catchError(() => [])
    ).subscribe((statuses) => {
      this.statuses$.next(statuses);
    });
  }

  getPriorities(): Observable<Priority[]> {
    return this.priorities$.asObservable();
  }

  refreshPriorities(): void {
    this.http.get<Priority[]>(`${this.base}/priorities`).pipe(
      catchError(() => [])
    ).subscribe((priorities) => {
      this.priorities$.next(priorities);
    });
  }
}
