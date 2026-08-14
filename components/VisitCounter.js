'use client';

import { useEffect, useState } from 'react';
import { Users } from 'lucide-react';

const COUNTER_KEY = 'image-convert-total-visits-2025';

export default function VisitCounter() {
  const [count, setCount] = useState(null);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    fetch(`https://countapi.mileshilliard.com/api/v1/hit/${COUNTER_KEY}`)
      .then((res) => res.json())
      .then((data) => {
        const num = parseInt(data.value, 10);
        if (!isNaN(num)) {
          setCount(num);
          setTimeout(() => setAnimate(true), 50);
        }
      })
      .catch(() => {
        setCount(null);
      });
  }, []);

  if (count === null) return null;

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        fontSize: '11px',
        color: '#6366f1',
        fontFamily: 'monospace',
        background: 'rgba(99,102,241,0.08)',
        border: '1px solid rgba(99,102,241,0.2)',
        borderRadius: '999px',
        padding: '4px 12px',
        transition: 'opacity 0.4s ease, transform 0.4s ease',
        opacity: animate ? 1 : 0,
        transform: animate ? 'translateY(0)' : 'translateY(6px)',
      }}
      title="Total visits since launch"
    >
      <Users size={12} strokeWidth={2.5} />
      <span>
        <strong style={{ color: '#818cf8', letterSpacing: '0.5px' }}>
          {count.toLocaleString()}
        </strong>
        {' '}total visits
      </span>
    </div>
  );
}
