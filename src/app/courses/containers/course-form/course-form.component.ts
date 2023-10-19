import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, NonNullableFormBuilder, UntypedFormArray, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';

import { CoursesService } from '../../services/courses.service';
import { Course } from '../../model/course';
import { Lesson } from '../../model/lesson';

@Component({
  selector: 'app-course-form',
  templateUrl: './course-form.component.html',
  styleUrls: ['./course-form.component.scss']
})
export class CourseFormComponent implements OnInit {

  form!: FormGroup;

  constructor(
    private fb: NonNullableFormBuilder,
    private service: CoursesService,
    private snakeBar: MatSnackBar,
    private location: Location,
    private route: ActivatedRoute
  ) {
  }

  ngOnInit(): void {
    const course: Course = this.route.snapshot.data['course'];

    this.form = this.fb.group({
      _id: [course._id],
      name: [course.name, [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
      category: [course.category, [Validators.required]],
      lessons: this.fb.array(this.retrieveLessons(course), Validators.required)
    });
  }

  addNewLesson() {
    const lessons = this.form.get('lessons') as UntypedFormArray;
    lessons.push(this.createLesson());
  }

  removeLesson(i: number) {
    const lessons = this.form.get('lessons') as UntypedFormArray;
    lessons.removeAt(i);
  }

  getLessonsFormArray() {
    return (<UntypedFormArray>this.form.get('lessons')).controls;
  }

  private retrieveLessons(course: Course) {
    const lessons = [];
    if (course?.lessons) {
      course.lessons?.forEach(lesson => lessons.push(this.createLesson(lesson)));
    } else {
      lessons.push(this.createLesson());
    }

    return lessons;
  }

  private createLesson(lesson: Lesson = {id: '', name: '', youtubeLink: ''}) {
    return this.fb.group({
      id: [lesson.id],
      name: [lesson.name, [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
      youtubeLink: [lesson.youtubeLink, [Validators.required, Validators.minLength(11), Validators.maxLength(11)]],
    });
  }

  onSubmit() {
    if (this.form.valid) {
      this.service.save(this.form.value).subscribe({
        next: () => this.onSuccess(),
        error: () => this.onError()
      });
    } else {
      this.snakeBar.open('Formulário inválido')
    }
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

  getErrorMessage(fieldName: string) {
    const field = this.form.get(fieldName);

    if (field?.hasError('required')) {
      return 'Campo obrigatório.';
    }

    if (field?.hasError('minlength')) {
      const requiredLength = field.errors ? field.errors['minlength']['requiredLength'] : 0;
      return `O tamanho mínimo do campo é ${requiredLength} caracteres.`;
    }

    if (field?.hasError('maxlength')) {
      const requiredLength = field.errors ? field.errors['maxlength']['requiredLength'] : 0;
      return `O tamanho máximo do campo é ${requiredLength} caracteres.`;
    }

    return 'Valor inválido';
  }

  isFormArrayRequired() {
    const lessons = this.form.get('lessons') as UntypedFormArray;
    return !lessons.valid && lessons.hasError('required') && lessons.touched;
  }
}
