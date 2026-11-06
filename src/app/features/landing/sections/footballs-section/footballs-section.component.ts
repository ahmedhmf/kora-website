import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-footballs-section',
  standalone: true,
  imports: [],
  templateUrl: './footballs-section.component.html',
  styleUrl: './footballs-section.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FootballsSectionComponent {
  readonly isActive = input<boolean>(false);
  readonly progress = input<number>(0);

  protected readonly frameTransform = computed(() => {
    const p = this.progress();
    const scale = 0.94 + p * 0.06;
    return `scale(${scale.toFixed(3)})`;
  });

}
