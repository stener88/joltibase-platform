import type { ComponentPattern } from './index';

export const CTA_COMPONENTS: ComponentPattern[] = [
  {
    id: 'button-single',
    name: 'Single Button',
    description: 'Full-width button with customizable styling, text, and URL',
    category: 'cta',
    components: ['Button', 'Tailwind'],
    placeholders: ['buttonText', 'buttonUrl', 'buttonBg', 'buttonTextColor', 'buttonPadding', 'buttonBorderRadius'],
    preview: 'Use for single call-to-action buttons with full width',
    template: `<Tailwind>
  <Button
    className="box-border w-full {{buttonBorderRadius}} {{buttonBg}} {{buttonPadding}} text-center font-semibold {{buttonTextColor}}"
    href="{{buttonUrl}}"
  >
    {{buttonText}}
  </Button>  
</Tailwind>`
  },
  {
    id: 'button-two-side-by-side',
    name: 'Two Buttons Side by Side',
    description: 'Two buttons displayed side by side, typically primary and secondary actions',
    category: 'cta',
    components: ['Row', 'Column', 'Button', 'Tailwind'],
    placeholders: ['button1Text', 'button1Url', 'button1Bg', 'button1TextColor', 'button1Border', 'button2Text', 'button2Url', 'button2Bg', 'button2TextColor', 'button2Border', 'buttonPadding', 'buttonBorderRadius'],
    preview: 'Use for dual action buttons like Login/Sign up or Primary/Secondary CTAs',
    template: `<Tailwind>
  <Row>
    <Column align="center">
      <Row>
        <td align="center" className="w-1/2 pr-[16px]" colSpan={1}>
          <Button
            className="box-border w-full {{buttonBorderRadius}} {{button1Bg}} {{button1Border}} {{buttonPadding}} text-center font-semibold {{button1TextColor}}"
            href="{{button1Url}}"
          >
            {{button1Text}}
          </Button>
        </td>
        <td align="center" className="w-1/2 pl-[16px]" colSpan={1}>
          <Button
            className="box-border w-full {{buttonBorderRadius}} {{button2Bg}} {{button2Border}} {{buttonPadding}} text-center font-semibold {{button2TextColor}}"
            href="{{button2Url}}"
          >
            {{button2Text}}
          </Button>
        </td>
      </Row>
    </Column>
  </Row>  
</Tailwind>`
  },
  {
    id: 'button-download-apps',
    name: 'Download App Store Buttons',
    description: 'App store download buttons (Google Play and App Store) with heading and description',
    category: 'cta',
    components: ['Row', 'Column', 'Text', 'Button', 'Img', 'Tailwind'],
    placeholders: ['headingText', 'headingColor', 'descriptionText', 'googlePlayUrl', 'googlePlayImageUrl', 'googlePlayImageAlt', 'appStoreUrl', 'appStoreImageUrl', 'appStoreImageAlt'],
    preview: 'Use for mobile app download CTAs with Google Play and App Store buttons',
    template: `<Tailwind>
  <Row>
    <Column align="center">
      <Row>
        <Text className="font-bold text-[18px] {{headingColor}} leading-[28px]">
          {{headingText}}
        </Text>
        <Text className="text-gray-900">
          {{descriptionText}}
        </Text>
      </Row>
      <Row>
        <td align="center">
          <table>
            <tr>
              <td className="pr-[16px]">
                <Button href="{{googlePlayUrl}}">
                  <Img
                    alt="{{googlePlayImageAlt}}"
                    width={182.5}
                    height={54}
                    src="{{googlePlayImageUrl}}"
                  />
                </Button>
              </td>
              <td className="pl-[16px]">
                <Button href="{{appStoreUrl}}">
                  <Img
                    alt="{{appStoreImageAlt}}"
                    width={164}
                    height={54}
                    src="{{appStoreImageUrl}}"
                  />
                </Button>
              </td>
            </tr>
          </table>
        </td>
      </Row>
    </Column>
  </Row>  
</Tailwind>`
  },
];


