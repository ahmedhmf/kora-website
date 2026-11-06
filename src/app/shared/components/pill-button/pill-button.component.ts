import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  selector: 'app-pill-button',
  standalone: true,
  templateUrl: './pill-button.component.html',
  styleUrl: './pill-button.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PillButtonComponent {
  readonly label = input<string>('SHOP NOW');
  readonly variant = input<'light' | 'frosted' | 'dark'>('frosted');
  readonly actionTriggered = output<void>();

  onClick(): void {
    this.actionTriggered.emit();
  }
}
