import type { ComponentPattern } from './index';

export const TESTIMONIAL_COMPONENTS: ComponentPattern[] = [
  {
    id: 'testimonial-simple-centered',
    name: 'Testimonial Simple Centered',
    description: 'Centered testimonial with quote text, avatar, name, and role/company',
    category: 'testimonial',
    components: ['Section', 'Row', 'Column', 'Img', 'Tailwind'],
    placeholders: ['quoteText', 'quoteSize', 'quoteColor', 'quoteWeight', 'avatarUrl', 'avatarAlt', 'avatarSize', 'name', 'nameSize', 'nameColor', 'nameWeight', 'role', 'roleSize', 'roleColor', 'separator', 'separatorColor', 'textColor'],
    preview: 'Use for centered testimonials with quote, avatar, name, and role',
    template: `<Tailwind>
  <Section className="text-center text-[14px] leading-[20px] {{textColor}}">
    <p className="m-0 {{quoteSize}} leading-[24px] {{quoteWeight}} {{quoteColor}}">
      {{quoteText}}
    </p>
    <Row width={undefined} align="center" className="mt-8">
      <Column
        valign="middle"
        width="{{avatarSize}}"
        height="{{avatarSize}}"
        className="h-[{{avatarSize}}px] w-[{{avatarSize}}px] rounded-full overflow-hidden bg-gray-600"
      >
        <Img
          src="{{avatarUrl}}"
          width={{avatarSize}}
          height={{avatarSize}}
          alt="{{avatarAlt}}"
          className="h-[{{avatarSize}}px] w-[{{avatarSize}}px] object-cover"
        />
      </Column>
      <Column valign="middle">
        <p className="m-0 ml-[12px] {{nameSize}} leading-[20px] {{nameWeight}} {{nameColor}} mr-[8px]">
          {{name}}
        </p>
      </Column>
      <Column valign="middle">
        <span className="text-[14px] leading-[20px] mr-[8px] {{separatorColor}}">{{separator}}</span>
      </Column>
      <Column valign="middle">
        <p className="m-0 {{roleSize}} leading-[20px]">{{role}}</p>
      </Column>
    </Row>
  </Section>  
</Tailwind>`
  },
  {
    id: 'testimonial-large-avatar',
    name: 'Testimonial with Large Avatar',
    description: 'Testimonial with large avatar image on left and quote text, name, and role on right',
    category: 'testimonial',
    components: ['Img', 'Tailwind', 'ResponsiveRow', 'ResponsiveColumn'],
    placeholders: ['avatarUrl', 'avatarAlt', 'avatarWidth', 'avatarHeight', 'quoteText', 'quoteSize', 'quoteColor', 'quoteWeight', 'name', 'nameSize', 'nameColor', 'nameWeight', 'role', 'roleSize', 'roleColor', 'borderRadius', 'spacing', 'textColor'],
    preview: 'Use for testimonials with large avatar image and quote text side by side',
    template: `<Tailwind>
  <ResponsiveRow className="mx-[12px] my-[16px] text-[14px] {{textColor}}">
    <ResponsiveColumn className="mt-0 mr-[24px] mb-[24px] ml-0 w-64 overflow-hidden {{borderRadius}}">
      <Img
        src="{{avatarUrl}}"
        width={{avatarWidth}}
        height={{avatarHeight}}
        alt="{{avatarAlt}}"
        className="h-[{{avatarHeight}}px] w-full object-cover object-center"
      />
    </ResponsiveColumn>
    <ResponsiveColumn className="pr-[24px]">
      <p className="mx-0 my-0 mb-[24px] text-left {{quoteSize}} leading-[1.625] {{quoteWeight}} {{quoteColor}}">
        {{quoteText}}
      </p>
      <p className="mx-0 mt-0 mb-[4px] text-left {{nameSize}} {{nameWeight}} {{nameColor}}">
        {{name}}
      </p>
      <p className="m-0 text-left {{roleSize}} {{roleColor}}">
        {{role}}
      </p>
    </ResponsiveColumn>
  </ResponsiveRow>  
</Tailwind>`
  },
];


