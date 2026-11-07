import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-handball-technology-section',
  standalone: true,
  templateUrl: './handball-technology-section.component.html',
  styleUrl: './handball-technology-section.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HandballTechnologySectionComponent {
  readonly isActive = input(false);
  readonly progress = input(0);

  protected readonly imageTransform = computed(() =>
    `scale(${(1.035 - this.progress() * 0.035).toFixed(3)})`,
  );
}
