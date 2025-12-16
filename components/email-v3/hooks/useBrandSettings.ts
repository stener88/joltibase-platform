import { useState, useEffect, useCallback } from 'react';
import type { BrandIdentity } from '@/lib/types/brand';

/**
 * Hook for managing brand settings
 * Handles fetching and saving brand identity
 */
export function useBrandSettings() {
  const [brandSettings, setBrandSettings] = useState<BrandIdentity | null>(null);

  // Fetch brand settings on mount
  useEffect(() => {
    const fetchBrand = async () => {
      try {
        const response = await fetch('/api/brand');
        if (response.ok) {
          const data = await response.json();
          setBrandSettings(data.brand);
        }
      } catch (error) {
        console.error('[EmailEditor] Failed to fetch brand:', error);
      }
    };
    fetchBrand();
  }, []);

  // Save brand settings handler
  const handleBrandSettingsSave = useCallback(async (brand: BrandIdentity) => {
    try {
      const response = await fetch('/api/brand', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(brand),
      });
      if (response.ok) {
        const data = await response.json();
        setBrandSettings(data.brand);
      }
    } catch (error) {
      console.error('[EmailEditor] Failed to save brand:', error);
    }
  }, []);

  return {
    brandSettings,
    onBrandSettingsSave: handleBrandSettingsSave,
  };
}

