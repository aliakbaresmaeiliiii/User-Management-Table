# Angular Interview Preparation Guide

A comprehensive guide covering Angular concepts, best practices, and interview preparation strategies.

---

## Table of Contents
1. [Angular Performance Optimization](#1-angular-performance-optimization)
2. [Angular State Management](#2-angular-state-management)
3. [Angular Change Detection](#3-angular-change-detection)
4. [Standalone Components](#4-standalone-components)
5. [Angular Control Flow](#5-angular-control-flow)
6. [Angular Signals](#6-angular-signals)
7. [Angular Reactive Forms](#7-angular-reactive-forms)
8. [RxJS & Observables](#8-rxjs--observables)
9. [Web Accessibility](#9-web-accessibility)
10. [TypeScript Core Skills](#10-typescript-core-skills)
11. [SCSS/CSS](#11-scsscss)
12. [REST APIs & HTTP Handling](#12-rest-apis--http-handling)
13. [General Web Performance Optimization](#13-general-web-performance-optimization)
14. [Template Access to Observable Data](#14-template-access-to-observable-data)
15. [Reusable Modal Component](#15-reusable-modal-component)
16. [Common Tasks in ngOnDestroy](#16-common-tasks-in-ngondestroy)
17. [Practice Section](#17-practice-section)

---

## 1. Angular Performance Optimization

### Explanation
Angular performance optimization focuses on reducing bundle size, improving runtime performance, and enhancing user experience through various techniques.

### Practical Examples

```typescript
// Lazy loading modules
const routes: Routes = [
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule)
  }
];

// Using trackBy in *ngFor
@Component({
  template: `
    <div *ngFor="let item of items; trackBy: trackByFn">
      {{ item.name }}
    </div>
  `
})
export class ItemsComponent {
  items: Item[] = [];
  
  trackByFn(index: number, item: Item): number {
    return item.id; // Use unique identifier
  }
}

// OnPush change detection strategy
@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserComponent {
  @Input() user!: User;
}
```

### Real-world Scenarios
- **E-commerce site**: Lazy load product categories and admin panels
- **Dashboard application**: Use OnPush for widgets that don't change frequently
- **Large data tables**: Implement virtual scrolling and trackBy

### Best Practices
- Use lazy loading for feature modules
- Implement OnPush change detection where possible
- Use trackBy with *ngFor
- Minimize DOM manipulations
- Use pure pipes for data transformation
- Implement virtual scrolling for large lists

### Common Pitfalls
- Forgetting to unsubscribe from observables
- Using impure pipes for expensive operations
- Not using trackBy with large lists
- Overusing change detection triggers

### When to Use
- **Lazy Loading**: For feature modules not needed on initial load
- **OnPush**: For components with immutable inputs
- **trackBy**: When rendering large lists that change frequently

### Short Interview Answers
**Q: How do you optimize Angular applications?**
A: Use lazy loading, OnPush change detection, trackBy in *ngFor, minimize DOM operations, and implement proper subscription management.

**Q: What's the benefit of OnPush strategy?**
A: OnPush reduces change detection cycles by only checking when inputs change or events are triggered, improving performance.

### Advanced Notes
- Use Angular DevTools for performance profiling
- Implement route preloading strategies
- Consider using Web Workers for CPU-intensive tasks
- Use Angular's built-in performance features like `ngZone.runOutsideAngular()`

### Summary
Performance optimization is crucial for large-scale applications. Focus on bundle optimization, runtime performance, and user experience through strategic use of Angular's built-in features.

---

## 2. Angular State Management

### Explanation
State management in Angular handles application data flow and state changes. Options include services with RxJS, NGRX, and the newer Signals API.

### Practical Examples

```typescript
// Service with RxJS (BehaviorSubject)
@Injectable({ providedIn: 'root' })
export class UserService {
  private usersSubject = new BehaviorSubject<User[]>([]);
  users$ = this.usersSubject.asObservable();
  
  addUser(user: User): void {
    const current = this.usersSubject.value;
    this.usersSubject.next([...current, user]);
  }
}

// NGRX Store
export interface AppState {
  users: User[];
  loading: boolean;
}

export const loadUsers = createAction('[Users] Load Users');
export const loadUsersSuccess = createAction(
  '[Users] Load Users Success',
  props<{ users: User[] }>()
);

// Signals-based state
export class UserStore {
  private users = signal<User[]>([]);
  private loading = signal(false);
  
  readonly usersList = computed(() => this.users());
  readonly isLoading = computed(() => this.loading());
  
  addUser(user: User): void {
    this.users.update(users => [...users, user]);
  }
}
```

### Real-world Scenarios
- **Shopping cart**: Use services for simple state, NGRX for complex e-commerce
- **User authentication**: Global state for user session
- **Form state management**: Local component state vs global state

### Best Practices
- Choose state management based on complexity
- Keep state immutable
- Use selectors for derived state
- Implement proper error handling
- Test state management logic

### Common Pitfalls
- Over-engineering with NGRX for simple state
- Not handling subscription cleanup
- Mutating state directly
- Complex state transformations without selectors

### When to Use
- **Services with RxJS**: Small to medium applications
- **NGRX**: Large applications with complex state
- **Signals**: Modern Angular applications, reactive state

### Short Interview Answers
**Q: When would you choose NGRX over a service?**
A: NGRX is suitable for complex state management with multiple reducers, side effects, and time-travel debugging needs.

**Q: How do Signals compare to Observables?**
A: Signals are synchronous, simpler for local state, while Observables are better for async operations and event streams.

### Advanced Notes
- Implement state normalization for complex data
- Use entity adapters in NGRX
- Consider effects for side operations
- Implement state persistence

### Summary
Choose state management based on application complexity. Services work well for simple cases, NGRX for enterprise applications, and Signals for modern reactive approaches.

---

## 3. Angular Change Detection

### Explanation
Change detection is Angular's mechanism to update the view when data changes. Default strategy checks all components, while OnPush only checks when inputs change.

### Practical Examples

```typescript
// Default change detection
@Component({
  selector: 'app-default',
  template: `{{ counter }}`
})
export class DefaultComponent {
  counter = 0;
  
  increment(): void {
    this.counter++; // Triggers change detection
  }
}

// OnPush change detection
@Component({
  selector: 'app-onpush',
  template: `{{ user.name }}`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OnPushComponent {
  @Input() user!: User;
  
  // Only updates when input changes or event is triggered
}

// Manual change detection
@Component({
  selector: 'app-manual',
  template: `{{ data }}`
})
export class ManualComponent {
  data: any;
  
  constructor(private cdr: ChangeDetectorRef) {}
  
  updateData(newData: any): void {
    this.data = newData;
    this.cdr.detectChanges(); // Manual trigger
  }
  
  markForCheck(): void {
    this.cdr.markForCheck(); // Marks for next cycle
  }
}
```

### Real-world Scenarios
- **Dashboard widgets**: Use OnPush for static data displays
- **Real-time data**: Manual detection for external data sources
- **Form components**: Default strategy for frequent updates

### Best Practices
- Use OnPush for presentation components
- Prefer immutable data structures with OnPush
- Use manual detection sparingly
- Understand Zone.js implications

### Common Pitfalls
- Mutating objects with OnPush strategy
- Overusing manual change detection
- Not understanding Zone.js triggers
- Memory leaks from detached change detectors

### When to Use
- **Default**: Components with frequent updates
- **OnPush**: Pure presentation components
- **Manual**: External data sources, performance-critical sections

### Short Interview Answers
**Q: What triggers change detection in OnPush?**
A: Input changes, component events, async pipe updates, and manual marking.

**Q: How does Zone.js work with change detection?**
A: Zone.js monkey-patches async APIs and triggers change detection when async operations complete.

### Advanced Notes
- Use `ngZone.runOutsideAngular()` for performance-critical code
- Understand change detection trees
- Implement custom change detection strategies
- Monitor change detection cycles with Angular DevTools

### Summary
Change detection strategy choice impacts performance. Default for dynamic components, OnPush for static ones, and manual for special cases.

---

## 4. Standalone Components

### Explanation
Standalone components are self-contained Angular components that don't require NgModules, simplifying application architecture.

### Practical Examples

```typescript
// Standalone component
@Component({
  selector: 'app-user-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="user-card">
      <h3>{{ user.name }}</h3>
      <p>{{ user.email }}</p>
      <a [routerLink]="['/users', user.id]">View Profile</a>
    </div>
  `
})
export class UserCardComponent {
  @Input() user!: User;
}

// Bootstrapping standalone component
bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    importProvidersFrom(HttpClientModule)
  ]
});

// Lazy loading standalone component
const routes: Routes = [
  {
    path: 'admin',
    loadComponent: () => 
      import('./admin/admin.component').then(c => c.AdminComponent)
  }
];
```

### Real-world Scenarios
- **Micro-frontends**: Independent component development
- **Component libraries**: Self-contained reusable components
- **Migration strategy**: Gradual adoption in existing applications

### Best Practices
- Start new projects with standalone components
- Use consistent import patterns
- Leverage dependency injection with `inject()`
- Plan migration strategy for existing apps

### Common Pitfalls
- Mixing NgModule and standalone patterns inconsistently
- Forgetting to import required dependencies
- Overusing providers in component configuration

### When to Use
- **New projects**: Default to standalone architecture
- **Component libraries**: Self-contained components
- **Migration**: Gradual adoption path

### Short Interview Answers
**Q: What are the benefits of standalone components?**
A: Reduced boilerplate, simpler dependency management, better tree-shaking, and easier lazy loading.

**Q: How do you bootstrap a standalone application?**
A: Use `bootstrapApplication()` with provider configuration instead of NgModule bootstrap.

### Advanced Notes
- Use `importProvidersFrom()` for NgModule compatibility
- Implement standalone directives and pipes
- Consider impact on testing strategies
- Plan for gradual migration from NgModules

### Summary
Standalone components represent Angular's future direction, offering simpler architecture and better performance through reduced boilerplate.

---

## 5. Angular Control Flow

### Explanation
Angular's new control flow syntax provides template-based conditionals, loops, and deferred loading with better performance and type safety.

### Practical Examples

```typescript
// @if control flow
@Component({
  template: `
    @if (user) {
      <h2>Welcome, {{ user.name }}!</h2>
    } @else if (loading) {
      <p>Loading user...</p>
    } @else {
      <p>Please log in</p>
    }
  `
})

// @for control flow
@Component({
  template: `
    <ul>
      @for (item of items; track item.id) {
        <li>{{ item.name }}</li>
      } @empty {
        <li>No items found</li>
      }
    </ul>
  `
})

// @switch control flow
@Component({
  template: `
    @switch (status) {
      @case ('active') {
        <span class="active">Active</span>
      }
      @case ('inactive') {
        <span class="inactive">Inactive</span>
      }
      @default {
        <span class="unknown">Unknown</span>
      }
    }
  `
})

// @defer for lazy loading
@Component({
  template: `
    <h2>Dashboard</h2>
    
    @defer (on viewport) {
      <app-chart-component />
    } @loading (after 100ms; minimum 1s) {
      <p>Loading chart...</p>
    } @error {
      <p>Failed to load chart</p>
    }
    
    @defer (on interaction(trigger)) {
      <app-heavy-component />
    } @placeholder {
      <button #trigger>Load Heavy Component</button>
    }
  `
})
```

### Real-world Scenarios
- **Conditional UI**: Show/hide elements based on state
- **Data lists**: Render dynamic content with proper tracking
- **Lazy loading**: Defer non-critical components
- **State-based rendering**: Switch between different UI states

### Best Practices
- Always use `track` with `@for` for performance
- Use `@empty` for better user experience
- Implement proper loading and error states with `@defer`
- Prefer new syntax over structural directives

### Common Pitfalls
- Forgetting `track` in `@for` loops
- Not handling empty states
- Overusing `@defer` without considering user experience
- Missing error handling in deferred blocks

### When to Use
- **@if**: Conditional rendering
- **@for**: List rendering with tracking
- **@switch**: Multiple condition checks
- **@defer**: Performance optimization for heavy components

### Short Interview Answers
**Q: What are the benefits of new control flow syntax?**
A: Better performance, improved type checking, reduced bundle size, and more intuitive template syntax.

**Q: How does @defer improve performance?**
A: It lazy loads components only when needed, reducing initial bundle size and improving load times.

### Advanced Notes
- Combine multiple defer triggers
- Use `@defer` with `prefetch` for better UX
- Implement custom defer conditions
- Monitor lazy loading performance

### Summary
New control flow syntax provides more performant and type-safe template operations with built-in lazy loading capabilities.

---

## 6. Angular Signals

### Explanation
Signals are a new reactive primitive in Angular that provide granular reactivity, computed values, and effects for state management.

### Practical Examples

```typescript
// Basic signals
@Component({
  template: `
    <h2>Counter: {{ counter() }}</h2>
    <button (click)="increment()">Increment</button>
    
    <p>Double: {{ doubleCounter() }}</p>
  `
})
export class CounterComponent {
  counter = signal(0);
  doubleCounter = computed(() => this.counter() * 2);
  
  private logger = effect(() => {
    console.log('Counter changed:', this.counter());
  });
  
  increment(): void {
    this.counter.update(c => c + 1);
  }
}

// Signal-based service
@Injectable({ providedIn: 'root' })
export class UserService {
  private users = signal<User[]>([]);
  private loading = signal(false);
  
  readonly usersList = computed(() => this.users());
  readonly isLoading = computed(() => this.loading());
  readonly userCount = computed(() => this.users().length);
  
  loadUsers(): void {
    this.loading.set(true);
    this.http.get<User[]>('/api/users').subscribe(users => {
      this.users.set(users);
      this.loading.set(false);
    });
  }
  
  addUser(user: User): void {
    this.users.update(users => [...users, user]);
  }
}

// Signal inputs (Angular 17+)
@Component({
  template: `{{ user().name }} - {{ user().email }}`
})
export class UserProfileComponent {
  user = input.required<User>();
  isAdmin = input(false);
  
  // Computed from input
  displayName = computed(() => {
    const user = this.user();
    return this.isAdmin() ? `Admin: ${user.name}` : user.name;
  });
}
```

### Real-world Scenarios
- **Form state**: Reactive form validation and state
- **Dashboard data**: Computed values from multiple data sources
- **User preferences**: Reactive application settings
- **Real-time updates**: Live data with computed derivatives

### Best Practices
- Use signals for local component state
- Leverage computed for derived values
- Use effects for side operations (sparingly)
- Combine signals with RxJS when needed
- Prefer signal inputs for better type safety

### Common Pitfalls
- Overusing effects (can cause infinite loops)
- Not cleaning up effects properly
- Mutating signal values directly
- Mixing signals and observables inconsistently

### When to Use
- **Local state**: Component-specific reactive data
- **Computed values**: Derived state from multiple sources
- **Fine-grained reactivity**: Precise update control
- **Modern Angular**: New projects and migrations

### Short Interview Answers
**Q: How do signals differ from observables?**
A: Signals are synchronous, value-based, and granular, while observables are async, stream-based, and handle complex event flows.

**Q: When should you use computed signals?**
A: For values derived from other signals, to avoid redundant calculations and ensure consistency.

### Advanced Notes
- Combine signals with RxJS using `toSignal()` and `toObservable()`
- Implement custom signal factories
- Use effect cleanup functions
- Consider signal-based forms with model inputs

### Summary
Signals provide a modern, granular approach to reactivity in Angular, offering better performance and simpler state management for many use cases.

---

## 7. Angular Reactive Forms

### Explanation
Reactive forms provide a model-driven approach to handling form inputs, validation, and state management with strong typing and testability.

### Practical Examples

```typescript
// Basic reactive form
@Component({
  template: `
    <form [formGroup]="userForm" (ngSubmit)="onSubmit()">
      <input formControlName="name" placeholder="Name">
      <div *ngIf="name.invalid && name.touched">
        <small *ngIf="name.errors?.['required']">Name is required</small>
      </div>
      
      <input formControlName="email" placeholder="Email">
      <div *ngIf="email.invalid && email.touched">
        <small *ngIf="email.errors?.['email']">Invalid email</small>
      </div>
      
      <button type="submit" [disabled]="userForm.invalid">Submit</button>
    </form>
  `
})
export class UserFormComponent {
  userForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(2)]),
    email: new FormControl('', [Validators.required, Validators.email])
  });
  
  get name() { return this.userForm.get('name')!; }
  get email() { return this.userForm.get('email')!; }
  
  onSubmit(): void {
    if (this.userForm.valid) {
      console.log(this.userForm.value);
    }
  }
}

// Form arrays for dynamic fields
@Component({
  template: `
    <form [formGroup]="surveyForm">
      <div formArrayName="questions">
        <div *ngFor="let question of questions.controls; let i = index" [formGroupName]="i">
          <input formControlName="text" placeholder="Question {{i + 1}}">
          <button (click)="removeQuestion(i)">Remove</button>
        </div>
      </div>
      <button (click)="addQuestion()">Add Question</button>
    </form>
  `
})
export class SurveyComponent {
  surveyForm = new FormGroup({
    questions: new FormArray([])
  });
  
  get questions() { return this.surveyForm.get('questions') as FormArray; }
  
  addQuestion(): void {
    this.questions.push(new FormGroup({
      text: new FormControl('', Validators.required)
    }));
  }
  
  removeQuestion(index: number): void {
    this.questions.removeAt(index);
  }
}

// Custom validators
export function passwordStrengthValidator(control: AbstractControl): ValidationErrors | null {
  const value = control.value;
  if (!value) return null;
  
  const hasUpperCase = /[A-Z]/.test(value);
  const hasLowerCase = /[a-z]/.test(value);
  const hasNumeric = /[0-9]/.test(value);
  const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value);
  
  const valid = hasUpperCase && hasLowerCase && hasNumeric && hasSpecial && value.length >= 8;
  
  return valid ? null : { passwordStrength: true };
}
```

### Real-world Scenarios
- **User registration**: Complex validation with cross-field checks
- **Dynamic surveys**: Form arrays for variable number of questions
- **Multi-step wizards**: Form state persistence between steps
- **Admin panels**: Complex data entry with conditional fields

### Best Practices
- Use reactive forms for complex forms
- Implement custom validators for business logic
- Use FormBuilder for cleaner syntax
- Handle form state properly (pristine, touched, dirty)
- Test form validation logic

### Common Pitfalls
- Not handling form state changes properly
- Overcomplicating form validation
- Not cleaning up form subscriptions
- Missing accessibility features

### When to Use
- **Complex forms**: Multi-field, dynamic, conditional logic
- **Strong validation**: Custom business rules
- **Testability**: Unit testing form logic
- **Reactive patterns**: Integration with RxJS

### Short Interview Answers
**Q: When would you choose reactive forms over template-driven?**
A: Reactive forms are better for complex forms, dynamic field generation, custom validation, and when you need strong typing and testability.

**Q: How do you handle cross-field validation?**
A: Create custom validators at the form group level that check multiple form controls.

### Advanced Notes
- Implement async validators for server-side validation
- Use ControlValueAccessor for custom form controls
- Implement form state persistence
- Handle form arrays with complex data structures

### Summary
Reactive forms provide a robust, testable approach to form handling with strong typing and flexible validation capabilities.

---

## 8. RxJS & Observables

### Explanation
RxJS is a library for reactive programming using observables, providing powerful operators for handling asynchronous operations and event streams.

### Practical Examples

```typescript
// Basic observable usage
@Component({
  template: `
    <div *ngFor="let user of users$ | async">
      {{ user.name }}
    </div>
  `
})
export class UsersComponent {
  users$ = this.userService.getUsers().pipe(
    catchError(error => {
      console.error('Error loading users:', error);
      return of([]);
    })
  );
  
  constructor(private userService: UserService) {}
}

// Hot vs Cold observables
export class DataService {
  // Cold observable - creates new execution for each subscriber
  coldData$ = this.http.get('/api/data');
  
  // Hot observable - shares execution between subscribers
  private dataSubject = new BehaviorSubject<any>(null);
  hotData$ = this.dataSubject.asObservable();
  
  loadData(): void {
    this.http.get('/api/data').subscribe(data => {
      this.dataSubject.next(data);
    });
  }
}

// Common operators
@Component({})
export class SearchComponent {
  searchTerm = new FormControl('');
  
  results$ = this.searchTerm.valueChanges.pipe(
    debounceTime(300), // Wait for typing to stop
    distinctUntilChanged(), // Only emit if value changed
    filter(term => term.length > 2), // Minimum length
    switchMap(term => this.searchService.search(term)), // Cancel previous
    catchError(() => of([])) // Handle errors
  );
}

// Combining multiple streams
@Component({})
export class DashboardComponent {
  user$ = this.userService.currentUser$;
  notifications$ = this.notificationService.notifications$;
  
  dashboardData$ = combineLatest([this.user$, this.notifications$]).pipe(
    map(([user, notifications]) => ({
      user,
      notifications: notifications.filter(n => n.userId === user.id)
    }))
  );
}
```

### Real-world Scenarios
- **Search functionality**: Debounced input with API calls
- **Real-time data**: WebSocket connections with reconnection logic
- **Form validation**: Async validators with API checks
- **Data caching**: Share data between multiple components

### Best Practices
- Use appropriate operators for the use case
- Handle subscription cleanup
- Implement error handling
- Use TypeScript for type safety
- Test observable chains

### Common Pitfalls
- Memory leaks from unsubscribed observables
- Incorrect operator usage (switchMap vs mergeMap)
- Not handling errors properly
- Overcomposing observable chains

### When to Use
- **Async operations**: HTTP requests, timers, events
- **Event streams**: User interactions, WebSocket messages
- **Data transformation**: Complex data processing pipelines
- **State management**: Reactive data flows

### Short Interview Answers
**Q: What's the difference between switchMap and mergeMap?**
A: switchMap cancels previous inner observables, while mergeMap processes all concurrently. Use switchMap for search, mergeMap for parallel requests.

**Q: How do you prevent memory leaks with observables?**
A: Use async pipe in templates, takeUntil pattern, or explicit unsubscribe in ngOnDestroy.

### Advanced Notes
- Implement custom operators
- Use Subjects for imperative event emission
- Handle backpressure with buffering operators
- Implement retry logic with exponential backoff

### Summary
RxJS provides powerful tools for handling asynchronous operations and event streams, with operators that enable complex data transformation and flow control.

---

## 9. Web Accessibility

### Explanation
Web accessibility ensures that web applications are usable by people with disabilities, following WCAG guidelines and best practices.

### Practical Examples

```typescript
// Accessible form component
@Component({
  template: `
    <form (ngSubmit)="onSubmit()" #form="ngForm">
      <div class="form-group">
        <label for="username">Username</label>
        <input 
          id="username"
          name="username" 
          [(ngModel)]="user.username"
          required
          aria-required="true"
          aria-describedby="username-help"
          #username="ngModel">
        
        <div id="username-help" class="help-text">
          Enter your username
        </div>
        
        <div *ngIf="username.invalid && username.touched" 
             role="alert" 
             aria-live="polite">
          <span *ngIf="username.errors?.['required']">
            Username is required
          </span>
        </div>
      </div>
      
      <button type="submit" [disabled]="form.invalid">
        Submit
      </button>
    </form>
  `
})

// Accessible modal component
@Component({
  template: `
    <div class="modal-overlay" 
         role="dialog" 
         aria-modal="true"
         aria-labelledby="modal-title"
         (keydown.escape)="close()">
      
      <div class="modal-content" role="document">
        <h2 id="modal-title">{{ title }}</h2>
        
        <button class="close-button" 
                (click)="close()"
                aria-label="Close modal">
          ×
        </button>
        
        <ng-content></ng-content>
      </div>
    </div>
  `
})

// Keyboard navigation
@Component({
  template: `
    <div class="dropdown" #dropdown>
      <button (click)="toggle()" 
              (keydown.arrowdown)="focusNext()"
              (keydown.arrowup)="focusPrev()"
              aria-expanded="isOpen"
              aria-haspopup="listbox">
        Select Option
      </button>
      
      <ul *ngIf="isOpen" 
          role="listbox"
          (keydown.escape)="close()">
        <li *ngFor="let option of options; let i = index"
            role="option"
            [attr.aria-selected]="selectedIndex === i"
            (click)="select(i)"
            (keydown.enter)="select(i)"
            #optionItem>
          {{ option }}
        </li>
      </ul>
    </div>
  `
})
```

### Real-world Scenarios
- **Government websites**: Legal compliance requirements
- **E-commerce**: Accessible product browsing and checkout
- **Banking applications**: Financial accessibility
- **Educational platforms**: Accessible learning materials

### Best Practices
- Use semantic HTML elements
- Implement proper ARIA attributes
- Ensure keyboard navigation
- Provide text alternatives for images
- Maintain sufficient color contrast
- Test with screen readers

### Common Pitfalls
- Missing form labels
- Insufficient color contrast
- Poor keyboard navigation
- Missing ARIA attributes
- Not testing with assistive technologies

### When to Use
- **All applications**: Basic accessibility is mandatory
- **Public facing**: Legal compliance requirements
- **Enterprise**: Corporate accessibility standards
- **Government**: Section 508 compliance

### Short Interview Answers
**Q: What are the key principles of WCAG?**
A: Perceivable, Operable, Understandable, and Robust (POUR) - ensuring content is accessible to all users.

**Q: How do you test for accessibility?**
A: Use automated tools like axe-core, manual testing with screen readers, keyboard navigation testing, and color contrast checkers.

### Advanced Notes
- Implement focus management for modals and dialogs
- Use ARIA live regions for dynamic content
- Handle complex widget patterns (tabs, accordions)
- Consider cognitive accessibility

### Summary
Accessibility is not optional - it's a fundamental requirement for inclusive web applications. Follow WCAG guidelines and test thoroughly with assistive technologies.

---

## 10. TypeScript Core Skills

### Explanation
TypeScript enhances JavaScript with static typing, interfaces, generics, and advanced type features for better code quality and developer experience.

### Practical Examples

```typescript
// Interfaces and types
interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'moderator';
}

type UserForm = Omit<User, 'id'> & {
  password: string;
  confirmPassword: string;
};

// Generics
interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
}

class DataService<T> {
  constructor(private endpoint: string) {}
  
  getItem(id: number): Observable<ApiResponse<T>> {
    return this.http.get<ApiResponse<T>>(`${this.endpoint}/${id}`);
  }
}

// Utility types
type PartialUser = Partial<User>;
type ReadonlyUser = Readonly<User>;
type UserKeys = keyof User;

// Advanced types
type Theme = 'light' | 'dark' | 'auto';
type Size = 'sm' | 'md' | 'lg' | 'xl';

interface ComponentProps {
  theme: Theme;
  size: Size;
  disabled?: boolean;
}

// Conditional types
type NonNullableUser = NonNullable<User>;
type UserPropertyTypes = {
  [K in keyof User]: User[K];
};

// Function overloading
function processData(data: string): string;
function processData(data: number): number;
function processData(data: string | number): string | number {
  if (typeof data === 'string') {
    return data.toUpperCase();
  }
  return data * 2;
}
```

### Real-world Scenarios
- **API integration**: Strongly typed API responses
- **Form handling**: Type-safe form data structures
- **Component libraries**: Generic reusable components
- **State management**: Typed state and actions

### Best Practices
- Enable strict mode in tsconfig
- Use interfaces for object shapes
- Leverage utility types
- Implement proper type guards
- Use generics for reusable code

### Common Pitfalls
- Using `any` type excessively
- Not leveraging TypeScript's advanced features
- Poor type definitions
- Ignoring compiler warnings

### When to Use
- **All Angular projects**: TypeScript is the standard
- **Large codebases**: Better maintainability
- **Team development**: Improved collaboration
- **Complex logic**: Type safety benefits

### Short Interview Answers
**Q: What's the difference between interface and type?**
A: Interfaces are extendable and can be merged, while type aliases can represent union types and are more flexible for complex type operations.

**Q: How do generics improve code?**
A: Generics provide type safety while maintaining flexibility, allowing reusable code that works with multiple types.

### Advanced Notes
- Use conditional types for complex type logic
- Implement mapped types for transformation
- Use template literal types
- Leverage declaration merging

### Summary
TypeScript's type system provides powerful tools for building robust, maintainable applications with excellent developer experience and compile-time safety.

---

## 11. SCSS/CSS

### Explanation
SCSS (Sassy CSS) extends CSS with variables, nesting, mixins, and functions, enabling more maintainable and organized stylesheets.

### Practical Examples

```scss
// Variables and mixins
$primary-color: #007bff;
$secondary-color: #6c757d;
$border-radius: 4px;

@mixin button-variant($background, $color: white) {
  background-color: $background;
  color: $color;
  border: 1px solid darken($background, 10%);
  
  &:hover {
    background-color: darken($background, 10%);
  }
}

// BEM methodology
.user-card {
  &__header {
    padding: 1rem;
    border-bottom: 1px solid #eee;
    
    &--featured {
      background-color: #f8f9fa;
    }
  }
  
  &__body {
    padding: 1rem;
  }
  
  &__footer {
    padding: 1rem;
    border-top: 1px solid #eee;
  }
}

// Flexbox layout
.container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  
  .header {
    flex: 0 0 auto;
  }
  
  .main {
    flex: 1 1 auto;
    display: flex;
    
    .sidebar {
      flex: 0 0 250px;
    }
    
    .content {
      flex: 1 1 auto;
    }
  }
  
  .footer {
    flex: 0 0 auto;
  }
}

// CSS Grid layout
.dashboard {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
  padding: 1rem;
  
  .widget {
    background: white;
    border-radius: $border-radius;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    padding: 1rem;
    
    &--large {
      grid-column: span 2;
    }
  }
}

// Responsive design
@mixin respond-to($breakpoint) {
  @if $breakpoint == 'mobile' {
    @media (max-width: 767px) { @content; }
  }
  @if $breakpoint == 'tablet' {
    @media (min-width: 768px) and (max-width: 1023px) { @content; }
  }
  @if $breakpoint == 'desktop' {
    @media (min-width: 1024px) { @content; }
  }
}

.component {
  padding: 1rem;
  
  @include respond-to('mobile') {
    padding: 0.5rem;
  }
}

// Angular 20+ CSS isolation with @Component styles
@Component({
  selector: 'app-user-card',
  standalone: true,
  template: `
    <div class="card">
      <h3>{{ user.name }}</h3>
      <p>{{ user.email }}</p>
    </div>
  `,
  styles: `
    .card {
      border: 1px solid #ddd;
      border-radius: 8px;
      padding: 1rem;
      margin: 1rem 0;
      
      h3 {
        margin: 0 0 0.5rem 0;
        color: #333;
      }
      
      p {
        margin: 0;
        color: #666;
      }
    }
  `
})
export class UserCardComponent {
  @Input() user!: User;
}
```

### Real-world Scenarios
- **Design systems**: Consistent styling across components
- **Responsive layouts**: Mobile-first design approach
- **Theme management**: CSS variables for dynamic theming
- **Component libraries**: Reusable styled components

### Best Practices
- Use CSS Grid for complex layouts
- Implement Flexbox for component alignment
- Follow BEM methodology for class naming
- Use CSS variables for theming
- Leverage SCSS features for maintainability

### Common Pitfalls
- Over-nesting in SCSS
- Not using CSS Grid/Flexbox appropriately
- Poor class naming conventions
- Not considering mobile responsiveness

### When to Use
- **CSS Grid**: Complex two-dimensional layouts
- **Flexbox**: One-dimensional component alignment
- **SCSS**: Large projects with complex styling needs
- **CSS Modules**: Component-scoped styles

### Short Interview Answers
**Q: What's the difference between CSS Grid and Flexbox?**
A: Grid is for two-dimensional layouts (rows and columns), while Flexbox is for one-dimensional layouts (either row or column).

**Q: How do you handle responsive design in Angular?**
A: Use CSS media queries, Angular's BreakpointObserver, and responsive CSS Grid/Flexbox layouts.

### Advanced Notes
- Use CSS custom properties (variables) for theming
- Implement CSS-in-JS approaches when needed
- Leverage Angular's style encapsulation
- Consider CSS containment for performance

### Summary
Modern CSS with SCSS provides powerful tools for creating maintainable, responsive, and performant user interfaces in Angular applications.

---

## 12. REST APIs & HTTP Handling

### Explanation
Angular's HttpClient provides a powerful way to interact with REST APIs, with features for interceptors, error handling, and request/response transformation.

### Practical Examples

```typescript
// Basic HTTP service with Angular 20+ features
@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly apiUrl = environment.apiUrl;
  
  constructor(private http: HttpClient) {}
  
  // Using signals for reactive state
  private users = signal<User[]>([]);
  private loading = signal(false);
  
  readonly usersList = computed(() => this.users());
  readonly isLoading = computed(() => this.loading());
  
  // Get users with error handling
  getUsers(): Observable<User[]> {
    this.loading.set(true);
    
    return this.http.get<User[]>(`${this.apiUrl}/users`).pipe(
      tap(users => {
        this.users.set(users);
        this.loading.set(false);
      }),
      catchError(this.handleError('getUsers', []))
    );
  }
  
  // Create user with typed response
  createUser(user: UserForm): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/users`, user).pipe(
      tap(newUser => {
        this.users.update(users => [...users, newUser]);
      }),
      catchError(this.handleError('createUser'))
    );
  }
  
  // Private error handler
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed:`, error);
      
      // Let the app keep running by returning empty result
      return of(result as T);
    };
  }
}

