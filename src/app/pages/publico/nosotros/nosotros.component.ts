import { Component, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { CIVIME_DATOS } from '../../../data/civime-datos';

@Component({
  selector: 'app-nosotros',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './nosotros.component.html',
  styleUrl: './nosotros.component.css'
})
export class NosotrosComponent implements OnDestroy {
  readonly datos = CIVIME_DATOS;

  private readonly route = inject(ActivatedRoute);
  private fragmentSub?: Subscription;

  constructor() {
    this.fragmentSub = this.route.fragment.subscribe((f) =>
      this.scrollToId(f)
    );
  }

  private scrollToId(fragment: string | null): void {
    if (!fragment) {
      return;
    }
    const run = () =>
      document.getElementById(fragment)?.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    requestAnimationFrame(() => requestAnimationFrame(run));
  }

  ngOnDestroy(): void {
    this.fragmentSub?.unsubscribe();
  }
}
