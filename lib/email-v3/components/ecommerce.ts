import type { ComponentPattern } from './index';

export const ECOMMERCE_COMPONENTS: ComponentPattern[] = [
  {
    id: 'ecommerce-one-product',
    name: 'One Product',
    description: 'Single product card with image on top, category, title, description, price, and buy button',
    category: 'content',
    components: ['Section', 'Img', 'Text', 'Heading', 'Button', 'Tailwind'],
    placeholders: ['imageUrl', 'imageAlt', 'imageHeight', 'borderRadius', 'categoryText', 'categoryColor', 'categorySize', 'titleText', 'titleSize', 'titleColor', 'descriptionText', 'descriptionColor', 'price', 'priceSize', 'priceColor', 'buttonText', 'buttonUrl', 'buttonBg', 'buttonTextColor', 'buttonBorderRadius', 'buttonPadding', 'spacing'],
    preview: 'Use for single product showcases with image, details, and purchase button',
    template: `<Tailwind>
  <Section className="my-[16px]">
    <Img
      alt="{{imageAlt}}"
      className="w-full {{borderRadius}} object-cover"
      height={{imageHeight}}
      src="{{imageUrl}}"
    />
    <Section className="mt-[32px] text-center">
      <Text className="mt-[16px] font-semibold {{categorySize}} {{categoryColor}} leading-[28px]">
        {{categoryText}}
      </Text>
      <Heading
        as="h1"
        className="font-semibold {{titleSize}} {{titleColor}} leading-[40px] tracking-[0.4px]"
      >
        {{titleText}}
      </Heading>
      <Text className="mt-[8px] text-[16px] {{descriptionColor}} leading-[24px]">
        {{descriptionText}}
      </Text>
      <Text className="font-semibold text-[16px] {{priceColor}} leading-[24px]">
        {{price}}
      </Text>
      <Button
        className="mt-[16px] {{buttonBorderRadius}} {{buttonBg}} {{buttonPadding}} font-semibold {{buttonTextColor}}"
        href="{{buttonUrl}}"
      >
        {{buttonText}}
      </Button>
    </Section>
  </Section>  
</Tailwind>`
  },
  {
    id: 'ecommerce-product-image-left',
    name: 'One Product with Image on Left',
    description: 'Product card with image on left and product details (title, description, price, button) on right',
    category: 'content',
    components: ['Section', 'Img', 'Text', 'Button', 'Tailwind'],
    placeholders: ['imageUrl', 'imageAlt', 'imageHeight', 'borderRadius', 'titleText', 'titleSize', 'titleColor', 'descriptionText', 'descriptionColor', 'price', 'priceSize', 'priceColor', 'buttonText', 'buttonUrl', 'buttonBg', 'buttonTextColor', 'buttonBorderRadius', 'buttonPadding', 'buttonWidth'],
    preview: 'Use for product displays with image on left and details on right',
    template: `<Tailwind>
  <Section className="my-[16px]">
    <table className="w-full">
      <tbody className="w-full">
        <tr className="w-full">
          <td className="box-border w-1/2 pr-[32px]">
            <Img
              alt="{{imageAlt}}"
              className="w-full {{borderRadius}} object-cover"
              height={{imageHeight}}
              src="{{imageUrl}}"
            />
          </td>
          <td className="w-1/2 align-baseline">
            <Text className="m-0 mt-[8px] font-semibold {{titleSize}} {{titleColor}} leading-[28px]">
              {{titleText}}
            </Text>
            <Text className="mt-[8px] text-[16px] {{descriptionColor}} leading-[24px]">
              {{descriptionText}}
            </Text>
            <Text className="mt-[8px] font-semibold {{priceSize}} {{priceColor}} leading-[28px]">
              {{price}}
            </Text>
            <Button
              className="{{buttonWidth}} {{buttonBorderRadius}} {{buttonBg}} {{buttonPadding}} text-center font-semibold {{buttonTextColor}}"
              href="{{buttonUrl}}"
            >
              {{buttonText}}
            </Button>
          </td>
        </tr>
      </tbody>
    </table>
  </Section>  
</Tailwind>`
  },
  {
    id: 'ecommerce-three-products',
    name: 'Title + Three Cards in a Row',
    description: 'Product section with heading and three product cards side by side',
    category: 'content',
    components: ['Section', 'Row', 'Text', 'Img', 'Button', 'Tailwind', 'ResponsiveRow', 'ResponsiveColumn'],
    placeholders: ['headingText', 'headingSize', 'headingColor', 'descriptionText', 'descriptionColor', 'product1ImageUrl', 'product1ImageAlt', 'product1Title', 'product1Description', 'product1Price', 'product1ButtonUrl', 'product2ImageUrl', 'product2ImageAlt', 'product2Title', 'product2Description', 'product2Price', 'product2ButtonUrl', 'product3ImageUrl', 'product3ImageAlt', 'product3Title', 'product3Description', 'product3Price', 'product3ButtonUrl', 'imageHeight', 'borderRadius', 'titleSize', 'titleColor', 'descriptionSize', 'descriptionColor', 'priceSize', 'priceColor', 'buttonText', 'buttonBg', 'buttonTextColor', 'buttonBorderRadius', 'buttonPadding', 'spacing'],
    preview: 'Use for product collections with 3 products displayed horizontally',
    template: `<Tailwind>
  <Section className="my-[16px]">
    <Row>
      <Text className="m-0 font-semibold {{headingSize}} {{headingColor}} leading-[28px]">
        {{headingText}}
      </Text>
      <Text className="mt-[8px] text-[16px] {{descriptionColor}} leading-[24px]">
        {{descriptionText}}
      </Text>
    </Row>
    <ResponsiveRow className="mt-[16px]">
      <ResponsiveColumn className="py-[16px] pr-[4px] text-left">
        <Img
          alt="{{product1ImageAlt}}"
          className="w-full {{borderRadius}} object-cover"
          height={{imageHeight}}
          src="{{product1ImageUrl}}"
        />
        <Text className="m-0 mt-[24px] font-semibold {{titleSize}} {{titleColor}} leading-[28px]">
          {{product1Title}}
        </Text>
        <Text className="m-0 mt-[16px] text-[16px] {{descriptionColor}} leading-[24px]">
          {{product1Description}}
        </Text>
        <Text className="m-0 mt-[8px] font-semibold {{priceSize}} {{priceColor}} leading-[24px]">
          {{product1Price}}
        </Text>
        <Button
          className="mt-[16px] {{buttonBorderRadius}} {{buttonBg}} {{buttonPadding}} font-semibold {{buttonTextColor}}"
          href="{{product1ButtonUrl}}"
        >
          {{buttonText}}
        </Button>
      </ResponsiveColumn>
      <ResponsiveColumn className="px-[4px] py-[16px] text-left">
        <Img
          alt="{{product2ImageAlt}}"
          className="w-full {{borderRadius}} object-cover"
          height={{imageHeight}}
          src="{{product2ImageUrl}}"
        />
        <Text className="m-0 mt-[24px] font-semibold {{titleSize}} {{titleColor}} leading-[28px]">
          {{product2Title}}
        </Text>
        <Text className="m-0 mt-[16px] text-[16px] {{descriptionColor}} leading-[24px]">
          {{product2Description}}
        </Text>
        <Text className="m-0 mt-[8px] font-semibold {{priceSize}} {{priceColor}} leading-[24px]">
          {{product2Price}}
        </Text>
        <Button
          className="mt-[16px] {{buttonBorderRadius}} {{buttonBg}} {{buttonPadding}} font-semibold {{buttonTextColor}}"
          href="{{product2ButtonUrl}}"
        >
          {{buttonText}}
        </Button>
      </ResponsiveColumn>
      <ResponsiveColumn className="py-[16px] pl-[4px] text-left">
        <Img
          alt="{{product3ImageAlt}}"
          className="w-full {{borderRadius}} object-cover"
          height={{imageHeight}}
          src="{{product3ImageUrl}}"
        />
        <Text className="m-0 mt-[24px] font-semibold {{titleSize}} {{titleColor}} leading-[28px]">
          {{product3Title}}
        </Text>
        <Text className="m-0 mt-[16px] text-[16px] {{descriptionColor}} leading-[24px]">
          {{product3Description}}
        </Text>
        <Text className="m-0 mt-[8px] font-semibold {{priceSize}} {{priceColor}} leading-[24px]">
          {{product3Price}}
        </Text>
        <Button
          className="mt-[16px] {{buttonBorderRadius}} {{buttonBg}} {{buttonPadding}} font-semibold {{buttonTextColor}}"
          href="{{product3ButtonUrl}}"
        >
          {{buttonText}}
        </Button>
      </ResponsiveColumn>
    </ResponsiveRow>
  </Section>  
</Tailwind>`
  },
  {
    id: 'ecommerce-four-products',
    name: 'Title + Four Cards',
    description: 'Product section with heading and four product cards in a 2x2 grid layout',
    category: 'content',
    components: ['Section', 'Row', 'Text', 'Column', 'Img', 'Button', 'Hr', 'Tailwind'],
    placeholders: ['headingText', 'headingSize', 'headingColor', 'descriptionText', 'descriptionColor', 'product1ImageUrl', 'product1ImageAlt', 'product1Title', 'product1Description', 'product1Price', 'product1ButtonUrl', 'product2ImageUrl', 'product2ImageAlt', 'product2Title', 'product2Description', 'product2Price', 'product2ButtonUrl', 'product3ImageUrl', 'product3ImageAlt', 'product3Title', 'product3Description', 'product3Price', 'product3ButtonUrl', 'product4ImageUrl', 'product4ImageAlt', 'product4Title', 'product4Description', 'product4Price', 'product4ButtonUrl', 'imageHeight', 'borderRadius', 'titleSize', 'titleColor', 'descriptionSize', 'descriptionColor', 'priceSize', 'priceColor', 'buttonText', 'buttonBg', 'buttonTextColor', 'buttonBorderRadius', 'buttonPadding', 'dividerColor', 'spacing'],
    preview: 'Use for product collections with 4 products in a 2x2 grid layout',
    template: `<Tailwind>
  <Section className="my-[16px]">
    <Section>
      <Row>
        <Text className="m-0 font-semibold {{headingSize}} {{headingColor}} leading-[28px]">
          {{headingText}}
        </Text>
        <Text className="mt-[8px] text-[16px] {{descriptionColor}} leading-[24px]">
          {{descriptionText}}
        </Text>
      </Row>
      <Row className="mt-[16px]">
        <Column align="left" className="w-1/2 pr-[8px]" colSpan={1}>
          <Img
            alt="{{product1ImageAlt}}"
            className="w-full {{borderRadius}} object-cover"
            height={{imageHeight}}
            src="{{product1ImageUrl}}"
          />
          <Text className="m-0 mt-[24px] font-semibold {{titleSize}} {{titleColor}} leading-[28px]">
            {{product1Title}}
          </Text>
          <Text className="m-0 mt-[16px] text-[16px] {{descriptionColor}} leading-[24px]">
            {{product1Description}}
          </Text>
          <Text className="m-0 mt-[8px] font-semibold {{priceSize}} {{priceColor}} leading-[24px]">
            {{product1Price}}
          </Text>
          <Button
            className="mt-[16px] {{buttonBorderRadius}} {{buttonBg}} {{buttonPadding}} font-semibold {{buttonTextColor}}"
            href="{{product1ButtonUrl}}"
          >
            {{buttonText}}
          </Button>
        </Column>
        <Column align="left" className="w-1/2 pl-[8px]" colSpan={1}>
          <Img
            alt="{{product2ImageAlt}}"
            className="w-full {{borderRadius}} object-cover"
            height={{imageHeight}}
            src="{{product2ImageUrl}}"
          />
          <Text className="m-0 mt-[24px] font-semibold {{titleSize}} {{titleColor}} leading-[28px]">
            {{product2Title}}
          </Text>
          <Text className="m-0 mt-[16px] text-[16px] {{descriptionColor}} leading-[24px]">
            {{product2Description}}
          </Text>
          <Text className="m-0 mt-[8px] font-semibold {{priceSize}} {{priceColor}} leading-[24px]">
            {{product2Price}}
          </Text>
          <Button
            className="mt-[16px] {{buttonBorderRadius}} {{buttonBg}} {{buttonPadding}} font-semibold {{buttonTextColor}}"
            href="{{product2ButtonUrl}}"
          >
            {{buttonText}}
          </Button>
        </Column>
      </Row>
    </Section>
    <Hr className="mx-0 my-[24px] w-full border {{dividerColor}} border-solid" />
    <Section>
      <Row>
        <Column align="left" className="w-1/2 pr-[8px]" colSpan={1}>
          <Img
            alt="{{product3ImageAlt}}"
            className="w-full {{borderRadius}} object-cover"
            height={{imageHeight}}
            src="{{product3ImageUrl}}"
          />
          <Text className="m-0 mt-[24px] font-semibold {{titleSize}} {{titleColor}} leading-[28px]">
            {{product3Title}}
          </Text>
          <Text className="m-0 mt-[16px] text-[16px] {{descriptionColor}} leading-[24px]">
            {{product3Description}}
          </Text>
          <Text className="m-0 mt-[8px] font-semibold {{priceSize}} {{priceColor}} leading-[24px]">
            {{product3Price}}
          </Text>
          <Button
            className="mt-[16px] {{buttonBorderRadius}} {{buttonBg}} {{buttonPadding}} font-semibold {{buttonTextColor}}"
            href="{{product3ButtonUrl}}"
          >
            {{buttonText}}
          </Button>
        </Column>
        <Column align="left" className="w-1/2 pl-[8px]" colSpan={1}>
          <Img
            alt="{{product4ImageAlt}}"
            className="w-full {{borderRadius}} object-cover"
            height={{imageHeight}}
            src="{{product4ImageUrl}}"
          />
          <Text className="m-0 mt-[24px] font-semibold {{titleSize}} {{titleColor}} leading-[28px]">
            {{product4Title}}
          </Text>
          <Text className="m-0 mt-[16px] text-[16px] {{descriptionColor}} leading-[24px]">
            {{product4Description}}
          </Text>
          <Text className="m-0 mt-[8px] font-semibold {{priceSize}} {{priceColor}} leading-[24px]">
            {{product4Price}}
          </Text>
          <Button
            className="mt-[16px] {{buttonBorderRadius}} {{buttonBg}} {{buttonPadding}} font-semibold {{buttonTextColor}}"
            href="{{product4ButtonUrl}}"
          >
            {{buttonText}}
          </Button>
        </Column>
      </Row>
    </Section>
  </Section>  
</Tailwind>`
  },
  {
    id: 'ecommerce-checkout',
    name: 'Checkout Cart',
    description: 'Shopping cart/checkout table with product images, names, quantities, prices, and checkout button',
    category: 'content',
    components: ['Section', 'Heading', 'Text', 'Img', 'Row', 'Column', 'Button', 'Tailwind'],
    placeholders: ['headingText', 'headingSize', 'headingColor', 'product1ImageUrl', 'product1ImageAlt', 'product1Name', 'product1Quantity', 'product1Price', 'product2ImageUrl', 'product2ImageAlt', 'product2Name', 'product2Quantity', 'product2Price', 'imageHeight', 'borderRadius', 'buttonText', 'buttonUrl', 'buttonBg', 'buttonTextColor', 'buttonBorderRadius', 'buttonPadding', 'tableBorderColor', 'containerBorder', 'containerBorderRadius', 'containerPadding'],
    preview: 'Use for abandoned cart emails or checkout reminders with product table',
    template: `<Tailwind>
  <Section className="py-[16px] text-center">
    <Heading as="h1" className="mb-0 font-semibold {{headingSize}} leading-[36px]">
      {{headingText}}
    </Heading>
    <Section className="my-[16px] {{containerBorderRadius}} {{containerBorder}} {{containerPadding}} pt-0">
      <table className="mb-[16px]" width="100%">
        <tr>
          <th className="border-0 {{tableBorderColor}} border-b border-solid py-[8px]">
            &nbsp;
          </th>
          <th
            align="left"
            className="border-0 {{tableBorderColor}} border-b border-solid py-[8px] text-gray-500"
            colSpan={6}
          >
            <Text className="font-semibold">Product</Text>
          </th>
          <th
            align="center"
            className="border-0 {{tableBorderColor}} border-b border-solid py-[8px] text-gray-500"
          >
            <Text className="font-semibold">Quantity</Text>
          </th>
          <th
            align="center"
            className="border-0 {{tableBorderColor}} border-b border-solid py-[8px] text-gray-500"
          >
            <Text className="font-semibold">Price</Text>
          </th>
        </tr>
        <tr>
          <td className="border-0 {{tableBorderColor}} border-b border-solid py-[8px]">
            <Img
              alt="{{product1ImageAlt}}"
              className="{{borderRadius}} object-cover"
              height={{imageHeight}}
              src="{{product1ImageUrl}}"
            />
          </td>
          <td
            align="left"
            className="border-0 {{tableBorderColor}} border-b border-solid py-[8px]"
            colSpan={6}
          >
            <Text>{{product1Name}}</Text>
          </td>
          <td
            align="center"
            className="border-0 {{tableBorderColor}} border-b border-solid py-[8px]"
          >
            <Text>{{product1Quantity}}</Text>
          </td>
          <td
            align="center"
            className="border-0 {{tableBorderColor}} border-b border-solid py-[8px]"
          >
            <Text>{{product1Price}}</Text>
          </td>
        </tr>
        <tr>
          <td className="border-0 {{tableBorderColor}} border-b border-solid py-[8px]">
            <Img
              alt="{{product2ImageAlt}}"
              className="{{borderRadius}} object-cover"
              height={{imageHeight}}
              src="{{product2ImageUrl}}"
            />
          </td>
          <td
            align="left"
            className="border-0 {{tableBorderColor}} border-b border-solid py-[8px]"
            colSpan={6}
          >
            <Text>{{product2Name}}</Text>
          </td>
          <td
            align="center"
            className="border-0 {{tableBorderColor}} border-b border-solid py-[8px]"
          >
            <Text>{{product2Quantity}}</Text>
          </td>
          <td
            align="center"
            className="border-0 {{tableBorderColor}} border-b border-solid py-[8px]"
          >
            <Text>{{product2Price}}</Text>
          </td>
        </tr>
      </table>
      <Row>
        <Column align="center">
          <Button
            className="box-border w-full {{buttonBorderRadius}} {{buttonBg}} {{buttonPadding}} text-center font-semibold {{buttonTextColor}}"
            href="{{buttonUrl}}"
          >
            {{buttonText}}
          </Button>
        </Column>
      </Row>
    </Section>
  </Section>  
</Tailwind>`
  },
];


