import { createFeatureSelector, createSelector } from '@ngrx/store';
import { TodosState } from './todos.reducer';

export const selectTodosState = createFeatureSelector<TodosState>('todos');

export const selectAllTodos = createSelector(
  selectTodosState,
  (state) => state.todos
);

export const selectCompletedTodos = createSelector(
  selectAllTodos,
  (todos) => todos.filter(todo => todo.completed)
);

export const selectActiveTodos = createSelector(
  selectAllTodos,
  (todos) => todos.filter(todo => !todo.completed)
);

export const selectTodosLoading = createSelector(
  selectTodosState,
  (state) => state.loading
);

export const selectTodosError = createSelector(
  selectTodosState,
  (state) => state.error
);

export const selectTodosCount = createSelector(
  selectAllTodos,
  (todos) => todos.length
);

export const selectCompletedTodosCount = createSelector(
  selectCompletedTodos,
  (todos) => todos.length
);
