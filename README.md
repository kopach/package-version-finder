<div align="center"><h1>𝒫𝒶𝒸𝓀𝒶ℊℯ 𝓋ℯ𝓇𝓈𝒾ℴ𝓃 𝒻𝒾𝓃𝒹ℯ𝓇</h1></div>

[package-version-finder ](https://github.com/kopach/package-version-finder)<sup>[![Version Badge][2]][1]</sup>

<div align="center">

[![Snyk Vulnerabilities badge](https://snyk.io/test/github/kopach/package-version-finder/badge.svg)](https://snyk.io/test/github/kopach/package-version-finder)
[![Maintainability](https://api.codeclimate.com/v1/badges/f7e2f85327eeb6b52439/maintainability)](https://codeclimate.com/github/kopach/package-version-finder/maintainability)
[![Language grade: JavaScript](https://img.shields.io/lgtm/grade/javascript/g/kopach/package-version-finder.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/kopach/package-version-finder/context:javascript)

[![NPM badge](https://nodei.co/npm/package-version-finder.png?compact=true)](https://www.npmjs.com/package/package-version-finder)

</div>

⭐️ Please, star me on GitHub — it helps!

[package-version-finder](https://github.com/kopach/package-version-finder) – is a CLI tool, which helps find NPM package version having it's file.

<h1 align="center">

Demo
![package-version-finder demo gif](./assets/demo.gif)

## 🧬 Table of Contents

- [🔨 Usage 🔝](#-usage-)
  - [Options](#options)
- [📄 License 🔝](#-license-)

## 🔨 Usage [🔝](#-table-of-contents)

Install globally

```bash
npm i -g package-version-finder
package-version-finder -p <package> <file>
```

Or use with npx (without install)

```bash
npx package-version-finder -p <package> <file>
```

See help for more options

```bash
npx package-version-finder --help
```

### Options

```bash
Usage: package-version-finder [options] <file>

Options:
  -V, --version                            output the version number
  -p, --package <name>                     name of npm package
  -t, --tolerance-percentage <percentage>  Skip comparison for files with less equality in size then accepted by tolerance level (default: 90)
  -h, --help                               display help for command
```

## 📄 License [🔝](#-table-of-contents)

This software licensed under the [MIT](https://github.com/kopach/package-version-finder/blob/master/LICENSE)

[1]: https://www.npmjs.com/package/package-version-finder
[2]: https://versionbadg.es/kopach/package-version-finder.svg
