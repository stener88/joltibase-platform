import { CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function UnsubscribeSuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-6 flex justify-center">
          <CheckCircle className="w-16 h-16 text-green-500" />
        </div>
        
        <h1 className="text-3xl font-bold text-foreground mb-4">
          You've been unsubscribed
        </h1>
        
        <p className="text-muted-foreground mb-8">
          You will no longer receive emails from us. If you change your mind, you can always resubscribe by contacting us.
        </p>

        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            This was a mistake?
          </p>
          <Link
            href="/"
            className="inline-block px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            Return to Homepage
          </Link>
        </div>

        <div className="mt-8 pt-8 border-t border-border">
          <p className="text-xs text-muted-foreground">
            If you continue to receive emails, please contact support.
          </p>
        </div>
      </div>
    </div>
  );
}

