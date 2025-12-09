import { createAction, props } from '@ngrx/store';
import { Todo } from './todos.models';

export const addTodo = createAction(
  '[Todos] Add Todo',
  props<{ title: string }>()
);

export const toggleTodo = createAction(
  '[Todos] Toggle Todo',
  props<{ id: string }>()
);

export const deleteTodo = createAction(
  '[Todos] Delete Todo',
  props<{ id: string }>()
);

export const loadTodos = createAction('[Todos] Load Todos');
export const loadTodosSuccess = createAction(
  '[Todos] Load Todos Success',
  props<{ todos: Todo[] }>()
);
export const loadTodosFailure = createAction(
  '[Todos] Load Todos Failure',
  props<{ error: string }>()
);
