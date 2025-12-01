'use client';

/**
 * EmailSkeleton
 * Clean loading placeholder for the email preview
 */
export function EmailSkeleton() {
  return (
    <div className="flex flex-col h-full bg-background p-12">
      <div className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-2xl">
          {/* Email container skeleton */}
          <div className="bg-card rounded-lg border border-border overflow-hidden">
            {/* Header skeleton */}
            <div className="h-32 bg-muted animate-pulse" />

            {/* Content skeleton */}
            <div className="p-8 space-y-6">
              {/* Title */}
              <div className="space-y-3">
                <div className="h-6 bg-muted rounded w-3/4 animate-pulse" />
                <div className="h-4 bg-muted rounded w-1/2 animate-pulse" style={{ animationDelay: '150ms' }} />
              </div>

              {/* Paragraph 1 */}
              <div className="space-y-2">
                <div className="h-3 bg-muted rounded w-full animate-pulse" style={{ animationDelay: '300ms' }} />
                <div className="h-3 bg-muted rounded w-full animate-pulse" style={{ animationDelay: '450ms' }} />
                <div className="h-3 bg-muted rounded w-5/6 animate-pulse" style={{ animationDelay: '600ms' }} />
              </div>

              {/* Paragraph 2 */}
              <div className="space-y-2">
                <div className="h-3 bg-muted rounded w-full animate-pulse" style={{ animationDelay: '750ms' }} />
                <div className="h-3 bg-muted rounded w-4/5 animate-pulse" style={{ animationDelay: '900ms' }} />
              </div>

              {/* Button skeleton */}
              <div className="flex justify-center pt-4">
                <div className="h-12 bg-primary rounded-lg w-48 animate-pulse opacity-20" style={{ animationDelay: '1050ms' }} />
              </div>

              {/* Footer lines */}
              <div className="pt-6 space-y-2 border-t border-border">
                <div className="h-2 bg-muted rounded w-2/3 mx-auto animate-pulse" style={{ animationDelay: '1200ms' }} />
                <div className="h-2 bg-muted rounded w-1/2 mx-auto animate-pulse" style={{ animationDelay: '1350ms' }} />
              </div>
            </div>
          </div>

          {/* Loading text below */}
          <div className="mt-8 text-center">
            <div className="flex items-center justify-center gap-3">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-foreground rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-foreground rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-foreground rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
              <p className="text-sm text-muted-foreground font-medium">
                Crafting your perfect email...
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
