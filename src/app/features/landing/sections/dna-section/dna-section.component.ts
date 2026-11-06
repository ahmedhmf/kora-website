import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-dna-section',
  standalone: true,
  imports: [],
  templateUrl: './dna-section.component.html',
  styleUrl: './dna-section.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DnaSectionComponent {
  readonly isActive = input<boolean>(false);
  readonly progress = input<number>(0);

  protected readonly imageTransform = computed(() => {
    const p = this.progress();
    const scale = 1.08 - p * 0.08;
    const shiftX = (1 - p) * -18;
    return `scale(${scale.toFixed(3)}) translate3d(${shiftX.toFixed(1)}px, 0, 0)`;
  });
}
