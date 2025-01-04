import {ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {TaskService} from './services/task.service';
import {HttpClient} from '@angular/common/http';
import {MatDialog} from '@angular/material/dialog';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {MatSort, Sort} from '@angular/material/sort';
import {Task} from './models/task';
import {DataSource} from '@angular/cdk/collections';
import {AddDialogComponent} from './dialogs/add/add.dialog.component';
import {EditDialogComponent} from './dialogs/edit/edit.dialog.component';
import {DeleteDialogComponent} from './dialogs/delete/delete.dialog.component';
import {BehaviorSubject, delay, fromEvent, merge, Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {MatTableDataSource} from "@angular/material/table";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  displayedColumns = ['id', 'name', 'type', 'done', 'priority', 'description', 'created', 'actions'];
  dataSource: MatTableDataSource<Task>;
  id: number = 1;

  constructor( private dialog: MatDialog,
              private taskService: TaskService) {

    this.dataSource = new MatTableDataSource();

  }

  @ViewChild(MatPaginator, {static: true}) private paginator!: MatPaginator;
  @ViewChild('filter',  {static: true}) filter!: ElementRef;
  @ViewChild(MatSort, { static: false }) sort!: MatSort;
  totalRecords = 0;
  pageSize = 10;
  pageNumber = 0;
  pageChangeEvent(event: PageEvent) {
    this.pageNumber = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadData();
  }

  ngOnInit() {
    this.dataSource.sort = this.sort;
    this.loadData();
  }

  addNew() {
    const dialogRef = this.dialog.open(AddDialogComponent, {
      data: {} //fixme
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 1) {
        // After dialog is closed we're doing frontend updates
        // For add we're just pushing a new row inside DataService
        this.loadData();
      }
    });
  }

  startEdit(i: number, task: Task) {
    this.id = task.id;
    const dialogRef = this.dialog.open(EditDialogComponent, {
      data: {...task}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 1) {
        this.loadData();
      }
    });
  }

  deleteItem(i: number, task: Task) {
    this.id = task.id;
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      data: task
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 1) {
        this.loadData();
      }
    });
  }
  public loadData() {
    this.taskService.getTasks(this.pageNumber, this.pageSize, this.orderBy, this.direction).subscribe(
      taskPages => {
        this.dataSource.data = taskPages?.data;
        this.totalRecords = taskPages?.totalElements;
        this.pageNumber = taskPages.pageNumber;
        this.pageSize = taskPages.pageSize;
      }
    );
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  orderBy: string = "id";
  direction: string = "DESC";
  sortData(sort: Sort) {
    if (!sort.active || sort.direction === '') {
      return;
    }
    this.orderBy = sort.active;
    this.direction = sort.direction.toUpperCase();
    this.loadData();
  }
}
