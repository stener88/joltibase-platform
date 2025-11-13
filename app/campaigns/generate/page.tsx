'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CampaignsGenerateRedirect() {
  const router = useRouter();
  
  useEffect(() => {
    router.replace('/');
  }, [router]);
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center">
        <div className="animate-spin h-8 w-8 border-4 border-[#e9a589] border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-gray-600">Redirecting...</p>
      </div>
    </div>
  );
}
