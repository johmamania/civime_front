import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-admin-cursos',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  templateUrl: './admin-cursos.component.html',
  styleUrl: './admin-cursos.component.css'
})
export class AdminCursosComponent {}
