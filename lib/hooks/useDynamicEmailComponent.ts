import { useState, useEffect } from 'react';
import { compileComponent } from '@/lib/browser/esbuild-service';
import React from 'react';

export function useDynamicEmailComponent(
  tsxCode: string,
  props: Record<string, any>,
  stripWrapper?: boolean
) {
  const [Component, setComponent] = useState<any>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    let mounted = true;
    
    async function load() {
      try {
        setLoading(true);
        
        if (!tsxCode) {
          if (mounted) {
            setComponent(null);
            setLoading(false);
          }
          return;
        }
        
        // Ensure React is globally available for compiled code
        if (typeof window !== 'undefined') {
          (window as any).React = React;
        }
        
        // Compile TSX to JavaScript (in browser!)
        const compiled = await compileComponent(tsxCode);
        
        // Execute compiled code - esbuild IIFE creates EmailComponent variable
        const captureFunc = new Function('React', `
          ${compiled}
          return typeof EmailComponent !== 'undefined' ? EmailComponent : null;
        `);
        
        const EmailComponent = captureFunc(React);
        const ComponentToUse = EmailComponent?.default || EmailComponent;
        
        if (mounted && ComponentToUse) {
          // If stripWrapper is true, create a wrapper that extracts content
          // React Email components render Html > Body > Container structure
          // We want to skip Html/Body and render just the content
          if (stripWrapper) {
            const WrappedComponent = (componentProps: any) => {
              // Render the component first
              const fullRender = ComponentToUse(componentProps);
              
              // Navigate the React element tree to find Container content
              // Expected structure: Html > Body > Container
              try {
                // fullRender is the Html element
                if (fullRender && fullRender.props && fullRender.props.children) {
                  // Html's children is typically Body
                  const bodyElement = fullRender.props.children;
                  
                  if (bodyElement && bodyElement.props && bodyElement.props.children) {
                    // Body's children is what we want (Container and its contents)
                    return bodyElement.props.children;
                  }
                }
                
                // Fallback: if structure is unexpected, return children directly
                console.warn('[useDynamicEmailComponent] Unexpected component structure, returning children');
                return fullRender.props?.children || fullRender;
              } catch (err) {
                console.error('[useDynamicEmailComponent] Error extracting content:', err);
                // Last resort: return the full render (will cause hydration error, but won't crash)
                return fullRender;
              }
            };
            
            setComponent(() => WrappedComponent);
          } else {
            setComponent(() => ComponentToUse);
          }
          setError(null);
        } else {
          throw new Error('No component exported from compiled code');
        }
      } catch (err) {
        if (mounted) {
          setError(err as Error);
          console.error('[useDynamicEmailComponent] Error:', err);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }
    
    load();
    
    return () => { mounted = false; };
  }, [tsxCode, stripWrapper]); // Recompile only when TSX changes, NOT when props change
  
  return { Component, error, loading };
}

