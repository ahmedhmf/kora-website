import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-handball-balls-section',
  standalone: true,
  templateUrl: './handball-balls-section.component.html',
  styleUrl: './handball-balls-section.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HandballBallsSectionComponent {
  readonly isActive = input<boolean>(false);
  readonly progress = input<number>(0);

  protected readonly imageTransform = computed(() => {
    const p = this.progress();
    return `scale(${(1.04 - p * 0.04).toFixed(3)})`;
  });
}
