import { Component, OnInit, AfterViewInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements AfterViewInit {
  title = 'portfolio';
  typedText = '';
  fullText = 'I build things for the web and beyond.';
  menuOpen = false;
  currentSlide = 0;
  totalProjects = 8;
  projectDots = Array(this.totalProjects).fill(0);
  slideWidth = 100;
  touchStartX = 0;

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  closeMenu() {
    this.menuOpen = false;
  }

  nextSlide() {
    if (this.currentSlide < this.totalProjects - 1) {
      this.currentSlide++;
    }
  }

  prevSlide() {
    if (this.currentSlide > 0) {
      this.currentSlide--;
    }
  }

  goToSlide(index: number) {
    this.currentSlide = index;
  }

  onTouchStart(event: TouchEvent) {
    this.touchStartX = event.touches[0].clientX;
  }

  onTouchEnd(event: TouchEvent) {
    const touchEndX = event.changedTouches[0].clientX;
    const diff = this.touchStartX - touchEndX;
    if (diff > 50) {
      this.nextSlide();
    } else if (diff < -50) {
      this.prevSlide();
    }
  }

  ngAfterViewInit() {
    // Typing effect
    let i = 0;
    const typeInterval = setInterval(() => {
      if (i < this.fullText.length) {
        this.typedText += this.fullText.charAt(i);
        const el = document.getElementById('typed-text');
        if (el) el.textContent = this.typedText;
        i++;
      } else {
        clearInterval(typeInterval);
      }
    }, 60);

    // Matrix code
    const canvas = document.getElementById('matrix-canvas') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d')!;

    const setSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    setSize();
    window.addEventListener('resize', setSize);

    const chars = '01アイウエオカキクケコ';
    const fontSize = 16;

    type Drop = {
      x: number;
      y: number;
      speed: number;
      length: number;
      chars: string[];
    };

    const makeDrops = (): Drop[] => {
      const columns = Math.floor(canvas.width / fontSize);
      return Array.from({ length: columns }, (_, i) => ({
        x: i * fontSize,
        y: Math.random() * canvas.height / fontSize,
        speed: Math.random() * 0.3 + 0.1,
        length: Math.floor(Math.random() * 25) + 15,
        chars: Array.from({ length: 40 }, () => chars[Math.floor(Math.random() * chars.length)])
      }));
    };

    let drops = makeDrops();
    window.addEventListener('resize', () => drops = makeDrops());

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      drops.forEach(drop => {
        for (let j = 0; j < drop.length; j++) {
          const yPos = (drop.y - j) * fontSize;
          if (yPos < 0 || yPos > canvas.height) continue;

          if (j === 0) {
            // Bright white head character
            ctx.fillStyle = `rgba(57, 255, 20, 0.09)`;
          } else {
            const alpha = (1 - j / drop.length) * 0.06;
            ctx.fillStyle = `rgba(57, 255, 20, ${alpha})`;
          }

          ctx.font = `${fontSize}px monospace`;
          ctx.fillText(drop.chars[j % drop.chars.length], drop.x, yPos);
        }

        drop.y += drop.speed;

        if ((drop.y - drop.length) * fontSize > canvas.height) {
          drop.y = Math.random() * -100;
          drop.speed = Math.random() * 0.3 + 0.1;
          drop.length = Math.floor(Math.random() * 25) + 15;
          drop.chars = Array.from({ length: 40 }, () => chars[Math.floor(Math.random() * chars.length)]);
        }
      });
    }

    setInterval(draw, 40);

    // Scroll animations
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.project-card, .section-title, .about-text, .skill-category, .terminal').forEach(el => {
      observer.observe(el);
    });
  }
}

