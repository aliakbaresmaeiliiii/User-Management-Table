import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { Todo } from '../store/todos/todos.models';
import { TodosFacade } from '../store/todos/todos.facade';

@Component({
  selector: 'app-todos',
  imports: [CommonModule, FormsModule],
  templateUrl: './todos.html',
  styleUrl: './todos.scss',
})
export class Todos {
  private facade = inject(TodosFacade);
  
  todos$: Observable<Todo[]> = this.facade.todos$;
  loading$ = this.facade.loading$;
  newTitle = '';

  constructor() {
    this.facade.loadTodos();
  }

  add() {
    if (!this.newTitle.trim()) return;
    this.facade.addTodo(this.newTitle.trim());
    this.newTitle = '';
  }

  toggle(todo: Todo) {
    this.facade.toggleTodo(todo.id);
  }
  
  delete(todo: Todo) {
    this.facade.deleteTodo(todo.id);
  }
}
