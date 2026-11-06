import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-brand-logo',
  standalone: true,
  templateUrl: './brand-logo.component.html',
  styleUrl: './brand-logo.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BrandLogoComponent {
  readonly showWordmark = input<boolean>(false);
  readonly wordmark = input<string>('oxlando');
  readonly size = input<'sm' | 'md' | 'xl'>('md');
}