// HTTP Interceptor for authentication and logging
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Clone request and add auth header
    const authReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${this.getToken()}`)
    });
    
    return next.handle(authReq).pipe(
      tap(event => {
        if (event instanceof HttpResponse) {
          console.log('API call successful:', event.url);
        }
      }),
      catchError(error => {
        console.error('API call failed:', error);
        return throwError(() => error);
      })
    );
  }
  
  private getToken(): string {
    return localStorage.getItem('auth_token') || '';
  }
}

// Retry logic with exponential backoff
export function retryWithBackoff(maxRetries: number, delay: number) {
  return (source: Observable<any>) =>
    source.pipe(
      retryWhen(errors =>
        errors.pipe(
          mergeMap((error, i) => {
            const retryAttempt = i + 1;
            if (retryAttempt > maxRetries || error.status < 500) {
              return throwError(() => error);
            }
            console.log(`Retry attempt ${retryAttempt} in ${delay * retryAttempt}ms`);
            return timer(delay * retryAttempt);
          })
        )
      )
    );
}

// Using the retry operator
@Injectable({ providedIn: 'root' })
export class DataService {
  getData(): Observable<any> {
    return this.http.get('/api/data').pipe(
      retryWithBackoff(3, 1000)
    );
  }
}
```

### Real-world Scenarios
- **E-commerce**: Product catalog, cart management, order processing
- **Social media**: User profiles, posts, comments, real-time updates
- **Banking**: Account information, transactions, transfers
- **Analytics**: Data reporting, dashboards, real-time metrics

