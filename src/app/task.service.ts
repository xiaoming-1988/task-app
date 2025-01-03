import { Injectable } from '@angular/core';

import { Task } from './task';
import { Observable, of } from 'rxjs';
import { MessageService } from './message.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(
    private messageService: MessageService,
    private http: HttpClient
  ) { }

  getTasks(): Observable<Task[]> {

    const tasks = this.http
      .get<Task[]>("http://localhost:8080/api/task/all")
    this.messageService.add('TaskService: fetched tasks');

    return tasks;
  }
}

