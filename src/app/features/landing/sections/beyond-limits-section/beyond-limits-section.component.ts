import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-beyond-limits-section',
  standalone: true,
  imports: [],
  templateUrl: './beyond-limits-section.component.html',
  styleUrl: './beyond-limits-section.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BeyondLimitsSectionComponent {
  readonly isActive = input<boolean>(false);
  readonly progress = input<number>(0);

  protected readonly portraitOffset = computed(() => {
    const p = this.progress();
    const y = (1 - p) * 26;
    return `translate3d(0, ${y.toFixed(1)}px, 0)`;
  });

}
