import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-hero-section',
  standalone: true,
  imports: [],
  templateUrl: './hero-section.component.html',
  styleUrl: './hero-section.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeroSectionComponent {
  readonly isActive = input<boolean>(true);
  readonly progress = input<number>(1);

  protected readonly parallaxTransform = computed(() => {
    const p = this.progress();
    const offset = (1 - p) * 28;
    const scale = 1 + (1 - p) * 0.05;
    return `translate3d(0, ${offset.toFixed(1)}px, 0) scale(${scale.toFixed(3)})`;
  });

}
