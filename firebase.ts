@import "tailwindcss";

@layer base {
  :root {
    --paper-white: #FAFBFC;
    --checked-blue: #C9E2F5;
    --ink-navy: #1B3A5C;
    --notebook-red: #E63946;
    --sticky-yellow: #FFD93D;
  }

  body {
    background-color: var(--paper-white);
    background-image: 
      linear-gradient(to right, rgba(201, 226, 245, 0.45) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(201, 226, 245, 0.45) 1px, transparent 1px);
    background-size: 24px 24px;
    color: var(--ink-navy);
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  }
}

/* Custom Marker Underline */
.marker-underline {
  position: relative;
  display: inline-block;
}

.marker-underline::after {
  content: '';
  position: absolute;
  left: -4px;
  bottom: 2px;
  width: calc(100% + 8px);
  height: 8px;
  background-color: var(--notebook-red);
  opacity: 0.85;
  z-index: -1;
  transform: rotate(-1deg) skewX(-12deg);
  border-radius: 4px;
}

/* Notebook Card Pinned Effect */
.notebook-card {
  background-color: var(--paper-white);
  border: 1.5px solid rgba(27, 58, 92, 0.15);
  box-shadow: 2px 4px 12px rgba(27, 58, 92, 0.08);
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

.notebook-card:hover {
  transform: translateY(-4px) rotate(0deg) !important;
  box-shadow: 4px 8px 20px rgba(27, 58, 92, 0.14);
}

/* Coupon Dashed Form */
.coupon-border {
  border: 2px dashed rgba(27, 58, 92, 0.3);
  background-color: #ffffff;
  box-shadow: 0 10px 30px rgba(27, 58, 92, 0.06);
}

/* Sticky Note Style */
.sticky-note {
  background-color: var(--sticky-yellow);
  color: var(--ink-navy);
  box-shadow: 2px 3px 8px rgba(27, 58, 92, 0.12);
}

/* Custom Pill Button */
.btn-notebook-red {
  background-color: var(--notebook-red);
  color: #FFFFFF;
  font-weight: 700;
  border-radius: 9999px;
  transition: transform 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease;
}

.btn-notebook-red:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(230, 57, 70, 0.35);
  background-color: #D62839;
}

/* Toast Animations */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(12px) scale(0.97);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.animate-fade-in-up {
  animation: fadeInUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

/* Custom Scrollbar */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}
::-webkit-scrollbar-track {
  background: var(--paper-white);
}
::-webkit-scrollbar-thumb {
  background: #C9E2F5;
  border-radius: 4px;
}
::-webkit-scrollbar-thumb:hover {
  background: #9BC5E8;
}
