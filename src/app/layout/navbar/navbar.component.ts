import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ScrollStore } from '../../core/store/scroll.store';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarComponent {
  protected readonly scrollStore = inject(ScrollStore);

  onLogoClick(): void {
    this.scrollStore.requestScrollToSection(0);
  }

}
