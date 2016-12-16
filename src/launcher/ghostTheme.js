import {
  amberA400, amberA700,
  grey100, grey300, grey400, grey500,
  pink500,
  darkBlack, white
} from "material-ui/styles/colors";
import {fade} from "material-ui/utils/colorManipulator";
import Spacing from "material-ui/styles/spacing";

export default {
  spacing: Spacing,
  fontFamily: "Roboto, sans-serif",
  palette: {
    primary1Color: amberA400,
    primary2Color: amberA700,
    primary3Color: grey400,
    accent1Color: pink500,
    accent2Color: grey100,
    accent3Color: grey500,
    textColor: darkBlack,
    alternateTextColor: white,
    canvasColor: white,
    borderColor: grey300,
    disabledColor: fade(darkBlack, 0.3),
    pickerHeaderColor: amberA400,
    clockCircleColor: fade(darkBlack, 0.07)
  }
};
