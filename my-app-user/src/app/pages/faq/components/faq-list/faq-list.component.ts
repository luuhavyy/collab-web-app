import { Component } from '@angular/core';

@Component({
  selector: 'app-faq-list',
  standalone: false,
  templateUrl: './faq-list.component.html',
  styleUrl: './faq-list.component.css'
})
export class FaqListComponent {
  activeIndex: number | null = null;
}
