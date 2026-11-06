import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-maximum-impact-section',
  standalone: true,
  imports: [],
  templateUrl: './maximum-impact-section.component.html',
  styleUrl: './maximum-impact-section.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MaximumImpactSectionComponent {
  readonly isActive = input<boolean>(false);
  readonly progress = input<number>(0);

  protected readonly frameTransform = computed(() => {
    const p = this.progress();
    const scale = 0.94 + p * 0.06;
    return `scale(${scale.toFixed(3)})`;
  });

}
