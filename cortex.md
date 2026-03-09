# Inquisitor Page — cortex.md

## Deployment Type
Static site (npm build)

## Domain
ki-inquisitor.com AND ai-inquisitor.com (both serve the same content from a single shared webroot)

## Webroot
/var/www/inquisitor (shared by both domains)

## Build
```bash
npm run build
```
Produces `dist/` directory.

## Content Repo
The project has a separate content repository: `inqcontent` (GitHub: `MartinSchlott/inqcontent`).

- Content (articles, bot_meta HTML, article lists) is pre-generated and committed to the inqcontent repo
- No build step needed for content on the server — just `git pull` and rsync
- Content is deployed to `/var/www/inquisitor/content/`
- The main site rsync uses `--exclude=content` to preserve the separately deployed content directory

The deploy script handles content deployment automatically via the `contentRepo` config field.

## Environment
No environment files needed.

## nginx Requirements
Both domains need nearly identical configs, differing only in `server_name` and SSL certificate path:

- SPA routing (`try_files $uri /index.html`)
- Bot detection for social/search/AI crawlers — bots get static HTML with meta tags from `/content/bot_meta/`, browsers get the SPA
- Permalink URL rewriting: `/<lang>/perma/<id>` → bot gets `/content/bot_meta/<lang>-<id>.html`
- Landing page URL rewriting: `/<lang>/landing` → bot gets `/content/bot_meta/<lang>-landing.html`
- Markdown file serving with correct content type
- Standard SSL, security headers, gzip, error pages

## Verification
```bash
curl -s -o /dev/null -w "%{http_code}" https://ki-inquisitor.com
curl -s -o /dev/null -w "%{http_code}" https://ai-inquisitor.com
```
