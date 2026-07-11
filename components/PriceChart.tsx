'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Chart, LineController, LineElement, PointElement, LinearScale,
  CategoryScale, Filler, Tooltip, Legend,
} from 'chart.js';

Chart.register(LineController, LineElement, PointElement, LinearScale, CategoryScale, Filler, Tooltip, Legend);

interface Props {
  labels: string[];
  data: number[];
  dates?: string[]; // ISO YYYY-MM-DD, aligned with labels/data
}

type Range = '7' | '30' | '90' | 'max';

const RANGES: { key: Range; label: string; days: number | null }[] = [
  { key: '7',   label: '7D',  days: 7 },
  { key: '30',  label: '30D', days: 30 },
  { key: '90',  label: '90D', days: 90 },
  { key: 'max', label: 'Max', days: null },
];

function daysAgoISO(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString().slice(0, 10);
}

export function PriceChart({ labels, data, dates }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [range, setRange] = useState<Range>('max');

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)');
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  // What ranges do we actually have enough data to show?
  const availability = useMemo(() => {
    if (!dates || dates.length === 0) {
      return { '7': false, '30': false, '90': false, max: true };
    }
    const oldest = dates[0];
    return {
      '7':   oldest <= daysAgoISO(7)  && dates.length >= 2,
      '30':  oldest <= daysAgoISO(30) && dates.length >= 2,
      '90':  oldest <= daysAgoISO(90) && dates.length >= 2,
      max:   true,
    } as Record<Range, boolean>;
  }, [dates]);

  // Slice data by range
  const view = useMemo(() => {
    if (!dates || range === 'max') return { labels, data };
    const days = RANGES.find((r) => r.key === range)?.days ?? null;
    if (days === null) return { labels, data };
    const cutoff = daysAgoISO(days);
    const startIdx = dates.findIndex((d) => d >= cutoff);
    if (startIdx <= 0) return { labels, data };
    return { labels: labels.slice(startIdx), data: data.slice(startIdx) };
  }, [labels, data, dates, range]);

  useEffect(() => {
    if (!canvasRef.current) return;
    if (chartRef.current) { chartRef.current.destroy(); chartRef.current = null; }
    if (!view.labels.length || !view.data.length) return;

    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, 'rgba(255, 153, 0, 0.45)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

    const maxTicksX = isMobile ? 5 : 10;

    chartRef.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: view.labels,
        datasets: [{
          label: 'Price',
          data: view.data,
          borderColor: '#FF9900',
          backgroundColor: gradient,
          borderWidth: isMobile ? 2.5 : 3,
          pointBackgroundColor: '#fff',
          pointBorderColor: '#FF9900',
          pointRadius: isMobile ? 0 : (view.data.length <= 15 ? 4 : 3),
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
        animation: { duration: 400 },
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
  }, [view, isMobile]);

  if (!labels.length || !data.length) {
    return (
      <>
        <ChartHeader range={range} onChange={setRange} availability={{ '7': false, '30': false, '90': false, max: false }} />
        <p className="text-center text-gray-400 py-10 md:py-16 font-medium text-sm">
          No price history available for this product yet.<br />
          <span className="text-xs text-gray-300">Price stats above are from current marketplace data.</span>
        </p>
      </>
    );
  }

  return (
    <>
      <ChartHeader range={range} onChange={setRange} availability={availability} />
      <div className="relative w-full h-48 md:h-96">
        <canvas ref={canvasRef} />
      </div>
    </>
  );
}

function ChartHeader({
  range, onChange, availability,
}: {
  range: Range;
  onChange: (r: Range) => void;
  availability: Record<Range, boolean>;
}) {
  return (
    <div className="flex items-center justify-between mb-3 md:mb-4 gap-2">
      <h3 className="text-sm md:text-lg font-bold text-gray-800 border-l-4 border-yellow-500 pl-2 md:pl-3">
        Price History
      </h3>
      <div className="inline-flex bg-gray-100 rounded-lg p-0.5 md:p-1">
        {RANGES.map((r) => {
          const available = availability[r.key];
          const active = range === r.key;
          return (
            <button
              key={r.key}
              type="button"
              onClick={() => available && onChange(r.key)}
              disabled={!available}
              className={
                'px-2 md:px-3 py-1 text-[11px] md:text-xs font-bold rounded-md transition-all ' +
                (active
                  ? 'bg-white text-orange-600 shadow-sm'
                  : available
                    ? 'text-gray-600 hover:text-gray-900'
                    : 'text-gray-300 cursor-not-allowed')
              }
              aria-label={`Show last ${r.label}`}
            >
              {r.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
