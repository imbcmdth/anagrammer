# Anagrammer.js

Just a simple anagrammer with wildcard support -- just because.

## Usage

Run with `node anagram.js`

When the repl prompt appears, type words. Use `*` for an optional wildcard and `?` for a required wildcard character.

## Examples

No wildcards:
````
> its
Here's what I found:
[ 'its', 'sit', 'tis' ]
````

Two Optional Character Wildcards:
````
> book**
Here's what I found:
[ 'book',
  'booked',
  'bookie',
  'books',
  'brook',
  'brooks' ]
````

Two Required Character Wildcard:
````
> book??
Here's what I found:
[ 'booked', 'bookie', 'brooks' ]
````

One Required and One Optional Character Wildcard:
````
> book?*
Here's what I found:
[ 'booked',
  'bookie',
  'books',
  'brook',
  'brooks' ]
````