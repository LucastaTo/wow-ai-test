import styled, {
  space,
  color as colorStyles,
  typography,
  layout,
  SpaceProps,
  ColorProps,
  TypographyProps,
  LayoutProps,
  css,
} from '@todo/shared/styled';

interface IProps extends SpaceProps, ColorProps, TypographyProps, LayoutProps {
  $tt?: string;
}

const props = [
  'p',
  'px',
  'py',
  'pt',
  'pb',
  'pl',
  'pr',
  'm',
  'mx',
  'my',
  'mt',
  'mb',
  'ml',
  'mr',
  'color',
  'fontFamily',
  'fontSize',
  'fontWeight',
  'lineHeight',
  'letterSpacing',
  'textAlign',
  'display',
];

export const StyledText = styled('p').withConfig({
})<IProps>`
  ${({ $tt }) =>
    $tt &&
    css`
      text-transform: ${$tt};
    `}
  ${space};
  ${colorStyles};
  ${typography};
  ${layout};
`;
