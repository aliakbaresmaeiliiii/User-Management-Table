import { ScrollingModule } from '@angular/cdk/scrolling';
import { CommonModule, TitleCasePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { DeferComponent } from './defer/defer.component';
import { Repeat } from './directives/repeat';
import { GalleryComponent } from './gallery/gallery.component';
import { UserTableComponent } from './user-table/user-table.component';

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
    GalleryComponent,
    DeferComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  currentView: 'table' | 'gallery' | 'defer' = 'table';

  switchView(view: 'table' | 'gallery' | 'defer'): void {
    this.currentView = view;
  }
}
