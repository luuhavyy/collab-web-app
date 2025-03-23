import { Component } from '@angular/core';

@Component({
  selector: 'app-banner',
  standalone: false,
  templateUrl: './banner.component.html',
  styleUrl: './banner.component.css'
})
export class BannerComponent {

  banners: any[]=[];
  currentIndex = 0;
  interval: any;

  constructor() {
    this.banners = [
      { image: "assets/images/home-banner1.png" },
      { image: "assets/images/home-banner2.png" },
      { image: "assets/images/home-banner3.png" }
    ];
    this.startAutoSlide();
  }

nextSlide() {
  this.currentIndex = (this.currentIndex + 1) % this.banners.length;
  console.log("Next Slide:", this.currentIndex); // Debug
}

prevSlide() {
  this.currentIndex = (this.currentIndex - 1 + this.banners.length) % this.banners.length;
  console.log("Previous Slide:", this.currentIndex); // Debug
}


  goToSlide(index: number) {
    this.currentIndex = index;
  }

  startAutoSlide() {
    this.interval = setInterval(() => {
      this.nextSlide();
    }, 3000);
  }

  stopAutoSlide() {
    clearInterval(this.interval);
  }

}
