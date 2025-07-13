export type GenericObject = {
  [key: string]: any
}

export type lookupFields = {
  [key: string]: Array<{value: any; name: string}>
}

export type FormFields = {
  name: string
  kind: string
  relation: string | undefined
  relationFromFields: Array<any> | undefined
  options: Array<any>
}
