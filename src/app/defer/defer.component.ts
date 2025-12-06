import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';

interface ImageItem {
  id: number;
  src: string;
  alt: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-defer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './defer.component.html',
  styleUrls: ['./defer.component.scss']
})
export class DeferComponent implements AfterViewInit {
  @ViewChild('initialLoading') initialLoading!: ElementRef;
  images: ImageItem[] = [
    {
      id: 1,
      src: 'https://picsum.photos/400/300?random=1',
      alt: 'Beautiful landscape 1',
      title: 'Mountain View',
      description: 'Stunning mountain landscape with clear blue sky'
    },
    {
      id: 2,
      src: 'https://picsum.photos/400/300?random=2',
      alt: 'Beautiful landscape 2',
      title: 'Ocean Sunset',
      description: 'Peaceful ocean sunset with golden reflections'
    },
    {
      id: 3,
      src: 'https://picsum.photos/400/300?random=3',
      alt: 'Beautiful landscape 3',
      title: 'Forest Path',
      description: 'Serene forest path surrounded by tall trees'
    },
    {
      id: 4,
      src: 'https://picsum.photos/400/300?random=4',
      alt: 'Beautiful landscape 4',
      title: 'City Lights',
      description: 'Vibrant city lights at night with modern architecture'
    },
    {
      id: 5,
      src: 'https://picsum.photos/400/300?random=5',
      alt: 'Beautiful landscape 5',
      title: 'Desert Dunes',
      description: 'Majestic desert dunes under the warm sun'
    },
    {
      id: 6,
      src: 'https://picsum.photos/400/300?random=6',
      alt: 'Beautiful landscape 6',
      title: 'Northern Lights',
      description: 'Magical northern lights dancing in the night sky'
    },
    {
      id: 7,
      src: 'https://picsum.photos/400/300?random=7',
      alt: 'Beautiful landscape 7',
      title: 'Waterfall',
      description: 'Powerful waterfall cascading down rocky cliffs'
    },
    {
      id: 8,
      src: 'https://picsum.photos/400/300?random=8',
      alt: 'Beautiful landscape 8',
      title: 'Autumn Colors',
      description: 'Vibrant autumn foliage in golden and red hues'
    },
    {
      id: 9,
      src: 'https://picsum.photos/400/300?random=9',
      alt: 'Beautiful landscape 9',
      title: 'Winter Wonderland',
      description: 'Snow-covered landscape with frosty trees'
    },
    {
      id: 10,
      src: 'https://picsum.photos/400/300?random=10',
      alt: 'Beautiful landscape 10',
      title: 'Tropical Beach',
      description: 'Pristine tropical beach with turquoise waters'
    }
  ];

  trackByImageId(index: number, image: ImageItem): number {
    return image.id;
  }

  onImageLoad(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.classList.add('loaded');
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.style.display = 'none';
    // You could show a fallback image here
  }

  ngAfterViewInit(): void {
    // Hide initial loading after a short delay
    setTimeout(() => {
      if (this.initialLoading?.nativeElement) {
        this.initialLoading.nativeElement.style.display = 'none';
      }
    }, 1000);
  }
}
