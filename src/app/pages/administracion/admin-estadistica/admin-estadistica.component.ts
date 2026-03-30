import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-admin-estadistica',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  templateUrl: './admin-estadistica.component.html',
  styleUrl: './admin-estadistica.component.css'
})
export class AdminEstadisticaComponent {}
