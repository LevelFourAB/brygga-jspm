[JSPM](http://jspm.io/) plugin for [Brygga](https://github.com/LevelFourAB/brygga). This plugin provides support for working with JavaScript using JSPM for bundling and package management. This plugin currently supports JSPM 0.17 which is considered beta.

# Using

First setup [Brygga](https://github.com/LevelFourAB/brygga) for your project.

Install the plugin and JSPM:
```
npm install --save-dev jspm@beta brygga-jspm
```

If you do not have JSPM on your system install it globally as well:
```
npm install -g jspm@beta
```

Setup JSPM via `jspm init` using the following settings:

* Init Mode (Quick, Standard, Custom) [Quick]: `Quick`
* Local package name (recommended, optional): `name-of-your-app-or-package`
* package.json directories.lib [src]: `js`
* System.config browser baseURL (optional): `/src`
* System.config local package main [app.js]: `your-main-file.js`

Brygga needs to know which bundles to build via JSPM which can be set in `gulpfile.js`. For example to build a file named `main.js` from the file `src/js/main.js`:

```js
brygga.config.js.bundles = {
	'your-main-file.js': 'name-of-your-app-or-package/your-main-file'
}
```

Link to any bundle in your HTML via `/js/name-of-bundle.js`, during development this will bootstrap JSPM and SystemJS and load all your sources individually.

# Structure
```
src/ - the source files
  js/ - JS files
    main.js - your entry point, configure this via brygga.config.js.bundles
jspm_packages - packages installed via JSPM, you can add this folder to .gitignore
jspm.browser.js - configuration used in the browser
jspm.config.js - shared JSPM configuration
```

# Available tasks

Task: `js`
Config:
```js
// JS is stored in the subfolder `js`
brygga.config.js.root = 'js';
// Bunldes to build, empty by default
brygga.config.js.bundles = {};
```
