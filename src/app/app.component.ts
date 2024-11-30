import { Component, Renderer2 } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from "./navbar/navbar.component";
import { SidebarComponent } from "./sidebar/sidebar.component";
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, SidebarComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'menu';
  showSidebar = true;
  isDarkMode = false;

  constructor(private router: Router, private renderer: Renderer2) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.showSidebar = event.url !== '/cart';
      }
    });
  }

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    if (this.isDarkMode) {
      const navbar = document.querySelector('.navbar');
      if (navbar) {
        this.renderer.addClass(navbar, 'dark-mode');
      }
    } else {
      this.renderer.removeClass(document.documentElement, 'dark-mode');
      this.renderer.removeClass(document.body, 'dark-mode');

      const navbar = document.querySelector('.navbar');
      if (navbar) {
        this.renderer.removeClass(navbar, 'dark-mode');
      }
    }
  }
}
