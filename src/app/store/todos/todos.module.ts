import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { todosReducer } from './todos.reducer';
import { TodosEffects } from './todos.effects';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature('todos', todosReducer),
    EffectsModule.forFeature([TodosEffects])
  ]
})
export class TodosModule { }
