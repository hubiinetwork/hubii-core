import { UPDATE_THEME } from "./constants";

export function updateTheme(appTheme) {
  return { type: UPDATE_THEME, appTheme };
}
