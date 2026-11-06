import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-identity-section',
  standalone: true,
  imports: [],
  templateUrl: './identity-section.component.html',
  styleUrl: './identity-section.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IdentitySectionComponent {
  readonly isActive = input<boolean>(false);
  readonly progress = input<number>(0);

  protected readonly rightPortraitTransform = computed(() => {
    const p = this.progress();
    const scale = 1.07 - p * 0.07;
    const translateY = (1 - p) * 20;
    return `scale(${scale.toFixed(3)}) translate3d(0, ${translateY.toFixed(1)}px, 0)`;
  });
}
