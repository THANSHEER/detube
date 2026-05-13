import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="dt-footer-area flex items-center justify-between">
      <button
        className="text-[8px] font-bold uppercase tracking-[0.16em] text-[var(--dt-text-muted)] hover:text-[var(--dt-accent)] transition-colors duration-150 cursor-pointer bg-transparent border-none p-0"
        onClick={() => chrome.tabs.create({ url: 'https://geekstash.dev' })}
      >
        Geekstash.dev
      </button>
      <span className="text-[8px] font-medium text-[var(--dt-text-muted)] opacity-40 select-none">
        v2.0.1
      </span>
    </footer>
  );
};
