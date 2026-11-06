import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-inner-power-section',
  standalone: true,
  imports: [],
  templateUrl: './inner-power-section.component.html',
  styleUrl: './inner-power-section.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InnerPowerSectionComponent {
  readonly isActive = input<boolean>(false);
  readonly progress = input<number>(0);

  protected readonly imageTransform = computed(() => {
    const p = this.progress();
    const scale = 1.08 - p * 0.08;
    const shiftX = (1 - p) * -18;
    return `scale(${scale.toFixed(3)}) translate3d(${shiftX.toFixed(1)}px, 0, 0)`;
  });
}
