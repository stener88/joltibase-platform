'use client';

/**
 * Soft Grainy Gradient Background
 * Gradient from light blue-grey to warm orange-red with grainy texture
 */
export function GradientBackground() {
  return (
    <div 
      className="fixed inset-0 -z-10"
      style={{
        backgroundImage: `
          linear-gradient(to bottom, #a8b5c5 0%, #c5b0a0 100%),
          radial-gradient(circle at 20% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
          radial-gradient(circle at 80% 80%, rgba(255, 200, 150, 0.1) 0%, transparent 50%)
        `,
        backgroundSize: '100% 100%, 100% 100%, 100% 100%',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
      }}
    >
      {/* Grainy texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            repeating-linear-gradient(0deg, rgba(0, 0, 0, 0.15) 0px, transparent 1px, transparent 2px, rgba(0, 0, 0, 0.15) 3px),
            repeating-linear-gradient(90deg, rgba(0, 0, 0, 0.15) 0px, transparent 1px, transparent 2px, rgba(0, 0, 0, 0.15) 3px)
          `,
          backgroundSize: '2px 2px',
          backgroundRepeat: 'repeat',
        }}
      />
    </div>
  );
}
