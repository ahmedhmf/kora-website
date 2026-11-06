import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-section-meta',
  standalone: true,
  templateUrl: './section-meta.component.html',
  styleUrl: './section-meta.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SectionMetaComponent {
  readonly codeLabel = input.required<string>();
  readonly numberLabel = input.required<string>();
  readonly isActive = input<boolean>(false);
  readonly darkText = input<boolean>(false);
}
