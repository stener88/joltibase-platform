/**
 * Layout Config Types
 * 
 * TypeScript interfaces for layout factory configuration.
 * Enables runtime generation of renderer functions and React settings components.
 */

/**
 * Element types that can be rendered in a layout
 */
export type ElementType = 
  | 'header'
  | 'title'
  | 'subtitle'
  | 'badge'
  | 'divider'
  | 'paragraph'
  | 'button'
  | 'image'
  | 'items'; // For stats/grid layouts

/**
 * Layout structure types
 */
export type LayoutStructure = 
  | 'single-column'
  | 'two-column'
  | 'multi-column'
  | 'grid';

/**
 * Definition of a single element in the layout
 */
export interface ElementDefinition {
  /** Type of element to render */
  type: ElementType;
  
  /** Key in content object (e.g., 'header', 'title') */
  contentKey: string;
  
  /** Label for the settings panel */
  label: string;
  
  /** Whether this element is required */
  required?: boolean;
  
  /** Settings key for show/hide toggle (e.g., 'showHeader') */
  visibilityKey?: string;
  
  /** Default visibility (defaults to true if not specified) */
  defaultVisible?: boolean;
  
  /** Element-specific rendering options */
  options?: {
    /** For buttons: include URL input */
    includeUrl?: boolean;
    
    /** For images: include alt text input */
    includeAltText?: boolean;
    
    /** For items (stats/grids): item structure */
    itemFields?: Array<{
      key: string;
      label: string;
      type: 'text' | 'number';
    }>;
  };
}

/**
 * Settings controls to show in the settings panel
 */
export interface SettingsControls {
  /** Show/hide toggles for elements */
  toggles?: string[];
  
  /** Color pickers to include */
  colors?: Array<{
    key: string;
    label: string;
    defaultValue?: string;
  }>;
  
  /** Show spacing/padding controls */
  spacing?: boolean;
  
  /** Show alignment controls */
  alignment?: boolean;
  
  /** Show flip layout toggle (for two-column layouts) */
  flip?: boolean;
  
  /** Custom controls (for advanced layouts) */
  custom?: Array<{
    type: 'checkbox' | 'select' | 'number';
    key: string;
    label: string;
    options?: string[];
    defaultValue?: any;
    placeholder?: string;
    min?: number;
    max?: number;
  }>;
}

/**
 * Default styling values
 */
export interface DefaultValues {
  /** Default background color */
  backgroundColor?: string;
  
  /** Default padding */
  padding?: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  
  /** Default text alignment */
  align?: 'left' | 'center' | 'right';
  
  /** Default title color */
  titleColor?: string;
  
  /** Default paragraph color */
  paragraphColor?: string;
  
  /** Default divider color */
  dividerColor?: string;
  
  /** Default title font size */
  titleFontSize?: string;
  
  /** Default paragraph font size */
  paragraphFontSize?: string;
  
  /** Default button background color */
  buttonBackgroundColor?: string;
  
  /** Default button text color */
  buttonTextColor?: string;
  
  /** Default button border radius */
  buttonBorderRadius?: string;
  
  /** Default button font size */
  buttonFontSize?: string;
}

/**
 * Complete layout configuration
 */
export interface LayoutConfig {
  /** Unique identifier (matches LayoutVariation) */
  id: string;
  
  /** Human-readable name */
  name: string;
  
  /** Description of the layout */
  description: string;
  
  /** Layout structure type */
  structure: LayoutStructure;
  
  /** Elements that make up this layout */
  elements: ElementDefinition[];
  
  /** Settings controls to show */
  settingsControls: SettingsControls;
  
  /** Default values */
  defaults: DefaultValues;
  
  /** Category for organization */
  category?: 'content' | 'two-column' | 'multi-column' | 'advanced';
  
  /** AI hints for layout selection */
  aiHints?: string[];
}

/**
 * Type for the renderer function signature
 */
export type LayoutRendererFunction = (
  content: any,
  settings: any,
  context: any
) => string;

