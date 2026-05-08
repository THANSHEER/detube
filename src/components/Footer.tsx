import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="dt-footer-area flex items-center justify-center">
      <a
        href="https://geekstash.dev"
        target="_blank"
        rel="noopener noreferrer"
        className="text-[9px] font-semibold uppercase tracking-[0.14em] text-[var(--dt-text-muted)] hover:text-[var(--dt-accent)] transition-colors duration-150 cursor-pointer"
        onClick={(e) => {
          e.preventDefault();
          chrome.tabs.create({ url: 'https://geekstash.dev' });
        }}
      >
        GEEKSTASH.DEV
      </a>
    </footer>
  );
};
