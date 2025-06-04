import db from '../src/lib/server/database.ts'

const topics = [
  'Clothes and Accessories',
  'Colours',
  'Communications and Technology',
  'Education',
  'Entertainment and Media',
  'Environment',
  'Food and Drink',
  'Health, Medicine and Exercise',
  'Hobbies and Leisure',
  'House and Home',
  'Language',
  'Personal Feelings, Opinions and Experiences',
  'Places: Buildings',
  'Places: Countryside',
  'Places: Town and City',
  'Services',
  'Shopping',
  'Sport',
  'The Natural World',
  'Time',
  'Travel and Transport',
  'Weather',
  'Work and Jobs'
]

for (const topic of topics) {
  const key = topic
    .replace(/^The /, '')
    .replace(/\sand\s/, '-')
    .replace(/[,:]\s/, '-')
    .replace(/\s/, '-')
    .toLowerCase()
    .replace(/personal-feelings-opinions-experiences/, 'emotions')
    .replace(/health-medicine-exercise/, 'health')
  await db.topic.upsert({
    where: {key},
    create: {key, name: topic},
    update: {name: topic}
  })
}
