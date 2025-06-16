import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LaptopCardComponent } from '../laptop-card/laptop-card.component';
import { LaptopService } from '../../services/laptop.service';
import { Laptop } from '../../models/laptop.model';

@Component({
  selector: 'app-laptop-list',
  imports: [CommonModule, LaptopCardComponent],
  templateUrl: './laptop-list.component.html',
  styleUrl: './laptop-list.component.scss'
})
export class LaptopListComponent implements OnInit {
  laptops: Laptop[] = [];
  loading = true;
  error: string | null = null;

  constructor(private laptopService: LaptopService) {}

  ngOnInit() {
    this.loadLaptops();
  }

  loadLaptops() {
    this.laptopService.getAllLaptops().subscribe({
      next: (laptops) => {
        this.laptops = laptops;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load laptops';
        this.loading = false;
        console.error('Error loading laptops:', err);
      }
    });
  }

  trackByLaptopId(index: number, laptop: Laptop): string {
    return laptop.id;
  }
}
