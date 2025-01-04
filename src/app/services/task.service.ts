import {Injectable} from '@angular/core';

import {Task} from '../models/task';
import {PageTask} from "../models/pageTask";
import {BehaviorSubject, Observable} from 'rxjs';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private readonly API_URL = 'http://task.com:8080/api/v1/task/';
  dataChange: BehaviorSubject<Task[]> = new BehaviorSubject<Task[]>([]);
  // Temporarily stores data from dialogs
  constructor(
    private httpClient: HttpClient
  ) { }

  get data(): Task[] {
    return this.dataChange.value;
  }

  getTasks(pageNumber: number, pageSize: number, orderBy: string, direction: string): Observable<PageTask> {

    return this.httpClient
      .get<PageTask>(this.API_URL + "all",
        {
          params: {
            pageNumber: pageNumber,
            pageSize: pageSize,
            orderBy: orderBy,
            direction: direction
          }
        }
        );
  }

    // ADD, POST METHOD
  addTask(task: Task): void {
    this.httpClient.post(this.API_URL, task).subscribe(data => {
      // this.toasterService.showToaster('Successfully added', 3000);
      },
      (err: HttpErrorResponse) => {
      // this.toasterService.showToaster('Error occurred. Details: ' + err.name + ' ' + err.message, 8000);
    });
   }

    // UPDATE, PUT METHOD
  updateTask(task: Task): void {
    this.httpClient.put(this.API_URL + task.id, task).subscribe(data => {
        // this.toasterService.showToaster('Successfully edited', 3000);
      },
      (err: HttpErrorResponse) => {
        // this.toasterService.showToaster('Error occurred. Details: ' + err.name + ' ' + err.message, 8000);
      }
    );
  }

  // DELETE METHOD
  deleteTask(id: number): void {
    this.httpClient.delete(this.API_URL + id).subscribe(data => {
      console.log(data);
        // this.toasterService.showToaster('Successfully deleted', 3000);
      },
      (err: HttpErrorResponse) => {
        // this.toasterService.showToaster('Error occurred. Details: ' + err.name + ' ' + err.message, 8000);
      }
    );
  }

}

