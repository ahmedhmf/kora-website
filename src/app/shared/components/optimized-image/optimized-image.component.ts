import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';
import { ResponsiveImageAsset } from '../../../core/models/brand.models';
import { BrandStore } from '../../../core/store/brand.store';

@Component({
  selector: 'app-optimized-image',
  standalone: true,
  templateUrl: './optimized-image.component.html',
  styleUrl: './optimized-image.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OptimizedImageComponent {
  private readonly brandStore = inject(BrandStore);

  readonly asset = input.required<ResponsiveImageAsset>();
  readonly imgClass = input<string>('');
  readonly decorative = input<boolean>(false);

  protected readonly isLoaded = signal<boolean>(false);
  protected readonly hasError = signal<boolean>(false);

  protected readonly isLowBandwidth = this.brandStore.isLowBandwidth;

  protected readonly desktopSrcset = computed(() => {
    const a = this.asset();
    if (this.isLowBandwidth()) {
      return `${a.desktopSrc} 1x`;
    }
    return `${a.desktopSrc} 1x, ${a.retinaSrc} 2x`;
  });

  protected readonly effectiveAlt = computed(() =>
    this.decorative() ? '' : this.asset().alt
  );

  onImageLoad(): void {
    this.isLoaded.set(true);
  }

  onImageError(): void {
    this.hasError.set(true);
    this.isLoaded.set(true);
  }
}
