import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { Todo } from './todos.models';

@Injectable({ providedIn: 'root' })
export class TodosService {
  private mockTodos: Todo[] = [
    { id: '1', title: 'Learn Angular', completed: true },
    { id: '2', title: 'Learn NgRx', completed: false },
    { id: '3', title: 'Build an app', completed: false }
  ];

  getTodos(): Observable<Todo[]> {
    // Simulate API call with delay
    return of([...this.mockTodos]).pipe(delay(1000));
  }

  addTodo(title: string): Observable<Todo> {
    const newTodo: Todo = {
      id: Date.now().toString(),
      title,
      completed: false
    };
    this.mockTodos.push(newTodo);
    return of(newTodo).pipe(delay(500));
  }

  toggleTodo(id: string): Observable<Todo> {
    const todo = this.mockTodos.find(t => t.id === id);
    if (todo) {
      todo.completed = !todo.completed;
    }
    return of(todo!).pipe(delay(500));
  }

  deleteTodo(id: string): Observable<boolean> {
    const index = this.mockTodos.findIndex(t => t.id === id);
    if (index > -1) {
      this.mockTodos.splice(index, 1);
      return of(true).pipe(delay(500));
    }
    return of(false).pipe(delay(500));
  }
}
