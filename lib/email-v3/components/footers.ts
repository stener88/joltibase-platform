import type { ComponentPattern } from './index';

export const FOOTER_COMPONENTS: ComponentPattern[] = [
  {
    id: 'footer-full-company-info',
    name: 'Footer with Logo, Company Info, Social Links, and Contact',
    description: 'Centered footer with logo, company name/tagline, social media icons, and address/contact information',
    category: 'footer',
    components: ['Section', 'Img', 'Text', 'Row', 'Column', 'Link', 'Tailwind'],
    placeholders: ['logoUrl', 'logoAlt', 'logoWidth', 'logoHeight', 'companyName', 'tagline', 'social1Url', 'social1IconUrl', 'social1Alt', 'social2Url', 'social2IconUrl', 'social2Alt', 'social3Url', 'social3IconUrl', 'social3Alt', 'address', 'email', 'phone'],
    preview: 'Use for comprehensive footers with company branding, social links, and contact information',
    template: `<Tailwind>
  <Section className="text-center">
    <table className="w-full">
      <tr className="w-full">
        <td align="center">
          <Img
            alt="{{logoAlt}}"
            height="{{logoHeight}}"
            src="{{logoUrl}}"
            width="{{logoWidth}}"
          />
        </td>
      </tr>
      <tr className="w-full">
        <td align="center">
          <Text className="my-[8px] font-semibold text-[16px] text-gray-900 leading-[24px]">
            {{companyName}}
          </Text>
          <Text className="mt-[4px] mb-0 text-[16px] text-gray-500 leading-[24px]">
            {{tagline}}
          </Text>
        </td>
      </tr>
      <tr>
        <td align="center">
          <Row className="table-cell h-[44px] w-[56px] align-bottom">
            <Column className="pr-[8px]">
              <Link href="{{social1Url}}">
                <Img
                  alt="{{social1Alt}}"
                  height="36"
                  src="{{social1IconUrl}}"
                  width="36"
                />
              </Link>
            </Column>
            <Column className="pr-[8px]">
              <Link href="{{social2Url}}">
                <Img alt="{{social2Alt}}" height="36" src="{{social2IconUrl}}" width="36" />
              </Link>
            </Column>
            <Column>
              <Link href="{{social3Url}}">
                <Img
                  alt="{{social3Alt}}"
                  height="36"
                  src="{{social3IconUrl}}"
                  width="36"
                />
              </Link>
            </Column>
          </Row>
        </td>
      </tr>
      <tr>
        <td align="center">
          <Text className="my-[8px] font-semibold text-[16px] text-gray-500 leading-[24px]">
            {{address}}
          </Text>
          <Text className="mt-[4px] mb-0 font-semibold text-[16px] text-gray-500 leading-[24px]">
            {{email}} {{phone}}
          </Text>
        </td>
      </tr>
    </table>
  </Section>  
</Tailwind>`
  },
  {
    id: 'footer-two-column',
    name: 'Footer Two-Column Layout',
    description: 'Two-column footer with logo/company info on left and social icons/contact info on right',
    category: 'footer',
    components: ['Section', 'Row', 'Column', 'Img', 'Text', 'Link', 'Tailwind'],
    placeholders: ['logoUrl', 'logoAlt', 'logoHeight', 'companyName', 'tagline', 'social1Url', 'social1IconUrl', 'social1Alt', 'social2Url', 'social2IconUrl', 'social2Alt', 'social3Url', 'social3IconUrl', 'social3Alt', 'address', 'email', 'phone'],
    preview: 'Use for footers with logo/company info on left column and social/contact info on right column',
    template: `<Tailwind>
  <Section>
    <Row>
      <Column colSpan={4}>
        <Img
          alt="{{logoAlt}}"
          height="{{logoHeight}}"
          src="{{logoUrl}}"
        />
        <Text className="my-[8px] font-semibold text-[16px] text-gray-900 leading-[24px]">
          {{companyName}}
        </Text>
        <Text className="mt-[4px] mb-[0px] text-[16px] text-gray-500 leading-[24px]">
          {{tagline}}
        </Text>
      </Column>
      <Column align="left" className="table-cell align-bottom">
        <Row className="table-cell h-[44px] w-[56px] align-bottom">
          <Column className="pr-[8px]">
            <Link href="{{social1Url}}">
              <Img
                alt="{{social1Alt}}"
                height="36"
                src="{{social1IconUrl}}"
                width="36"
              />
            </Link>
          </Column>
          <Column className="pr-[8px]">
            <Link href="{{social2Url}}">
              <Img alt="{{social2Alt}}" height="36" src="{{social2IconUrl}}" width="36" />
            </Link>
          </Column>
          <Column>
            <Link href="{{social3Url}}">
              <Img
                alt="{{social3Alt}}"
                height="36"
                src="{{social3IconUrl}}"
                width="36"
              />
            </Link>
          </Column>
        </Row>
        <Row>
          <Text className="my-[8px] font-semibold text-[16px] text-gray-500 leading-[24px]">
            {{address}}
          </Text>
          <Text className="mt-[4px] mb-[0px] font-semibold text-[16px] text-gray-500 leading-[24px]">
            {{email}} {{phone}}
          </Text>
        </Row>
      </Column>
    </Row>
  </Section>  
</Tailwind>`
  },
];


