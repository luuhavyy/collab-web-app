import { Component } from '@angular/core';

@Component({
  selector: 'app-policy-list',
  standalone: false,
  templateUrl: './policy-list.component.html',
  styleUrl: './policy-list.component.css'
})
export class PolicyListComponent {
  loadMore() {
    alert('Tải thêm chính sách...');
  }
}
