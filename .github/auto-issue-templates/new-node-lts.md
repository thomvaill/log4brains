# New Node.js LTS version detected

_Issue created automatically by a Github action._

A new Node.js LTS version has been detected: `{{ steps.check-version.outputs.new_lts_version }}`.

Please test the Log4brains project against this version and update the supported versions accordingly.

- [ ] Update the LTS version in `.nvmrc`
- [ ] Run `nvm use` and ensure `node -v` returns the new LTS version
- [ ] Run `rm -rf node_modules && yarn install`
- [ ] Run all the quality checks described in CONTRIBUTNG.md
- [ ] Run and test the app manually
- [ ] Fix the potential bugs
- [ ] Update `.github/supported_nodejs_versions.json`: add the new LTS version and remove the ones that are no longer supported (see [Node.js release schedule](https://github.com/nodejs/release#release-schedule))
- [ ] Update all `engine.node` fields in `package.json` files
