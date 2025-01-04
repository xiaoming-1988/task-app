import {Task} from "./task";

export interface PageTask {
  data: Task [];
  totalElements: number;

  direction: string;

  orderBy: string;

  pageNumber: number;

  pageSize: number;
}
