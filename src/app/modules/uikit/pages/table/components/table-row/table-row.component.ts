import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AngularSvgIconModule } from 'angular-svg-icon';

@Component({
  selector: '[app-table-row]',
  imports: [FormsModule, AngularSvgIconModule],
  templateUrl: './table-row.component.html',
  styleUrl: './table-row.component.css',
})
export class TableRowComponent {
  @Input() user: any = {};

  constructor() {}
}
