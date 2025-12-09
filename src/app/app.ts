import { ScrollingModule } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  signal,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { UserTableComponent } from './user-table/user-table.component';
import { Todos } from './todos/todos';

interface User {
  name: string;
  email: string;
}

interface TodoItem {
  id: number;
  name: string;
}

@Component({
  selector: 'app-root',
  imports: [
    MatInputModule,
    MatIconModule,
    ScrollingModule,
    CommonModule,
    UserTableComponent,
    Todos,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  isTodoList = signal<boolean>(false);

  showTodoList() {
    this.isTodoList.set(true);
  }

  showUserTable() {
    this.isTodoList.set(false);
  }
}
