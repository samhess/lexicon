/** 
 * @param {string} input
*/
export function capitalize(input) {
  if (!input) {
    return ''
  } else if (input.length===1) {
    return input.toUpperCase()
  } else {
    return input.slice(0,1).toUpperCase() + input.slice(1)
  }
}

/** 
 * @param {string} csv
*/
export function parseCsv(csv) {
  const lines = csv.trim().split(/\n/) // split at line endings
  if (Array.isArray(lines) && lines.length>1) {
    const headers = lines[0]
      .trim()
      .split(',')
      .map(header => {
        return header
          .trim()
          .toLowerCase()
          .replace(/(\/)/, '')
          .replace(/^"/, '')
          .replace(/"$/, '')
          .replace(/\(.*\)/, '')
          .replace(/\s./g,c=>c.trim().toUpperCase())
          .replace(/-./g,c=>c.slice(1).toUpperCase())
          .trim()
      })
    const data = lines.slice(1)
    return data.map(row => {
      // replace commas outside quotation marks with semicolon
      let regex = new RegExp('(,)(?=(?:[^"]|"[^"]*")*$)','g')
      let fields = row.replace(regex,';;;!').split(';;;!')
      /** @type {Object<string,string>} */
      let record = {}
      for (const [index,key] of headers.entries()) {
        record[key] = fields[index].replace(/^"/, '').replace(/"$/, '').trim()
      }
      return record
    })
  }
}

/**
 * @param {string} cookieString 
 */
export function parseCookie(cookieString) {
  const cookie = {}
  const props = cookieString.split(/;\s/)
  for (const prop of props) {
    const pos = prop.indexOf('=')
    if (pos === -1) {
      // @ts-ignore
      cookie[prop] = true
    } else {
      const key = prop.slice(0,pos)
      // @ts-ignore
      cookie[key] = prop.slice(pos+1)
    }
  }
  return cookie
}