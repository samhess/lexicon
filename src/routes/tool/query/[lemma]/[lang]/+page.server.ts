import {error} from '@sveltejs/kit'
import db from '$lib/database'

const entity = {
  attributes: {
    key: {name: 'Key'},
    lemma: {name: 'Lexeme'},
    meaning: {name: 'Meaning'},
    WordClass: {name: 'Word Class'},
    Language: {name: 'Language'},
    level: {name: 'Level'},
    english: {name: 'English'}
  },
  isEditable: false,
  key: 'lexeme',
  name: 'Lexeme'
}

export const load = async ({params}) => {
  const {lang, lemma} = params
  const language = await db.language.findUnique({where: {key: lang}})
  const wordClasses = await db.wordClass.findMany()
  if (language) {
    const records = await db.lexeme.findMany({
      where: {lemma, Language: {alpha2: language.alpha2}},
      include: {WordClass: true, Language: true, Topic: true, English:true},
      orderBy: {lemma: 'asc'}
    })
    return {entity, records, language, wordClasses}
  } 
  else {
    const records = await db.lexeme.findMany({
      where: {lemma},
      include: {WordClass: true, Language: true, Topic: true, English:true},
      orderBy: {lemma: 'asc'}
    })
    return {entity, records, wordClasses}
  }
}
