'use client';

import { useEffect, useRef, useState } from 'react';
import {
  Chart, LineController, LineElement, PointElement, LinearScale,
  CategoryScale, Filler, Tooltip, Legend,
} from 'chart.js';

Chart.register(LineController, LineElement, PointElement, LinearScale, CategoryScale, Filler, Tooltip, Legend);

interface Props {
  labels: string[];
  data: number[];
}

export function PriceChart({ labels, data }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)');
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    if (!canvasRef.current) return;
    if (chartRef.current) { chartRef.current.destroy(); chartRef.current = null; }
    if (!labels.length || !data.length) return;

    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, 'rgba(255, 153, 0, 0.45)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

    // Trim X-axis labels on mobile — show only ~5 evenly spaced ticks
    const maxTicksX = isMobile ? 5 : 10;

    chartRef.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label: 'Price',
          data,
          borderColor: '#FF9900',
          backgroundColor: gradient,
          borderWidth: isMobile ? 2.5 : 3,
          pointBackgroundColor: '#fff',
          pointBorderColor: '#FF9900',
          pointRadius: isMobile ? 0 : 3,
          pointHoverRadius: isMobile ? 5 : 6,
          pointHitRadius: 12,
          fill: true,
          tension: 0.4,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        plugins: {
          legend: { display: false },
          tooltip: {
            mode: 'index',
            intersect: false,
            padding: 8,
            titleFont: { size: isMobile ? 10 : 12 },
            bodyFont: { size: isMobile ? 11 : 13, weight: 'bold' },
            callbacks: {
              label: (c) => '₹' + (c.parsed.y as number).toLocaleString('en-IN'),
            },
          },
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: {
              maxTicksLimit: maxTicksX,
              autoSkip: true,
              font: { size: isMobile ? 9 : 11 },
              color: '#9CA3AF',
              maxRotation: 0,
            },
          },
          y: {
            border: { dash: [4, 4] },
            ticks: {
              maxTicksLimit: isMobile ? 4 : 6,
              font: { size: isMobile ? 9 : 11 },
              color: '#9CA3AF',
              callback: (val) => '₹' + Number(val).toLocaleString('en-IN'),
            },
          },
        },
      },
    });

    return () => { chartRef.current?.destroy(); chartRef.current = null; };
  }, [labels, data, isMobile]);

  if (!labels.length || !data.length) {
    return (
      <p className="text-center text-gray-400 py-16 font-medium">
        No price history available for this product yet.<br />
        <span className="text-xs text-gray-300">Price stats above are from current marketplace data.</span>
      </p>
    );
  }

  return (
    <div className="relative w-full h-48 md:h-96">
      <canvas ref={canvasRef} />
    </div>
  );
}
