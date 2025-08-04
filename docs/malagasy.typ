#let phrases = json("assets/phrases.json")
#let words = json("assets/words.json")

= Malagasy
== Intro
Malagasy belongs to the Austronesian language family.

For speakers of Indo-European languages it can be quite hard to start with Malagasy. The vocabulary is hardly similar and even the sentence structure is different, as the subject is normally placed after the verb and object (verb-object-subject order). However, in the province and at the coast, they do use the subject-verb-object order which is much more comfortable for speakers with Roman or Germanic language background.

#table(
  columns: (1fr, 1fr, 1fr),
  fill: (_, y) => if y>0 and calc.even(y) {rgb("#eee")},
  stroke: none,
  table.header([Dialect],[Sentence Structure],[Example]),
  table.hline(stroke: rgb("#444")),
  [Plateau Malagasy],[Verb-Object-Subject (VOS)],[Manasa lamba aho],
  [Sakalava Malagasy],[Subject-Verb-Object (SVO)],[Zaho manasa lamba]
)

== Phrases
#table(
  columns: 3,
  fill: (_, y) => if y>0 and calc.even(y) {rgb("#eee")},
  stroke: none,
  table.header([Malagasy],[English],[Comment]),
  table.hline(stroke: rgb("#444")),
  ..phrases.map(((term,english,comment))=>(term,english,comment)).flatten()
)

#pagebreak()
== Words
#table(
  columns: 4,
  fill: (_, y) => if y>0 and calc.even(y) {rgb("#eee")},
  stroke: none,
  table.header([Malagasy],[Word Type],[English],[Comment]),
  table.hline(stroke: rgb("#444")),
  ..words.map(((term,partOfSpeech,english,comment))=>(term,partOfSpeech,english,comment)).flatten()
)