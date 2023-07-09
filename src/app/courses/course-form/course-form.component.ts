import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

import { CoursesService } from '../services/courses.service';

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
    private snakeBar: MatSnackBar,
    private location: Location
  ) {
    this.form = this.fb.group({
      name: [null],
      category: [null]
    });
  }

  onSubmit() {
    this.service.save(this.form.value)
      .subscribe(
        result => this.onSuccess(),
        error => this.onError()
      );
  }

  onCancel() {
    this.location.back();
  }

  private onSuccess() {
    this.location.back();
    this.snakeBar.open('Curso cadastrado com sucesso.', '', { duration: 5000 })
  }

  private onError() {
    this.snakeBar.open('Erro ao salvar curso.', '', { duration: 5000 })
  }

}