### Best Practices
- Use interceptors for cross-cutting concerns
- Implement proper error handling
- Use typed responses for type safety
- Handle loading states appropriately
- Implement caching strategies

### Common Pitfalls
- Not handling errors properly
- Memory leaks from unsubscribed observables
- Poor API design coupling
- Not using HTTP interceptors

### When to Use
- **REST APIs**: Standard CRUD operations
- **GraphQL**: Complex data requirements
- **WebSockets**: Real-time communication
- **Server-Sent Events**: One-way real-time updates

### Short Interview Answers
**Q: How do you handle HTTP errors in Angular?**
A: Use catchError operator in RxJS pipes, implement global error handlers, and provide user-friendly error messages.

**Q: What are HTTP interceptors used for?**
A: Interceptors handle cross-cutting concerns like authentication, logging, caching, and request/response transformation.

### Advanced Notes
- Implement request/response transformation
- Use HTTP context for request-specific data
- Handle file uploads with progress
- Implement offline capabilities

### Summary
Angular's HttpClient with RxJS provides a robust foundation for handling HTTP requests with proper error handling, interceptors, and reactive patterns.

---

## 13. General Web Performance Optimization

### Explanation
Web performance optimization focuses on improving load times, runtime performance, and user experience through various techniques beyond Angular-specific optimizations.

