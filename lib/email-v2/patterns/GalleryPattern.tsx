/**
 * Gallery Pattern Component
 * 
 * Image gallery with 4 layout variants
 * Uses React Email components with Tailwind for responsive layouts
 */

import { Section, Row, Column, Text, Img, Link, Tailwind } from '@react-email/components';
import type { GalleryBlock } from '../ai/blocks';
import type { GlobalEmailSettings } from '../types';

interface GalleryPatternProps {
  block: GalleryBlock;
  settings: GlobalEmailSettings;
}

export function GalleryPattern({ block, settings }: GalleryPatternProps) {
  const { variant = 'grid-2x2', heading, subheading, images } = block;

  return (
    <Tailwind>
      <Section className="my-[16px]">
        {/* Header Section */}
        {(heading || subheading) && (
          <Section className="mt-[42px]">
            <Row>
              {heading && (
                <Text className="m-0 font-semibold text-[16px] text-indigo-600 leading-[24px]">
                  {heading}
                </Text>
              )}
              {subheading && (
                <Text className="mt-[8px] text-[16px] text-gray-500 leading-[24px]">
                  {subheading}
                </Text>
              )}
            </Row>
          </Section>
        )}

        {/* Gallery Layout */}
        {variant === 'grid-2x2' && <Grid2x2 images={images} />}
        {variant === '3-column' && <ThreeColumn images={images} />}
        {variant === 'horizontal-split' && <HorizontalSplit images={images} />}
        {variant === 'vertical-split' && <VerticalSplit images={images} />}
      </Section>
    </Tailwind>
  );
}

// Grid 2x2 Layout (4 images in a grid)
function Grid2x2({ images }: { images: GalleryBlock['images'] }) {
  return (
    <Section className="mt-[16px]">
      <Row className="mt-[16px]">
        <Column className="w-[50%] pr-[8px]">
          {images[0] && (
            <GalleryImage image={images[0]} height={288} />
          )}
        </Column>
        <Column className="w-[50%] pl-[8px]">
          {images[1] && (
            <GalleryImage image={images[1]} height={288} />
          )}
        </Column>
      </Row>
      {images.length > 2 && (
        <Row className="mt-[16px]">
          <Column className="w-[50%] pr-[8px]">
            {images[2] && (
              <GalleryImage image={images[2]} height={288} />
            )}
          </Column>
          <Column className="w-[50%] pl-[8px]">
            {images[3] && (
              <GalleryImage image={images[3]} height={288} />
            )}
          </Column>
        </Row>
      )}
    </Section>
  );
}

// 3-Column Layout
function ThreeColumn({ images }: { images: GalleryBlock['images'] }) {
  return (
    <Section className="mt-[16px]">
      <Row>
        {images.slice(0, 3).map((image, index) => (
          <Column key={index} className="w-1/3 pr-[8px]">
            <GalleryImage image={image} height={186} />
          </Column>
        ))}
      </Row>
    </Section>
  );
}

// Horizontal Split Layout (left side has 2 stacked images, right side has 1 large image)
function HorizontalSplit({ images }: { images: GalleryBlock['images'] }) {
  return (
    <Section className="mt-[16px]">
      <Row className="mt-[16px]">
        <Column className="w-1/2 pr-[8px]">
          <Row className="pb-[8px]">
            <td>
              {images[0] && (
                <GalleryImage image={images[0]} height={152} />
              )}
            </td>
          </Row>
          <Row className="pt-[8px]">
            <td>
              {images[1] && (
                <GalleryImage image={images[1]} height={152} />
              )}
            </td>
          </Row>
        </Column>
        <Column className="w-1/2 py-[8px] pl-[8px]">
          {images[2] && (
            <GalleryImage image={images[2]} height={320} />
          )}
        </Column>
      </Row>
    </Section>
  );
}

// Vertical Split Layout (top image, bottom has 2 side-by-side)
function VerticalSplit({ images }: { images: GalleryBlock['images'] }) {
  return (
    <Section className="mt-[16px]">
      {images[0] && (
        <GalleryImage image={images[0]} height={288} />
      )}
      <Row className="mt-[16px]">
        <Column className="w-1/2 pr-[8px]">
          {images[1] && (
            <GalleryImage image={images[1]} height={288} />
          )}
        </Column>
        <Column className="w-1/2 pl-[8px]">
          {images[2] && (
            <GalleryImage image={images[2]} height={288} />
          )}
        </Column>
      </Row>
    </Section>
  );
}

// Helper component for rendering a single gallery image
function GalleryImage({ image, height }: { image: GalleryBlock['images'][0]; height: number }) {
  const imageElement = (
    <Img
      alt={image.alt}
      className="w-full rounded-[12px] object-cover"
      height={height}
      src={image.url}
    />
  );

  if (image.link) {
    return (
      <Link href={image.link}>
        {imageElement}
      </Link>
    );
  }

  return imageElement;
}

