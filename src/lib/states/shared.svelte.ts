export const languageState = $state({alpha2:'en'})

export function set(alpha2:string) {
  console.log(alpha2)
  languageState.alpha2 = alpha2
  console.log(languageState.alpha2)
  
}