'use client';

import { Plus, Edit, Trash2 } from 'lucide-react';
import type { CodeChange } from '@/lib/email-v3/diff-generator';

interface ChangeLogProps {
  changes: CodeChange[];
}

export function ChangeLog({ changes }: ChangeLogProps) {
  if (!changes || changes.length === 0) {
    return null;
  }

  return (
    <div className="mt-2 space-y-1.5 animate-fadeIn">
      {changes.map((change, i) => (
        <ChangeItem key={i} change={change} delay={i * 100} />
      ))}
    </div>
  );
}

interface ChangeItemProps {
  change: CodeChange;
  delay: number;
}

function ChangeItem({ change, delay }: ChangeItemProps) {
  const getIcon = () => {
    switch (change.type) {
      case 'added':
        return <Plus className="w-3.5 h-3.5 text-green-500" />;
      case 'modified':
        return <Edit className="w-3.5 h-3.5 text-primary" />;
      case 'removed':
        return <Trash2 className="w-3.5 h-3.5 text-red-500" />;
    }
  };

  const getColor = () => {
    switch (change.type) {
      case 'added':
        return 'bg-green-500/10 border-green-500/20';
      case 'modified':
        return 'bg-primary/10 border-primary/20';
      case 'removed':
        return 'bg-red-500/10 border-red-500/20';
    }
  };

  return (
    <div
      className={`flex items-start gap-2 text-xs px-2.5 py-1.5 rounded-md border ${getColor()} opacity-0 animate-slideInUp`}
      style={{ animationDelay: `${delay}ms`, animationFillMode: 'forwards' }}
    >
      <div className="mt-0.5">{getIcon()}</div>
      
      <div className="flex-1 min-w-0">
        <span className="text-foreground font-medium">{change.description}</span>
        
        {/* Show before/after for text changes */}
        {change.oldValue && change.newValue && change.property === 'text' && (
          <div className="mt-1 space-y-0.5">
            <div className="text-muted-foreground line-through truncate">
              {truncate(change.oldValue, 40)}
            </div>
            <div className="text-green-400 truncate">
              {truncate(change.newValue, 40)}
            </div>
          </div>
        )}
        
        {/* Show property changes (colors, sizes, etc.) */}
        {change.oldValue && change.newValue && change.property !== 'text' && (
          <div className="mt-1 text-muted-foreground">
            {isUrl(change.oldValue) ? (
              // Special handling for URLs - show truncated version
              <div className="space-y-0.5">
                <div className="text-muted-foreground line-through truncate text-xs" title={change.oldValue}>
                  {truncateUrl(change.oldValue)}
                </div>
                <div className="text-green-400 truncate text-xs" title={change.newValue}>
                  {truncateUrl(change.newValue)}
                </div>
              </div>
            ) : (
              // Normal property changes (colors, sizes)
              <>
                <span className="line-through">{change.oldValue}</span>
                {' → '}
                <span className="text-green-400 font-medium">{change.newValue}</span>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

function isUrl(text: string): boolean {
  return text.startsWith('http://') || text.startsWith('https://');
}

function truncateUrl(url: string): string {
  if (url.length <= 50) return url;
  
  // For URLs, show domain + start of path
  try {
    const urlObj = new URL(url);
    const domain = urlObj.hostname;
    const path = urlObj.pathname + urlObj.search;
    
    if (path.length > 20) {
      return `${domain}${path.substring(0, 20)}...`;
    }
    return `${domain}${path}`;
  } catch {
    // If URL parsing fails, just truncate from start
    return url.substring(0, 50) + '...';
  }
}

// Add animations to global CSS if not already present
// You can add these to your globals.css:
/*
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fadeIn {
  animation: fadeIn 0.3s ease-out;
}

.animate-slideInUp {
  animation: slideInUp 0.3s ease-out;
}
*/

