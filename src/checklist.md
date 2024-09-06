Things to consider: 

- 404 page?
- Analytics you want?
- ENV vars not repo'd
- Env vars set in ci?
- check responsiveness of each page
- sitemap
- robots.txt file?
- SEO meta for each page? 


<!-- todo -->
check the checklist above
Get contact form sorted out with Reuben
deepL you i18n stuff to fill it out. 
breadcrumbs?
control deploy scripts via github actions
set a cron to pnpm up outdated, run tests, open pull if pass (dependabot ish?. Maybe just do dependabot now that it supports pnpm)
write some basic smoke tests that go -> build -> get url from build (pages action returns it) -> e2e that against real platform (and no need to doubly configure env, unless I want to pass a different env to it? Not sure)
https://developers.cloudflare.com/workers/testing/vitest-integration/get-started/ vitest integration testing with workers, 
<!--
Static index of resources page (For each language)
SSR Individual Lang pages so -> langCode/recursos/
  -->

  <!-- 
  es/recursos/{ieft}/
  resources/
   -->

live reader page: 
- Can get to any book/chapter via query params
- Scriptural stuff prefetches +1 chap in each direction for speed
- Either bespoke views for periphery or none at all?
- (i.e. words / manual)
  

Arch:
Prefetched content shell (i.e. TW + TN + etc;)
Rebuild those daily or whatever
onMount load TOC, last visited (localStorage) (or first) chap (not ssr since shell is static) -> 

- Check memory -> Fetch (if not in memory) /api/resourceContent?hash=HASH+url="url" -> SW (match cache first with url params) -> If not then passes through to the CF function (cache first with query param (no expiry)) -> CF function s-maxage long time cache 

TOC HASHES for knowing what's in indexxedDb on all calls: Actually, TOC url + hash dict: if hash differs, fetch, else get url:  (for cleanup); 

IDB vs Service worker cache?
I think SW -> there are real URL's and none of the granular calls to check / get / set: Just fetch and let caching layers handle.

Books have a whole.json, which, when fetched, will need to put stuff in the SW for that hash+url combo.. But do we really want to do that with the 1000k+ html chapters? Or should I just try to read + write to one larger data.  With text, it'd be fine to replace whole instance. You wouldn't want to do that with audio though, which I think we'd rather go chapter by chapter to fulfill, which means, maybe going chap by chap on html isn't that bad, and we just treat whole.json as a convenience. Does it matter how many files are in storage after all?