# GitHub Pages deployment

The workflow is prepared to publish its Vite build to `https://parshantty.github.io/Teacher_Training/`; GitHub authentication and a successful workflow run are required. Vite uses relative asset paths (`./`) so the same build works at the repository subpath and a domain root. Application routes use URL hashes so refreshing a view does not require server rewrite rules.

The public Sites demo uses `https://adding-dimension-teacher-training.schoolnetind-2732.chatgpt.site`. The `.openai/hosting.json` manifest selects the existing Site and serves `dist`. Use the Sites skill and its source helper for future publication; preserve the project ID. No credentials are tracked in this repository. The Windows build helper required a temporary ignored npm shim because the host's default cmd shim resolved the wrong CLI directory; direct `npm.cmd run build` also works.

## Repository prerequisites

1. Keep the source and `package-lock.json` on `main` in `Parshantty/Teacher_Training`.
2. Enable GitHub Actions for the repository.
3. Under **Settings → Pages → Build and deployment**, select **GitHub Actions** as the source.
4. Allow the `github-pages` environment to deploy from `main`. Retain any existing environment protections.

The workflow requires no external deployment secrets. GitHub supplies the short-lived deployment token. Build jobs receive read access to repository contents; the deployment job receives only Pages write and OIDC token permissions.

## Validation and publish

The [workflow](../.github/workflows/pages.yml) validates pull requests without publishing. A push to `main` or a manual workflow run from `main` performs these checks on Node.js 22:

```sh
npm ci --cache .npm-cache
npm run typecheck
npm test
npm run build
```

Only a successful build produces the Pages artifact. The deployment job publishes that same artifact from `dist`. Review **Actions → Validate and publish Teacher Training** and the deployment's `github-pages` environment URL to confirm release success.

After deployment, open the public URL, confirm CSS and JavaScript load, log in with the demonstration flow, visit both dashboard views, reload a hash link, and log out. A valid workflow file and local build alone do not establish a successful remote deployment.

For a local production preview:

```sh
npm run build
npm run preview
```

Open the root address printed by the preview server.

## Rollback and recovery

Identify the last working commit in the deployment history. Revert the faulty commit through the normal Git review process and push the revert to `main`; the workflow rebuilds and redeploys the restored source. If several commits changed, create a reviewed restoration commit from the known working version. Do not force push or delete history to recover a release.

If installation fails, check Node.js compatibility and lockfile alignment. If deployment fails, check Pages source, repository Actions permissions, the `github-pages` environment rules, and the workflow logs. If assets return 404, verify the Vite base path and that the published artifact contains `index.html` and `assets/`.

The workflow follows [GitHub's custom Pages workflow guidance](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).
