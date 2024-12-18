import { Component, Input, Output, EventEmitter, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import '@codeium/lightweight-editor/components';

@Component({
  selector: 'app-editor',
  template: `
    <lightweight-editor
      [attr.value]="value"
      [attr.placeholder]="placeholder"
      (change)="handleChange($event)"
    ></lightweight-editor>
  `,
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class EditorComponent {
  @Input() value?: string;
  @Input() placeholder?: string;
  @Output() valueChange = new EventEmitter<string>();

  handleChange(event: CustomEvent<{ value: string }>) {
    this.valueChange.emit(event.detail.value);
  }
}

/* Example usage:
@Component({
  selector: 'app-root',
  template: `
    <app-editor
      [(value)]="content"
      placeholder="Enter your content"
    ></app-editor>
  `
})
export class AppComponent {
  content = 'Start typing...';
}
*/
