import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-orbital-graphic',
  standalone: true,
  templateUrl: './orbital-graphic.component.html',
  styleUrl: './orbital-graphic.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrbitalGraphicComponent {
  readonly variant = input<'hero' | 'split-right' | 'split-left' | 'ambient'>('hero');
  readonly isActive = input<boolean>(false);
}
