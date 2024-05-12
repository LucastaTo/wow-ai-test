import styled, { themeGet, SpaceProps, BorderProps } from "@todo/shared/styled";
import selectIcon from "../../../static/select.svg";
import {
  InputStyles,
  SuccessInputStyles,
  WarningInputStyles,
  ErrorInputStyles,
  allowedProps,
} from "../style";
import { IFeedback, TCustomStyle } from "../types";

interface IInput extends IFeedback, SpaceProps, BorderProps {
  $width?: string | any[];
  $height?: string | any[];
  $customStyle?: TCustomStyle;
}

export const StyledSelect = styled("select").withConfig({
  shouldForwardProp: (prop, defaultValidatorFn) => {
    if (defaultValidatorFn && typeof defaultValidatorFn === "function") {
      return ![...allowedProps].includes(prop) && defaultValidatorFn(prop);
    } else {
      return ![...allowedProps].includes(prop);
    }
  },
})<IInput>`
  border-color: ${themeGet("colors.text4")};
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  background: #fff url(${selectIcon}) no-repeat right 0.625rem center/8px 10px;
  ${InputStyles};
  ${({ $state, $showState, $showErrorOnly }) =>
    $state === "success" &&
    !!$showState &&
    !$showErrorOnly &&
    SuccessInputStyles};
  ${({ $state, $showState, $showErrorOnly }) =>
    $state === "warning" &&
    !!$showState &&
    !$showErrorOnly &&
    WarningInputStyles};
  ${({ $state, $showState, $showErrorOnly }) =>
    $state === "error" && !!$showState && !!$showErrorOnly && ErrorInputStyles};
`;
