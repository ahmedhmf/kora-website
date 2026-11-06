import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { FooterSpotlightCard } from '../../../core/models/brand.models';
import { OptimizedImageComponent } from '../optimized-image/optimized-image.component';

@Component({
  selector: 'app-spotlight-card',
  standalone: true,
  imports: [OptimizedImageComponent],
  templateUrl: './spotlight-card.component.html',
  styleUrl: './spotlight-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpotlightCardComponent {
  readonly spotlight = input.required<FooterSpotlightCard>();
  readonly exploreClicked = output<void>();

  onExplore(): void {
    this.exploreClicked.emit();
  }
}
