import {
  computed,
  Directive,
  effect,
  ElementRef,
  inject,
  signal,
  TemplateRef,
  viewChild,
  ViewContainerRef,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormGroup } from '@angular/forms';
import { BehaviorSubject, map } from 'rxjs';

@Directive({
  selector: '[appRepeat]',
})
export class Repeat {

  count$ = new BehaviorSubject(0);
  duble$ = this.count$.pipe(map((x) => x * 2));

  viewChildren = viewChild(ElementRef);

  inc() {
  }

  form!: FormGroup;
  nameSignal = toSignal(this.form.get('name')!.valueChanges, {
    initialValue: '',
  });

  ngOniInit() {

   

  }

  constructor() {}
}
