# Anagrammer.js

Just a simple anagrammer with wildcard support and parts-of-speech support -- just because.

Included dictionary contains over 360,000 English words including common proper nouns.

## Usage

Run with `node anagram.js`

When the repl prompt appears, type words. 

You can optionally use `*` to indicate an optional wildcard and `?` to indicate a required wildcard character in your searches.

You can also optionally provide one or more single-character parts-of-speech codes within parentheses to return *only* words that match those parts-of-speech. See the examples before for more details.

### Wildcards

> ? - Required Character

> \* - Optional Character

### Parts Of Speech Codes

> N - Noun

> p - Plural

> h - Noun Phrase

> V - Verb (usu participle)

> t - Verb (transitive)

> i - Verb (intransitive)

> A - Adjective

> v - Adverb

> C - Conjunction

> P - Preposition

> ! - Interjection

> r - Pronoun

> D - Definite Article

> I - Indefinite Article

> o - Nominative


## Examples

### No Wildcards; No Parts-of-Speech
````
> its
Here's what I found:
{ Noun: [ 'it\'s', 'tsi' ],
  'Definite Article': [ 'its' ],
  'Verb (usu participle)': [ 'sit' ],
  'Verb (transitive)': [ 'sit' ],
  Plural: [ 'tis' ] }
````

### No Wildcards; Only Nouns
````
> booker(N)
Here's what I found:
{ Noun: [ 'Booker', 'Brooke', 'booker' ] }
````

### Two Optional Wildcard Characters; Only Verbs
````
> book**(V)
Here's what I found:
{ 'Verb (usu participle)':
   [ 'betook',
     'book',
     'book in',
     'book up',
     'brook' ] }
````

### Two Required Wildcard Characters; Only Adjectives
````
> book??(A)
Here's what I found:
{ Adjective: [ 'booked' ] }
````

### One Required and One Optional Wildcard Character; Only Nouns
````
> book?*(N)
Here's what I found:
{ Noun:
   [ 'Bocock',
     'Bontok',
     'Booker',
     'Boskop',
     'Brook',
     'Brooke',
     'Brooks',
     'Lombok',
     'Okubo',
     'bioko',
     'bokkos',
     'booker',
     'bookie',
     'brook',
     'kobold' ] }
````