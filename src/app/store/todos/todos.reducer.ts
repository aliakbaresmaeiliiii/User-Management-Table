import { createReducer, on } from '@ngrx/store';
import { Todo } from './todos.models';
import * as TodosActions from './todos.action';

export interface TodosState {
  todos: Todo[];
  loading: boolean;
  error: string | null;
}

export const initialState: TodosState = {
  todos: [],
  loading: false,
  error: null
};

export const todosReducer = createReducer(
  initialState,
  on(TodosActions.loadTodos, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(TodosActions.loadTodosSuccess, (state, { todos }) => ({
    ...state,
    todos,
    loading: false
  })),
  on(TodosActions.loadTodosFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  on(TodosActions.addTodo, (state, { title }) => {
    const newTodo: Todo = {
      id: Date.now().toString(),
      title,
      completed: false
    };
    return {
      ...state,
      todos: [...state.todos, newTodo]
    };
  }),
  on(TodosActions.toggleTodo, (state, { id }) => ({
    ...state,
    todos: state.todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    )
  })),
  on(TodosActions.deleteTodo, (state, { id }) => ({
    ...state,
    todos: state.todos.filter(todo => todo.id !== id)
  }))
);
