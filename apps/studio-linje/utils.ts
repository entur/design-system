import * as icons from '@entur/icons'

export function isEnturIcon(iconName: string): iconName is keyof typeof icons {
  return iconName in icons
}