### Practical Examples

```typescript
// Lazy loading with Angular 20+ features
const routes: Routes = [
  {
    path: 'admin',
    loadComponent: () => import('./admin/admin.component').then(c => c.AdminComponent),
    data: { preload: true }
  },
  {
    path: 'reports',
    loadComponent: () => import('./reports/reports.component').then(c => c.ReportsComponent)
  }
];

// Custom preloading strategy
@Injectable({ providedIn: 'root' })
export class CustomPreloadingStrategy implements PreloadingStrategy {
  preload(route: Route, load: () => Observable<any>): Observable<any> {
    return route.data?.['preload'] ? load() : of(null);
  }
}

// Image optimization with lazy loading
@Component({
  template: `
    <img [src]="imageSrc" 
         [alt]="imageAlt"
         loading="lazy"
         (load)="onImageLoad()"
         (error)="onImageError()">
  `
})
export class OptimizedImageComponent {
  @Input() imageSrc!: string;
  @Input() imageAlt!: string;
  
  onImageLoad(): void {
    console.log('Image loaded successfully');
  }
  
  onImageError(): void {
    console.error('Failed to load image');
  }
}

// Service Worker for caching
// ngsw-config.json
{
  "index": "/index.html",
  "assetGroups": [
    {
      "name": "app",
      "installMode": "prefetch",
      "resources": {
        "files": [
          "/favicon.ico",
          "/index.html",
          "/manifest.webmanifest",
          "/*.css",
          "/*.js"
        ]
      }
    }
  ]
}

// Performance monitoring
@Component({})
export class PerformanceMonitorComponent implements AfterViewInit {
  @ViewChild('content') content!: ElementRef;
  
  ngAfterViewInit(): void {
    // Measure Core Web Vitals
    this.measureLCP();
    this.measureFID();
    this.measureCLS();
  }
  
  private measureLCP(): void {
    const observer = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      const lastEntry = entries[entries.length - 1];
      console.log('LCP:', lastEntry.startTime);
    });
    
    observer.observe({ entryTypes: ['largest-contentful-paint'] });
  }
  
  private measureFID(): void {
    // First Input Delay measurement
  }
  
  private measureCLS(): void {
    // Cumulative Layout Shift measurement
  }
}
```

