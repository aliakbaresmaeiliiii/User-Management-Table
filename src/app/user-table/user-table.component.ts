import { Component, OnInit, OnDestroy, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';

export interface User {
  id: number;
  name: string;
  email: string;
  age: number;
}

export interface ColumnDefinition {
  label: string;
  key: keyof User;
  cellType: 'text' | 'number';
  sortable?: boolean;
}

@Component({
  selector: 'app-user-table',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-table.component.html',
  styleUrls: ['./user-table.component.scss']
})
export class UserTableComponent implements OnInit, OnDestroy {
  // Mock data source
  private readonly mockUsers: User[] = [
    { id: 1, name: 'Alice Johnson', email: 'alice@example.com', age: 28 },
    { id: 2, name: 'Bob Smith', email: 'bob@example.com', age: 34 },
    { id: 3, name: 'Charlie Brown', email: 'charlie@example.com', age: 22 },
    { id: 4, name: 'David Wilson', email: 'david@example.com', age: 30 },
    { id: 5, name: 'Eva Adams', email: 'eva@example.com', age: 27 },
    { id: 6, name: 'Frank Miller', email: 'frank@example.com', age: 35 },
    { id: 7, name: 'Grace Lee', email: 'grace@example.com', age: 29 },
    { id: 8, name: 'Henry Ford', email: 'henry@example.com', age: 33 }
  ];

  // Column definitions
  readonly columnDefinitions: ColumnDefinition[] = [
    { label: 'Name', key: 'name', cellType: 'text', sortable: true },
    { label: 'Email', key: 'email', cellType: 'text', sortable: false },
    { label: 'Age', key: 'age', cellType: 'number', sortable: true }
  ];

  // Signals for reactive state
  private readonly destroy$ = new Subject<void>();
  readonly searchTerm = signal<string>('');
  readonly currentPage = signal<number>(1);
  readonly pageSize = signal<number>(5);
  readonly sortColumn = signal<keyof User | null>('name');
  readonly sortDirection = signal<'asc' | 'desc'>('asc');
  readonly isLoading = signal<boolean>(true);

  // Computed signals
  readonly filteredUsers = computed(() => {
    const term = this.searchTerm().toLowerCase();
    if (!term.trim()) {
      return this.mockUsers;
    }

    return this.mockUsers.filter(user =>
      user.name.toLowerCase().includes(term) ||
      user.email.toLowerCase().includes(term)
    );
  });

  readonly sortedUsers = computed(() => {
    const column = this.sortColumn();
    const direction = this.sortDirection();
    const users = [...this.filteredUsers()];

    if (!column) return users;

    return users.sort((a, b) => {
      const aValue = a[column];
      const bValue = b[column];

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return direction === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return direction === 'asc' ? aValue - bValue : bValue - aValue;
      }

      return 0;
    });
  });

  readonly paginatedUsers = computed(() => {
    const page = this.currentPage();
    const size = this.pageSize();
    const startIndex = (page - 1) * size;
    const endIndex = startIndex + size;
    return this.sortedUsers().slice(startIndex, endIndex);
  });

  readonly totalPages = computed(() => {
    return Math.ceil(this.sortedUsers().length / this.pageSize());
  });

  readonly hasPreviousPage = computed(() => this.currentPage() > 1);
  readonly hasNextPage = computed(() => this.currentPage() < this.totalPages());

  // Search subject for debouncing
  private searchSubject = new Subject<string>();

  constructor() {
    // Set up search debouncing
    this.searchSubject
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe(term => {
        this.searchTerm.set(term);
        this.currentPage.set(1); // Reset to first page when searching
      });

    // Simulate API call with loading spinner
    setTimeout(() => {
      this.isLoading.set(false);
    }, 1000);
  }

  ngOnInit(): void {
    // Initialize any additional setup if needed
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Search handling
  onSearchInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchSubject.next(input.value);
  }

  // Sorting
  toggleSort(column: keyof User): void {
    if (!this.columnDefinitions.find(col => col.key === column)?.sortable) {
      return;
    }

    if (this.sortColumn() === column) {
      // Toggle direction if same column
      this.sortDirection.set(this.sortDirection() === 'asc' ? 'desc' : 'asc');
    } else {
      // New column, default to ascending
      this.sortColumn.set(column);
      this.sortDirection.set('asc');
    }
  }

  getSortIcon(column: keyof User): string {
    if (this.sortColumn() !== column) return '↕️';
    return this.sortDirection() === 'asc' ? '↑' : '↓';
  }

  // Pagination
  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
    }
  }

  nextPage(): void {
    if (this.hasNextPage()) {
      this.currentPage.update(page => page + 1);
    }
  }

  previousPage(): void {
    if (this.hasPreviousPage()) {
      this.currentPage.update(page => page - 1);
    }
  }

  // Utility methods
  trackByUserId(index: number, user: User): number {
    return user.id;
  }

  getCellClass(column: ColumnDefinition): string {
    return `cell-${column.cellType}`;
  }

  // Math utility for template
  min(a: number, b: number): number {
    return Math.min(a, b);
  }
}
