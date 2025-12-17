import type { ComponentPattern } from './index';

export const GALLERY_COMPONENTS: ComponentPattern[] = [
  {
    id: 'gallery-four-grid',
    name: 'Gallery - Four Images in Grid',
    description: 'Product gallery with heading section (category, title, description) and 2x2 image grid',
    category: 'content',
    components: ['Section', 'Row', 'Text', 'Column', 'Link', 'Img', 'Tailwind'],
    placeholders: ['categoryText', 'categoryColor', 'titleText', 'titleSize', 'titleColor', 'descriptionText', 'descriptionColor', 'image1Url', 'image1Alt', 'image1Link', 'image2Url', 'image2Alt', 'image2Link', 'image3Url', 'image3Alt', 'image3Link', 'image4Url', 'image4Alt', 'image4Link', 'imageHeight', 'borderRadius'],
    preview: 'Use for product galleries or image showcases with heading and 2x2 grid layout',
    template: `<Tailwind>
  <Section className="my-[16px]">
    <Section className="mt-[42px]">
      <Row>
        <Text className="m-0 font-semibold text-[16px] {{categoryColor}} leading-[24px]">
          {{categoryText}}
        </Text>
        <Text className="m-0 mt-[8px] font-semibold {{titleSize}} {{titleColor}} leading-[32px]">
          {{titleText}}
        </Text>
        <Text className="mt-[8px] text-[16px] {{descriptionColor}} leading-[24px]">
          {{descriptionText}}
        </Text>
      </Row>
    </Section>
    <Section className="mt-[16px]">
      <Row className="mt-[16px]">
        <Column className="w-[50%] pr-[8px]">
          <Link href="{{image1Link}}">
            <Img
              alt="{{image1Alt}}"
              className="w-full {{borderRadius}} object-cover"
              height={{imageHeight}}
              src="{{image1Url}}"
            />
          </Link>
        </Column>
        <Column className="w-[50%] pl-[8px]">
          <Link href="{{image2Link}}">
            <Img
              alt="{{image2Alt}}"
              className="w-full {{borderRadius}} object-cover"
              height={{imageHeight}}
              src="{{image2Url}}"
            />
          </Link>
        </Column>
      </Row>
      <Row className="mt-[16px]">
        <Column className="w-[50%] pr-[8px]">
          <Link href="{{image3Link}}">
            <Img
              alt="{{image3Alt}}"
              className="w-full {{borderRadius}} object-cover"
              height={{imageHeight}}
              src="{{image3Url}}"
            />
          </Link>
        </Column>
        <Column className="w-[50%] pl-[8px]">
          <Link href="{{image4Link}}">
            <Img
              alt="{{image4Alt}}"
              className="w-full {{borderRadius}} object-cover"
              height={{imageHeight}}
              src="{{image4Url}}"
            />
          </Link>
        </Column>
      </Row>
    </Section>
  </Section>  
</Tailwind>`
  },
  {
    id: 'gallery-horizontal-grid',
    name: 'Images on Horizontal Grid',
    description: 'Gallery with heading and horizontal grid layout: left column with 2 stacked images, right column with 1 tall image',
    category: 'content',
    components: ['Section', 'Row', 'Text', 'Column', 'Link', 'Img', 'Tailwind'],
    placeholders: ['categoryText', 'categoryColor', 'titleText', 'titleSize', 'titleColor', 'descriptionText', 'descriptionColor', 'image1Url', 'image1Alt', 'image1Link', 'image2Url', 'image2Alt', 'image2Link', 'image3Url', 'image3Alt', 'image3Link', 'imageHeight', 'imageSpacing', 'borderRadius'],
    preview: 'Use for product galleries with asymmetric layout - 2 stacked images on left, 1 tall image on right',
    template: `<Tailwind>
  <Section className="my-[16px]">
    <Section>
      <Row>
        <Text className="m-0 font-semibold text-[16px] {{categoryColor}} leading-[24px]">
          {{categoryText}}
        </Text>
        <Text className="m-0 mt-[8px] font-semibold {{titleSize}} {{titleColor}} leading-[32px]">
          {{titleText}}
        </Text>
        <Text className="mt-[8px] text-[16px] {{descriptionColor}} leading-[24px]">
          {{descriptionText}}
        </Text>
      </Row>
    </Section>
    <Section className="mt-[16px]">
      <Row className="mt-[16px]">
        <Column className="w-1/2 pr-[8px]">
          <Row className="pb-[8px]">
            <td>
              <Link href="{{image1Link}}">
                <Img
                  alt="{{image1Alt}}"
                  className="w-full {{borderRadius}} object-cover"
                  height={{imageHeight}}
                  src="{{image1Url}}"
                />
              </Link>
            </td>
          </Row>
          <Row className="pt-[8px]">
            <td>
              <Link href="{{image2Link}}">
                <Img
                  alt="{{image2Alt}}"
                  className="w-full {{borderRadius}} object-cover"
                  height={{imageHeight}}
                  src="{{image2Url}}"
                />
              </Link>
            </td>
          </Row>
        </Column>
        <Column className="w-1/2 py-[8px] pl-[8px]">
          <Link href="{{image3Link}}">
            <Img
              alt="{{image3Alt}}"
              className="w-full {{borderRadius}} object-cover"
              height={{imageHeight * 2 + imageSpacing * 2}}
              src="{{image3Url}}"
            />
          </Link>
        </Column>
      </Row>
    </Section>
  </Section>  
</Tailwind>`
  },
  {
    id: 'gallery-three-columns',
    name: 'Three Columns with Images',
    description: 'Product gallery with heading section (category, title, description) and three images in a horizontal row',
    category: 'content',
    components: ['Section', 'Row', 'Text', 'Column', 'Link', 'Img', 'Tailwind'],
    placeholders: ['categoryText', 'categoryColor', 'titleText', 'titleSize', 'titleColor', 'descriptionText', 'descriptionColor', 'image1Url', 'image1Alt', 'image1Link', 'image2Url', 'image2Alt', 'image2Link', 'image3Url', 'image3Alt', 'image3Link', 'imageHeight', 'borderRadius'],
    preview: 'Use for product galleries with heading and three images displayed side by side',
    template: `<Tailwind>
  <Section className="my-[16px]">
    <Section>
      <Row>
        <Text className="m-0 font-semibold text-[16px] {{categoryColor}} leading-[24px]">
          {{categoryText}}
        </Text>
        <Text className="m-0 mt-[8px] font-semibold {{titleSize}} {{titleColor}} leading-[32px]">
          {{titleText}}
        </Text>
        <Text className="mt-[8px] text-[16px] {{descriptionColor}} leading-[24px]">
          {{descriptionText}}
        </Text>
      </Row>
    </Section>
    <Section>
      <Row>
        <Column className="w-1/3 pr-[8px]">
          <Link href="{{image1Link}}">
            <Img
              alt="{{image1Alt}}"
              className="w-full {{borderRadius}} object-cover"
              height={{imageHeight}}
              src="{{image1Url}}"
            />
          </Link>
        </Column>
        <Column className="w-1/3 px-[8px]">
          <Link href="{{image2Link}}">
            <Img
              alt="{{image2Alt}}"
              className="w-full {{borderRadius}} object-cover"
              height={{imageHeight}}
              src="{{image2Url}}"
            />
          </Link>
        </Column>
        <Column className="w-1/3 pl-[8px]">
          <Link href="{{image3Link}}">
            <Img
              alt="{{image3Alt}}"
              className="w-full {{borderRadius}} object-cover"
              height={{imageHeight}}
              src="{{image3Url}}"
            />
          </Link>
        </Column>
      </Row>
    </Section>
  </Section>  
</Tailwind>`
  },
  {
    id: 'gallery-vertical-grid',
    name: 'Images on Vertical Grid',
    description: 'Gallery with heading section, one full-width image on top, followed by two images side by side below',
    category: 'content',
    components: ['Section', 'Row', 'Text', 'Link', 'Img', 'Column', 'Tailwind'],
    placeholders: ['categoryText', 'categoryColor', 'titleText', 'titleSize', 'titleColor', 'descriptionText', 'descriptionColor', 'heroImageUrl', 'heroImageAlt', 'heroImageLink', 'image1Url', 'image1Alt', 'image1Link', 'image2Url', 'image2Alt', 'image2Link', 'imageHeight', 'borderRadius', 'spacing'],
    preview: 'Use for product galleries with a hero image on top and two supporting images below',
    template: `<Tailwind>
  <Section className="my-[16px]">
    <Section>
      <Row>
        <Text className="m-0 font-semibold text-[16px] {{categoryColor}} leading-[24px]">
          {{categoryText}}
        </Text>
        <Text className="m-0 mt-[8px] font-semibold {{titleSize}} {{titleColor}} leading-[32px]">
          {{titleText}}
        </Text>
        <Text className="mt-[8px] text-[16px] {{descriptionColor}} leading-[24px]">
          {{descriptionText}}
        </Text>
      </Row>
    </Section>
    <Section className="mt-[16px]">
      <Link href="{{heroImageLink}}">
        <Img
          alt="{{heroImageAlt}}"
          className="{{borderRadius}} object-cover"
          height={{imageHeight}}
          src="{{heroImageUrl}}"
          width="100%"
        />
      </Link>
      <Row className="mt-[16px]">
        <Column className="w-1/2 pr-[8px]">
          <Link href="{{image1Link}}">
            <Img
              alt="{{image1Alt}}"
              className="{{borderRadius}} object-cover"
              height={{imageHeight}}
              src="{{image1Url}}"
              width="100%"
            />
          </Link>
        </Column>
        <Column className="w-1/2 pl-[8px]">
          <Link href="{{image2Link}}">
            <Img
              alt="{{image2Alt}}"
              className="{{borderRadius}} object-cover"
              height={{imageHeight}}
              src="{{image2Url}}"
              width="100%"
            />
          </Link>
        </Column>
      </Row>
    </Section>
  </Section>  
</Tailwind>`
  },
];