### Real-world Scenarios
- **E-commerce**: Fast product pages for better conversion
- **Media sites**: Optimized image and video delivery
- **Dashboards**: Efficient data visualization
- **Progressive Web Apps**: Offline functionality and fast loading

### Best Practices
- Implement lazy loading for routes and components
- Optimize images and assets
- Use CDN for static resources
- Implement caching strategies
- Monitor Core Web Vitals

### Common Pitfalls
- Not optimizing bundle size
- Poor image optimization
- Missing caching headers
- Blocking render with large scripts

### When to Use
- **Lazy Loading**: Non-critical features and routes
- **Caching**: Static assets and API responses
- **CDN**: Global user base
- **Service Workers**: Offline functionality

### Short Interview Answers
**Q: What are Core Web Vitals?**
A: LCP (Largest Contentful Paint), FID (First Input Delay), and CLS (Cumulative Layout Shift) - key metrics for user experience.

**Q: How do you optimize images in Angular?**
A: Use modern formats (WebP), implement lazy loading, responsive images, and CDN delivery.

### Advanced Notes
- Implement code splitting strategies
- Use Web Workers for CPU-intensive tasks
- Optimize Angular change detection
- Monitor performance with Angular DevTools

### Summary
Web performance optimization requires a holistic approach covering bundle optimization, asset delivery, caching strategies, and continuous monitoring.

