import {Injectable} from '@angular/core';

import {Task} from '../models/task';
import {PageTask} from "../models/pageTask";
import {BehaviorSubject, Observable} from 'rxjs';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private readonly API_URL =environment.apiUrl +  '/api/v1/task/';
  dataChange: BehaviorSubject<Task[]> = new BehaviorSubject<Task[]>([]);
  // Temporarily stores data from dialogs
  constructor(
    private httpClient: HttpClient,
    private toasterService: ToastrService
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

  addTask(task: Task): void {
    this.httpClient.post(this.API_URL, task).subscribe(data => {
      this.toasterService.success('Successfully added', "");
      },
      (err: HttpErrorResponse) => {
      this.toasterService.error('Error details: ' + err.error.details, err.error.message);
    });
   }

  updateTask(task: Task): void {
    this.httpClient.put(this.API_URL + task.id, task).subscribe(data => {
        this.toasterService.success('Successfully edited', "updated");
      },
      (err: HttpErrorResponse) => {
        this.toasterService.error('Error details: ' + err.error.details, err.error.message);
      }
    );
  }

  deleteTask(id: number): void {
    this.httpClient.delete(this.API_URL + id).subscribe(data => {
      console.log(data);
        this.toasterService.success('Successfully deleted', "delete success");
      },
      (err: HttpErrorResponse) => {
        this.toasterService.error('Error details: ' + err.error.details, err.message);
      }
    );
  }

}

