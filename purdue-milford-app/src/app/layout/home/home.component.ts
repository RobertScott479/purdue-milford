import { Component, OnDestroy, OnInit } from '@angular/core';

import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';

import { AlertComponent } from '../alert/alert.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';

import { CommonModule, formatDate } from '@angular/common';

import { MatTableDataSource } from '@angular/material/table';

import { MatExpansionModule } from '@angular/material/expansion';

import { MatNativeDateModule, provideNativeDateAdapter } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { HomeService } from '../../home.service';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatSelectModule,
    CommonModule,
    MatExpansionModule,

    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule,

    RouterOutlet,
    MatCardModule,
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {}