---

## 14. Template Access to Observable Data

### Explanation
Angular provides multiple ways to access observable data in templates, each with different use cases and performance characteristics.

### Practical Examples

```typescript
// Using async pipe (recommended)
@Component({
  template: `
    <div *ngIf="user$ | async as user; else loading">
      <h2>Welcome, {{ user.name }}!</h2>
      <p>Email: {{ user.email }}</p>
    </div>
    
    <ng-template #loading>
      <p>Loading user data...</p>
    </ng-template>
    
    <ul>
      <li *ngFor="let item of items$ | async">
        {{ item.name }}
      </li>
    </ul>
  `
})
export class UserComponent {
  user$ = this.userService.currentUser$;
  items$ = this.itemService.getItems();
}

// Using signals for reactive templates (Angular 16+)
@Component({
  template: `
    <h2>User: {{ user().name }}</h2>
    <p>Email: {{ user().email }}</p>
    
    <ul>
      @for (item of items(); track item.id) {
        <li>{{ item.name }}</li>
      }
    </ul>
    
    <button (click)="refresh()" [disabled]="loading()">
      {{ loading() ? 'Loading...' : 'Refresh' }}
    </button>
  `
})
export class SignalUserComponent {
  user = signal<User | null>(null);
  items = signal<Item[]>([]);
  loading = signal(false);
  
  constructor(private userService: UserService) {}
  
  refresh(): void {
    this.loading.set(true);
    this.userService.getUser().subscribe(user => {
      this.user.set(user);
      this.loading.set(false);
    });
  }
}

// Combining multiple observables
@Component({
  template: `
    @if (data(); as data) {
      <div class="dashboard">
        <app-user-card [user]="data.user" />
        <app-stats [stats]="data.stats" />
        <app-recent-activity [activities]="data.activities" />
      </div>
    } @else {
      <app-loading-spinner />
    }
  `
})
export class DashboardComponent {
  private user$ = this.userService.currentUser$;
  private stats$ = this.statsService.getStats();
  private activities$ = this.activityService.getRecent();
  
  data = toSignal(
    combineLatest([this.user$, this.stats$, this.activities$]).pipe(
      map(([user, stats, activities]) => ({ user, stats, activities }))
    ),
    { initialValue: null }
  );
}

// Handling loading and error states
@Component({
  template: `
    @if (userData(); as data) {
      <div class="user-profile">
        <img [src]="data.user.avatar" [alt]="data.user.name">
        <h2>{{ data.user.name }}</h2>
        <p>{{ data.user.bio }}</p>
      </div>
    } @else if (loading()) {
      <app-skeleton-loader />
    } @else if (error()) {
      <app-error-message [error]="error()" />
    }
  `
})
export class UserProfileComponent {
  private userResult$ = this.userService.getUserProfile().pipe(
    map(user => ({ user, error: null })),
    catchError(error => of({ user: null, error }))
  );
  
  userData = toSignal(
    this.userResult$.pipe(map(result => result.user)),
    { initialValue: null }
  );
  
  error = toSignal(
    this.userResult$.pipe(map(result => result.error)),
    { initialValue: null }
  );
  
  loading = computed(() => !this.userData() && !this.error());
}
```

### Real-world Scenarios
- **User dashboards**: Multiple data streams combined
- **Real-time applications**: Live data updates
- **Form validation**: Async validation states
- **Data tables**: Paginated and filtered data

### Best Practices
- Prefer async pipe for automatic subscription management
- Use signals for local reactive state
- Handle loading and error states properly
- Combine observables efficiently
- Avoid nested subscriptions

### Common Pitfalls
- Memory leaks from unsubscribed observables
- Not handling loading states
- Complex observable chains in templates
- Overusing manual subscription

### When to Use
- **Async Pipe**: Simple observable data display
- **Signals**: Local reactive state
- **toSignal**: Converting observables to signals
- **Manual Subscription**: Complex side effects

### Short Interview Answers
**Q: Why use async pipe over manual subscription?**
A: Async pipe automatically handles subscription and unsubscription, preventing memory leaks and simplifying code.

**Q: How do signals improve template reactivity?**
A: Signals provide granular reactivity with automatic dependency tracking and optimized change detection.

### Advanced Notes
- Use `toSignal` with custom initial values
- Implement custom reactive directives
- Handle race conditions in observable chains
- Optimize change detection with OnPush

### Summary
Modern Angular provides multiple approaches for template data access, with async pipe and signals being the recommended patterns for most use cases.

---

## 15. Reusable Modal Component

### Explanation
A flexible modal component using content projection, dynamic components, and proper accessibility features for reusable dialog functionality.

### Practical Examples

```typescript
// Base modal component
@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="modal-overlay" 
         [class.modal-visible]="isVisible"
         (click)="onOverlayClick($event)"
         role="dialog"
         aria-modal="true"
         aria-labelledby="modal-title"
         aria-describedby="modal-description">
      
      <div class="modal-content" 
           [class.modal-large]="size === 'large'"
           [class.modal-small]="size === 'small'"
           (click)="$event.stopPropagation()">
        
        <!-- Header with title and close button -->
        <div class="modal-header">
          <h2 id="modal-title">{{ title }}</h2>
          <button class="close-button" 
                  (click)="close()"
                  aria-label="Close modal"
                  type="button">
            ×
          </button>
        </div>
        
        <!-- Content projection -->
        <div class="modal-body" id="modal-description">
          <ng-content></ng-content>
        </div>
        
        <!-- Optional footer -->
        <div class="modal-footer" *ngIf="showFooter">
          <ng-content select="[footer]"></ng-content>
        </div>
      </div>
    </div>
  `,
  styles: `
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      visibility: hidden;
      transition: all 0.3s ease;
      z-index: 1000;
      
      &.modal-visible {
        opacity: 1;
        visibility: visible;
      }
    }
    
    .modal-content {
      background: white;
      border-radius: 8px;
      padding: 0;
      max-width: 90vw;
      max-height: 90vh;
      overflow: auto;
      transform: scale(0.9);
      transition: transform 0.3s ease;
      
      .modal-visible & {
        transform: scale(1);
      }
      
      &.modal-large {
        width: 800px;
      }
      
      &.modal-small {
        width: 400px;
      }
    }
    
    .modal-header {
      padding: 1rem 1.5rem;
      border-bottom: 1px solid #eee;
      display: flex;
      justify-content: space-between;
      align-items: center;
      
      h2 {
        margin: 0;
        font-size: 1.25rem;
      }
    }
    
    .close-button {
      background: none;
      border: none;
      font-size: 1.5rem;
      cursor: pointer;
      padding: 0.25rem;
      line-height: 1;
      
      &:hover {
        opacity: 0.7;
      }
    }
    
    .modal-body {
      padding: 1.5rem;
    }
    
    .modal-footer {
      padding: 1rem 1.5rem;
      border-top: 1px solid #eee;
      display: flex;
      justify-content: flex-end;
      gap: 0.5rem;
    }
  `
})
export class ModalComponent {
  @Input() title = '';
  @Input() size: 'small' | 'medium' | 'large' = 'medium';
  @Input() showFooter = false;
  
