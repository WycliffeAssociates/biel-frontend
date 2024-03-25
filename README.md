# Biel 

## Favicons:
https://evilmartians.com/chronicles/how-to-favicon-in-2021-six-files-that-fit-most-needs?ck_subscriber_id=1931241069

## Fonts: 
Self hosted in public; 
Google fonts has ttfs.  Can make woff2 with https://github.com/google/woff2

## Purge css
util script run on build to get rid of the boat loads of extra style that get fetched with wordpress. 

## pagefind
src/pagefind.js is a placeholder.  On build wants a valid url in the search component for dynamic import.  The actual file(s) that gets written into dist (and thus imported at runtime) come from the makePagefindIndex, which uses the node api in order to add translations page data into the search index. 
