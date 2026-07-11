'use client';

import { useEffect, useRef } from 'react';
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

  useEffect(() => {
    if (!canvasRef.current) return;
    if (chartRef.current) { chartRef.current.destroy(); chartRef.current = null; }
    if (!labels.length || !data.length) return;

    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, 'rgba(255, 153, 0, 0.5)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

    chartRef.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label: 'Price',
          data,
          borderColor: '#FF9900',
          backgroundColor: gradient,
          borderWidth: 3,
          pointBackgroundColor: '#fff',
          pointBorderColor: '#FF9900',
          pointRadius: 4,
          pointHoverRadius: 6,
          fill: true,
          tension: 0.3,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            mode: 'index',
            intersect: false,
            callbacks: {
              label: (c) => '₹' + (c.parsed.y as number).toLocaleString('en-IN'),
            },
          },
        },
        scales: {
          x: { grid: { display: false } },
          y: {
            border: { dash: [4, 4] },
            ticks: {
              callback: (val) => '₹' + Number(val).toLocaleString('en-IN'),
            },
          },
        },
      },
    });

    return () => { chartRef.current?.destroy(); chartRef.current = null; };
  }, [labels, data]);

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