  isVisible = false;
  
  open(): void {
    this.isVisible = true;
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
  }
  
  close(): void {
    this.isVisible = false;
    // Restore body scroll
    document.body.style.overflow = '';
  }
  
  onOverlayClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.close();
    }
  }
}

// Modal service for programmatic usage
@Injectable({ providedIn: 'root' })
export class ModalService {
  private modalComponentRef?: ComponentRef<ModalComponent>;
  
  constructor(private componentFactoryResolver: ComponentFactoryResolver) {}
  
  open(component: Type<any>, config: ModalConfig = {}): void {
    // Implementation for dynamic modal creation
  }
  
  close(): void {
    if (this.modalComponentRef) {
      this.modalComponentRef.destroy();
      this.modalComponentRef = undefined;
    }
  }
}

interface ModalConfig {
  title?: string;
  size?: 'small' | 'medium' | 'large';
  data?: any;
}

// Usage example
@Component({
  template: `
    <button (click)="openUserModal()">Open User Modal</button>
    
    <app-modal #userModal 
               title="User Details" 
               size="medium"
               [showFooter]="true">
      <form class="user-form">
        <div class="form-group">
          <label>Name</label>
          <input type="text" [(ngModel)]="user.name" name="name">
        </div>
        <div class="form-group">
          <label>Email</label>
          <input type="email" [(ngModel)]="user.email" name="email">
        </div>
      </form>
      
      <div footer>
        <button (click)="saveUser()">Save</button>
        <button (click)="userModal.close()">Cancel</button>
      </div>
    </app-modal>
  `
})
export class UserManagementComponent {
  @ViewChild('userModal') userModal!: ModalComponent;
  user = { name: '', email: '' };
  
  openUserModal(): void {
    this.userModal.open();
  }
  
  saveUser(): void {
    console.log('Saving user:', this.user);
    this.userModal.close();
  }
}
```

### Real-world Scenarios
- **Form dialogs**: User registration, data entry forms
- **Confirmation dialogs**: Delete confirmation, action confirmation
- **Information modals**: Help text, notifications, alerts
- **Complex workflows**: Multi-step processes in modal

### Best Practices
- Implement proper accessibility features
- Handle focus management
- Support keyboard navigation
- Provide escape key support
- Manage body scroll properly

### Common Pitfalls
- Poor accessibility implementation
- Not handling focus trapping
- Missing keyboard navigation
- Poor mobile responsiveness

### When to Use
- **Modal dialogs**: Important actions requiring user attention
- **Form overlays**: Data entry without page navigation
- **Confirmation**: Critical action verification
- **Information display**: Contextual help or details

### Short Interview Answers
**Q: How do you make a modal accessible?**
A: Use proper ARIA attributes, focus management, keyboard navigation, screen reader support, and escape key functionality.

**Q: What's the benefit of content projection in modals?**
A: Content projection allows flexible content while maintaining consistent modal behavior and styling.

### Advanced Notes
- Implement focus trapping for accessibility
- Handle dynamic content loading
- Support multiple modal instances
- Implement backdrop click handling

### Summary
A reusable modal component with proper accessibility, content projection, and flexible configuration provides a robust foundation for dialog interactions.

---

## 16. Common Tasks in ngOnDestroy

### Explanation
The ngOnDestroy lifecycle hook is crucial for cleaning up resources to prevent memory leaks and ensure proper application behavior.

### Practical Examples

```typescript
// Comprehensive ngOnDestroy implementation
@Component({})
export class DataComponent implements OnDestroy {
  private subscriptions: Subscription[] = [];
  private timeouts: number[] = [];
  private intervals: number[] = [];
  private eventListeners: (() => void)[] = [];
  
  constructor(
    private userService: UserService,
    private router: Router,
    private elementRef: ElementRef
  ) {
    // Observable subscriptions
    this.subscriptions.push(
      this.userService.users$.subscribe(users => {
        this.users = users;
      }),
      
      this.router.events.pipe(
        filter(event => event instanceof NavigationEnd)
      ).subscribe(event => {
        this.handleNavigation(event as NavigationEnd);
      })
    );
    
    // Timers
    const timeoutId = window.setTimeout(() => {
      this.checkData();
    }, 5000);
    this.timeouts.push(timeoutId);
    
    const intervalId = window.setInterval(() => {
      this.refreshData();
    }, 30000);
    this.intervals.push(intervalId);
    
    // Event listeners
    const clickHandler = this.handleClick.bind(this);
    document.addEventListener('click', clickHandler);
    this.eventListeners.push(() => {
      document.removeEventListener('click', clickHandler);
    });
    
    // Custom event listeners
    const resizeHandler = this.handleResize.bind(this);
    window.addEventListener('resize', resizeHandler);
    this.eventListeners.push(() => {
      window.removeEventListener('resize', resizeHandler);
    });
  }
  
  // Using takeUntil pattern (alternative approach)
  private destroy$ = new Subject<void>();
  
  ngOnInit(): void {
    this.userService.users$
      .pipe(takeUntil(this.destroy$))
      .subscribe(users => this.users = users);
      
    interval(1000)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.updateTime());
  }
  
  ngOnDestroy(): void {
    // Clean up subscriptions
    this.subscriptions.forEach(sub => sub.unsubscribe());
    this.subscriptions = [];
    
    // Clean up timers
    this.timeouts.forEach(timeoutId => clearTimeout(timeoutId));
    this.timeouts = [];
    
    this.intervals.forEach(intervalId => clearInterval(intervalId));
    this.intervals = [];
    
    // Clean up event listeners
    this.eventListeners.forEach(cleanup => cleanup());
    this.eventListeners = [];
    
    // Clean up takeUntil pattern
    this.destroy$.next();
    this.destroy$.complete();
    
    // Additional cleanup
    this.cleanupCustomResources();
  }
  
  private cleanupCustomResources(): void {
    // Clean up any other resources
    if (this.chartInstance) {
      this.chartInstance.destroy();
    }
    
    if (this.websocketConnection) {
      this.websocketConnection.close();
    }
    
    // Clear any stored data
    this.temporaryData = null;
  }
}

// Using async pipe (automatic cleanup)
@Component({
  template: `
    <div *ngFor="let user of users$ | async">
      {{ user.name }}
    </div>
  `
})
export class UserListComponent {
  users$ = this.userService.getUsers();
  
  constructor(private userService: UserService) {}
  // No need for ngOnDestroy with async pipe
}

// Signal-based cleanup (Angular 16+)
@Component({})
export class SignalComponent {
  private data = signal<any[]>([]);
  private loading = signal(false);
  
