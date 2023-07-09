import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CoursesService } from '../services/courses.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-course-form',
  templateUrl: './course-form.component.html',
  styleUrls: ['./course-form.component.scss']
})
export class CourseFormComponent {

  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private service: CoursesService,
    private snakeBar: MatSnackBar
  ) {
    this.form = this.fb.group({
      name: [null],
      category: [null]
    });
  }

  onSubmit() {
    this.service.save(this.form.value)
      .subscribe(
        result => console.log(result),
        error => this.onError()
      );
  }

  onCancel() {

  }

  onError() {
    this.snakeBar.open('Erro ao salvar curso.', '', { duration: 5000 })
  }

}
