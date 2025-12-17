import type { ComponentPattern } from './index';

export const IMAGE_COMPONENTS: ComponentPattern[] = [
  {
    id: 'image-simple',
    name: 'Simple Image',
    description: 'Basic image component with alt text, dimensions, and source URL',
    category: 'content',
    components: ['Img', 'Tailwind'],
    placeholders: ['imageUrl', 'imageAlt', 'imageWidth', 'imageHeight', 'alignment'],
    preview: 'Use for simple image display with customizable dimensions and alignment',
    template: `<Tailwind>
  <Img
    alt="{{imageAlt}}"
    className="{{alignment}}"
    width={{imageWidth}}
    height={{imageHeight}}
    src="{{imageUrl}}"
  />  
</Tailwind>`
  },
  {
    id: 'image-rounded',
    name: 'Rounded Image',
    description: 'Image with rounded corners and customizable dimensions',
    category: 'content',
    components: ['Img', 'Tailwind'],
    placeholders: ['imageUrl', 'imageAlt', 'imageWidth', 'imageHeight', 'borderRadius', 'alignment', 'margin'],
    preview: 'Use for images with rounded corners',
    template: `<Tailwind>
  <Img
    alt="{{imageAlt}}"
    className="{{borderRadius}} {{margin}} {{alignment}}"
    width={{imageWidth}}
    height={{imageHeight}}
    src="{{imageUrl}}"
  />  
</Tailwind>`
  },
  {
    id: 'image-varying-sizes',
    name: 'Images with Varying Sizes',
    description: 'Multiple images displayed at different sizes (small, medium, large)',
    category: 'content',
    components: ['Img', 'Tailwind'],
    placeholders: ['imageUrl', 'imageAlt', 'image1Width', 'image1Height', 'image2Width', 'image2Height', 'image3Width', 'image3Height', 'borderRadius', 'margin'],
    preview: 'Use for displaying the same image at different sizes for comparison or visual variety',
    template: `<Tailwind>
  <>
    <Img
      alt="{{imageAlt}}"
      className="{{borderRadius}} {{margin}} mx-auto"
      width={{image1Width}}
      height={{image1Height}}
      src="{{imageUrl}}"
    />
    <Img
      alt="{{imageAlt}}"
      className="{{borderRadius}} {{margin}} mx-auto"
      width={{image2Width}}
      height={{image2Height}}
      src="{{imageUrl}}"
    />
    <Img
      alt="{{imageAlt}}"
      className="{{borderRadius}} {{margin}} mx-auto"
      width={{image3Width}}
      height={{image3Height}}
      src="{{imageUrl}}"
    />
  </>  
</Tailwind>`
  },
];