  private cleanup = effect(() => {
    // Effects automatically clean up when component is destroyed
    console.log('Data changed:', this.data());
  });
  
  // No explicit ngOnDestroy needed for signals
}

// Custom subscription management service
@Injectable({ providedIn: 'root' })
export class SubscriptionService {
  private subscriptions = new Map<string, Subscription>();
  
  add(key: string, subscription: Subscription): void {
    this.remove(key); // Remove existing if any
    this.subscriptions.set(key, subscription);
  }
  
  remove(key: string): void {
    const subscription = this.subscriptions.get(key);
    if (subscription) {
      subscription.unsubscribe();
      this.subscriptions.delete(key);
    }
  }
  
  clearAll(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    this.subscriptions.clear();
  }
}
```

### Real-world Scenarios
- **Data-intensive components**: Multiple API subscriptions
- **Real-time applications**: WebSocket connections, intervals
- **Interactive components**: Event listeners, timers
- **Chart components**: Chart instance cleanup

### Best Practices
- Always unsubscribe from observables
- Clear timers and intervals
- Remove event listeners
- Use takeUntil pattern for cleaner code
- Leverage async pipe when possible

### Common Pitfalls
- Forgetting to unsubscribe from observables
- Not cleaning up timers and intervals
- Memory leaks from event listeners
- Complex cleanup logic

### When to Use
- **Observable subscriptions**: Manual subscription management
- **Timers**: setTimeout/setInterval cleanup
- **Event listeners**: DOM event cleanup
- **External resources**: Third-party library cleanup

### Short Interview Answers
**Q: Why is ngOnDestroy important?**
A: It prevents memory leaks by cleaning up subscriptions, timers, and event listeners when components are destroyed.

**Q: What's the takeUntil pattern?**
A: It uses a Subject to automatically unsubscribe from observables when the component is destroyed.

### Advanced Notes
- Use DestroyRef in Angular 16+ for cleaner cleanup
- Implement automatic cleanup with decorators
- Handle cleanup in services
- Monitor memory usage

### Summary
Proper resource cleanup in ngOnDestroy is essential for preventing memory leaks and ensuring application stability, with multiple patterns available for different scenarios.

---

## 17. Practice Section

### 20 Practical Challenge Questions

1. **Performance Optimization**
   - How would you optimize an Angular application with 100+ components?
   - Implement virtual scrolling for a large data table
   - Reduce bundle size by 50%

2. **State Management**
   - Migrate from NgRx to Signals-based state management
   - Implement optimistic updates in a shopping cart
   - Handle offline state with service workers

3. **Change Detection**
   - Identify and fix change detection performance issues
   - Implement custom change detection strategy
   - Optimize a component tree with mixed strategies

4. **Forms & Validation**
   - Create a dynamic form builder with validation
   - Implement cross-field validation for a registration form
   - Handle file uploads with progress indication

5. **RxJS & Observables**
   - Implement a search with debounce and cancellation
   - Handle multiple API calls with error recovery
   - Create a real-time data stream with WebSockets

6. **Architecture & Patterns**
   - Design a micro-frontend architecture with Angular
   - Implement a plugin system for extensible applications
   - Create a component library with Storybook

7. **Testing**
   - Write comprehensive unit tests for a complex service
   - Implement E2E tests for a multi-step form
   - Test performance with Lighthouse CI

8. **Advanced TypeScript**
   - Create strongly typed API client with generics
   - Implement conditional types for dynamic forms
   - Build a type-safe state management system

### Mini Coding Tasks

**Task 1: Reactive Search Component**
```typescript
// Implement a search component with:
// - Debounce (300ms)
// - Minimum 3 characters
// - Loading state
// - Error handling
// - Empty state
```

**Task 2: Paginated Data Table**
```typescript
// Create a data table with:
// - Server-side pagination
// - Sorting
// - Filtering
// - Row selection
// - Bulk actions
```

**Task 3: Multi-step Wizard**
```typescript
// Build a wizard with:
// - Step validation
// - Progress tracking
// - Data persistence between steps
// - Conditional step navigation
```

**Task 4: Real-time Dashboard**
```typescript
// Implement a dashboard with:
// - Multiple data sources
// - Real-time updates
// - Error boundaries
// - Performance monitoring
```

### Simulated Interviewer Follow-up Questions

**After presenting a solution:**
1. "How would you scale this for 1 million users?"
2. "What performance optimizations would you add?"
3. "How would you handle edge cases and errors?"
4. "What testing strategy would you implement?"
5. "How would you deploy and monitor this in production?"

**Technical deep-dive questions:**
1. "Explain the difference between Zone.js and Signals for change detection"
2. "How would you implement lazy loading for a large enterprise application?"
3. "Describe your approach to state management for a real-time collaborative app"
4. "What security considerations are important for Angular applications?"
5. "How do you handle internationalization and localization?"

**Architecture questions:**
1. "Design a system for A/B testing feature flags"
2. "How would you implement a micro-frontend architecture?"
3. "Describe your approach to API versioning and backward compatibility"
4. "How do you handle authentication and authorization across multiple apps?"
5. "What's your strategy for monitoring and observability?"

### Problem-Solving Scenarios

**Scenario 1: Performance Issue**
- "Users report the application becomes slow after 30 minutes of use"
- Investigation reveals memory leaks from unsubscribed observables
- Solution: Implement comprehensive cleanup and monitoring

**Scenario 2: Bundle Size**
- "Initial bundle size is 8MB, causing slow load times"
- Analysis shows unused dependencies and large third-party libraries
- Solution: Code splitting, tree shaking, and lazy loading

**Scenario 3: State Management**
- "Application state becomes inconsistent across different components"
- Current implementation uses scattered services without clear data flow
- Solution: Implement centralized state management with clear patterns

**Scenario 4: Accessibility**
- "Application fails WCAG 2.1 compliance audit"
- Missing proper ARIA attributes and keyboard navigation
- Solution: Comprehensive accessibility audit and implementation

### Code Review Exercises

**Review this code and identify issues:**
```typescript
@Component({
  template: `
    <div *ngFor="let user of users">
      {{ user.name }}
    </div>
    <button (click)="loadMore()">Load More</button>
  `
})
export class UserListComponent {
  users: User[] = [];
  
  loadMore(): void {
    this.userService.getUsers().subscribe(newUsers => {
      this.users = [...this.users, ...newUsers];
    });
  }
}
```

**Issues to identify:**
- Missing trackBy in *ngFor
- No loading state handling
- No error handling
- Memory leak potential
- Poor performance with large lists

### Final Tips for Interview Success

1. **Understand the Fundamentals**
   - Master Angular lifecycle hooks
   - Understand change detection mechanisms
   - Know when to use different state management approaches

2. **Practice Problem-Solving**
   - Work on real-world scenarios
   - Practice whiteboard coding
   - Prepare for system design questions

3. **Stay Current**
   - Keep up with Angular updates
   - Learn modern patterns (Signals, standalone components)
   - Understand web performance best practices

4. **Communication Skills**
   - Explain your thought process clearly
   - Ask clarifying questions
   - Discuss trade-offs and alternatives

5. **Showcase Experience**
   - Discuss real projects and challenges
   - Share lessons learned
   - Demonstrate continuous learning

---

## Conclusion

This comprehensive Angular interview guide covers essential topics, practical examples, and real-world scenarios to help you prepare for Angular interviews at any level. Remember that successful interviews combine technical knowledge with problem-solving skills and clear communication.

**Key Takeaways:**
- Master both fundamental and advanced Angular concepts
- Understand performance optimization techniques
- Practice with real coding challenges
- Stay updated with Angular's evolving ecosystem
- Focus on clean, maintainable code patterns

Good luck with your Angular interview preparation!

*Last updated: Angular 20+*
