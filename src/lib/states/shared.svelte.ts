export const languageState = $state({alpha2: 'en'})

export function set(alpha2: string) {
  languageState.alpha2 = alpha2
}
