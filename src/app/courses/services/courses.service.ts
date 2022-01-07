import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Course } from '../model/course';
import { delay } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CoursesService {

  private readonly API = '/assets/coursess.json';

  constructor(private httpClient: HttpClient) { }

  list() {
     return this.httpClient.get<Course[]>(this.API)
      .pipe(
        delay(5000)
      );
  }
}
