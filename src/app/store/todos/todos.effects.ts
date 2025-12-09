import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import * as TodosActions from './todos.action';
import { TodosService } from './todos.service';

@Injectable()
export class TodosEffects {
  private actions$ = inject(Actions);
  private todosService = inject(TodosService);

  loadTodos$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TodosActions.loadTodos),
      switchMap(() =>
        this.todosService.getTodos().pipe(
          map(todos => TodosActions.loadTodosSuccess({ todos })),
          catchError(error => of(TodosActions.loadTodosFailure({ error: error.message })))
        )
      )
    )
  );

  addTodo$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TodosActions.addTodo),
      switchMap(({ title }) =>
        this.todosService.addTodo(title).pipe(
          map(todo => TodosActions.loadTodos()), // Reload todos after adding
          catchError(error => of(TodosActions.loadTodosFailure({ error: error.message })))
        )
      )
    )
  );

  toggleTodo$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TodosActions.toggleTodo),
      switchMap(({ id }) =>
        this.todosService.toggleTodo(id).pipe(
          map(() => TodosActions.loadTodos()), // Reload todos after toggling
          catchError(error => of(TodosActions.loadTodosFailure({ error: error.message })))
        )
      )
    )
  );

  deleteTodo$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TodosActions.deleteTodo),
      switchMap(({ id }) =>
        this.todosService.deleteTodo(id).pipe(
          map(() => TodosActions.loadTodos()), // Reload todos after deleting
          catchError(error => of(TodosActions.loadTodosFailure({ error: error.message })))
        )
      )
    )
  );
}
