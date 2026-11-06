import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-handball-section',
  standalone: true,
  imports: [],
  templateUrl: './handball-section.component.html',
  styleUrl: './handball-section.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HandballSectionComponent {
  readonly isActive = input<boolean>(false);
  readonly progress = input<number>(0);

  protected readonly portraitOffset = computed(() => {
    const p = this.progress();
    const y = (1 - p) * 26;
    return `translate3d(0, ${y.toFixed(1)}px, 0)`;
  });

}
