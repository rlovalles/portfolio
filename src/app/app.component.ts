import { Component, OnInit, AfterViewInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements AfterViewInit {
  title = 'portfolio';

  ngAfterViewInit() {
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
  }
}
