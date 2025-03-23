import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, map } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css'
})

export class AppComponent {
  title = 'Collab Eyewear';
  isHomePage: boolean = false;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private titleService: Title
  ) {
    // Lắng nghe sự kiện thay đổi route
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        map(() => {
          let route = this.activatedRoute;
          while (route.firstChild) {
            route = route.firstChild;
          }
          return route.snapshot.data['title'] || 'Collab Eyewear';
        })
      )
      .subscribe(title => {
        this.title = title as string; // ✅ Ép kiểu về string
        this.titleService.setTitle(title as string); // ✅ Ép kiểu về string
        this.isHomePage = this.router.url === '/' || this.router.url === '/home';
      });
  }
}
