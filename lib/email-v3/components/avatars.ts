import type { ComponentPattern } from './index';

export const AVATAR_COMPONENTS: ComponentPattern[] = [
  {
    id: 'avatars-stacked',
    name: 'Stacked Avatars Group',
    description: 'Overlapping circular avatars with white borders, creating a stacked effect',
    category: 'content',
    components: ['Row', 'Column', 'Img', 'Tailwind'],
    placeholders: ['avatar1Url', 'avatar1Alt', 'avatar2Url', 'avatar2Alt', 'avatar3Url', 'avatar3Alt', 'avatarSize', 'borderColor', 'borderWidth'],
    preview: 'Use for displaying multiple user avatars in an overlapping, stacked layout',
    template: `<Tailwind>
  <Row width={undefined} className="border-collapse border-spacing-0">
    <Column
      width="{{avatarSize}}"
      height="{{avatarSize}}"
      className="h-[{{avatarSize}}px] w-[{{avatarSize}}px] p-0 text-center align-middle leading-[0px]"
    >
      <div className="box-border h-full w-full overflow-hidden rounded-[100%] {{borderWidth}} border-solid {{borderColor}} bg-gray-950">
        <Img
          src="{{avatar1Url}}"
          alt="{{avatar1Alt}}"
          width="{{avatarSize - 4}}"
          height="{{avatarSize - 4}}"
          className="inline-block h-full w-full object-cover object-center"
        />
      </div>
    </Column>
    <Column
      width="{{avatarSize}}"
      height="{{avatarSize}}"
      className="relative left-[-12px] h-[{{avatarSize}}px] w-[{{avatarSize}}px] p-0 text-center align-middle leading-[0px]"
    >
      <div className="box-border h-full w-full overflow-hidden rounded-[100%] {{borderWidth}} border-solid {{borderColor}} bg-gray-950">
        <Img
          src="{{avatar2Url}}"
          alt="{{avatar2Alt}}"
          width="{{avatarSize - 4}}"
          height="{{avatarSize - 4}}"
          className="inline-block h-full w-full object-cover object-center"
        />
      </div>
    </Column>
    <Column
      width="{{avatarSize}}"
      height="{{avatarSize}}"
      className="relative left-[-24px] h-[{{avatarSize}}px] w-[{{avatarSize}}px] p-0 text-center align-middle leading-[0px]"
    >
      <div className="box-border h-full w-full overflow-hidden rounded-[100%] {{borderWidth}} border-solid {{borderColor}} bg-gray-950">
        <Img
          src="{{avatar3Url}}"
          alt="{{avatar3Alt}}"
          width="{{avatarSize - 4}}"
          height="{{avatarSize - 4}}"
          className="inline-block h-full w-full object-cover object-center"
        />
      </div>
    </Column>
  </Row>  
</Tailwind>`
  },
  {
    id: 'avatars-with-text',
    name: 'Avatar with Text',
    description: 'Avatar image with name and title/role displayed next to it',
    category: 'content',
    components: ['Row', 'Column', 'Link', 'Img', 'Tailwind'],
    placeholders: ['avatarUrl', 'avatarAlt', 'avatarSize', 'profileUrl', 'name', 'title', 'nameColor', 'titleColor'],
    preview: 'Use for displaying user profiles with avatar, name, and title',
    template: `<Tailwind>
  <Row>
    <Column align="center">
      <Link href="{{profileUrl}}">
        <Row className="w-auto table-fixed border-collapse border-spacing-0">
          <Column className="h-[{{avatarSize}}px] w-[{{avatarSize}}px] overflow-hidden rounded-full p-0 text-center align-middle leading-[0px]">
            <Img
              src="{{avatarUrl}}"
              width="{{avatarSize - 8}}"
              height="{{avatarSize - 8}}"
              alt="{{avatarAlt}}"
              className="h-full w-full object-cover object-center"
            />
          </Column>
          <Column className="pl-3 text-[14px] leading-[20px] font-medium {{titleColor}}">
            <p className="m-0 {{nameColor}}">{{name}}</p>
            <p className="m-0 text-[12px] leading-[14px]">{{title}}</p>
          </Column>
        </Row>
      </Link>
    </Column>
  </Row>  
</Tailwind>`
  },
  {
    id: 'avatars-circular',
    name: 'Circular Avatars',
    description: 'Multiple circular avatars displayed in a row at different sizes',
    category: 'content',
    components: ['Row', 'Column', 'Img', 'Tailwind'],
    placeholders: ['avatar1Url', 'avatar1Alt', 'avatar1Size', 'avatar2Url', 'avatar2Alt', 'avatar2Size', 'avatar3Url', 'avatar3Alt', 'avatar3Size', 'avatar4Url', 'avatar4Alt', 'avatar4Size'],
    preview: 'Use for displaying multiple circular user avatars in a row',
    template: `<Tailwind>
  <Row>
    <Column align="center">
      <Img
        src="{{avatar1Url}}"
        alt="{{avatar1Alt}}"
        width="{{avatar1Size}}"
        height="{{avatar1Size}}"
        className="inline-block w-[{{avatar1Size}}px] h-[{{avatar1Size}}px] rounded-full"
      />
    </Column>
    <Column align="center">
      <Img
        src="{{avatar2Url}}"
        alt="{{avatar2Alt}}"
        width="{{avatar2Size}}"
        height="{{avatar2Size}}"
        className="inline-block w-[{{avatar2Size}}px] h-[{{avatar2Size}}px] rounded-full"
      />
    </Column>
    <Column align="center">
      <Img
        src="{{avatar3Url}}"
        alt="{{avatar3Alt}}"
        width="{{avatar3Size}}"
        height="{{avatar3Size}}"
        className="inline-block w-[{{avatar3Size}}px] h-[{{avatar3Size}}px] rounded-full"
      />
    </Column>
    <Column align="center">
      <Img
        src="{{avatar4Url}}"
        alt="{{avatar4Alt}}"
        width="{{avatar4Size}}"
        height="{{avatar4Size}}"
        className="inline-block w-[{{avatar4Size}}px] h-[{{avatar4Size}}px] rounded-full"
      />
    </Column>
  </Row>  
</Tailwind>`
  },
  {
    id: 'avatars-rounded',
    name: 'Rounded Avatars',
    description: 'Multiple rounded (square with rounded corners) avatars displayed in a row at different sizes',
    category: 'content',
    components: ['Row', 'Column', 'Img', 'Tailwind'],
    placeholders: ['avatar1Url', 'avatar1Alt', 'avatar1Size', 'avatar2Url', 'avatar2Alt', 'avatar2Size', 'avatar3Url', 'avatar3Alt', 'avatar3Size', 'avatar4Url', 'avatar4Alt', 'avatar4Size'],
    preview: 'Use for displaying multiple rounded (not fully circular) user avatars in a row',
    template: `<Tailwind>
  <Row>
    <Column align="center">
      <Img
        src="{{avatar1Url}}"
        alt="{{avatar1Alt}}"
        width="{{avatar1Size}}"
        height="{{avatar1Size}}"
        className="inline-block w-[{{avatar1Size}}px] h-[{{avatar1Size}}px] rounded-md"
      />
    </Column>
    <Column align="center">
      <Img
        src="{{avatar2Url}}"
        alt="{{avatar2Alt}}"
        width="{{avatar2Size}}"
        height="{{avatar2Size}}"
        className="inline-block w-[{{avatar2Size}}px] h-[{{avatar2Size}}px] rounded-md"
      />
    </Column>
    <Column align="center">
      <Img
        src="{{avatar3Url}}"
        alt="{{avatar3Alt}}"
        width="{{avatar3Size}}"
        height="{{avatar3Size}}"
        className="inline-block w-[{{avatar3Size}}px] h-[{{avatar3Size}}px] rounded-md"
      />
    </Column>
    <Column align="center">
      <Img
        src="{{avatar4Url}}"
        alt="{{avatar4Alt}}"
        width="{{avatar4Size}}"
        height="{{avatar4Size}}"
        className="inline-block w-[{{avatar4Size}}px] h-[{{avatar4Size}}px] rounded-md"
      />
    </Column>
  </Row>  
</Tailwind>`
  },
];


