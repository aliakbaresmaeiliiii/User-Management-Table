import { Injectable, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import * as TodosActions from './todos.action';
import * as TodosSelectors from './todos.selectors';
import { Todo } from './todos.models';

@Injectable({ providedIn: 'root' })
export class TodosFacade {
  private store = inject(Store);
  
  todos$: Observable<Todo[]> = this.store.select(TodosSelectors.selectAllTodos);
  completedTodos$: Observable<Todo[]> = this.store.select(TodosSelectors.selectCompletedTodos);
  activeTodos$: Observable<Todo[]> = this.store.select(TodosSelectors.selectActiveTodos);
  loading$: Observable<boolean> = this.store.select(TodosSelectors.selectTodosLoading);
  error$: Observable<string | null> = this.store.select(TodosSelectors.selectTodosError);
  todosCount$: Observable<number> = this.store.select(TodosSelectors.selectTodosCount);
  completedTodosCount$: Observable<number> = this.store.select(TodosSelectors.selectCompletedTodosCount);

  loadTodos(): void {
    this.store.dispatch(TodosActions.loadTodos());
  }

  addTodo(title: string): void {
    this.store.dispatch(TodosActions.addTodo({ title }));
  }

  toggleTodo(id: string): void {
    this.store.dispatch(TodosActions.toggleTodo({ id }));
  }

  deleteTodo(id: string): void {
    this.store.dispatch(TodosActions.deleteTodo({ id }));
  }
}
