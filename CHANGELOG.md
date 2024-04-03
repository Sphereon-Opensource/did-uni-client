# Release Notes

## v0.6.2 - 2024-04-03

- Changed:
  - Made environment vars using process.env optional, to allow the lib to be used directly in a browser
  - Moved to pnpm instead of yarn, like most of our repos
- Updated:
  - Updated dependencies

## v0.6.1 - 2024-01-14

- Updated:
  - Updated dependencies

## v0.6.0 - 2023-03-08
Update DID did-resolver, make resolve met async

- Changed:
  * Make resolve method async
- Updated:
  * Update DID did-resolver from 4.0.1 to 4.1.0.

## v0.5.0 - 2022-10-26
Update DID did-resolver from 3.x to 4.0.1.

- Updated:
    * Update DID did-resolver from 3.x to 4.0.1.


## v0.4.0 - 2022-01-05
Update interface of getUniResolver(s) methods, since upstream made interface changes

- Changed:
    * Changed interface of getUniResolver(s) methods

## v0.3.3 - 2021-10-16
Exported getUniResolver(s) methods and enabled strict mode

- Fixed:
    * Export getUniResolver(s) methods, thx @brianorwhatever
    * Enable strict mode

## v0.3.1 + 0.3.2 - 2021-10-09
Fix npm packaging

## v0.3.0 - 2021-10-09
WARNING: API changed. Many methods and classnames have changed!

Improved API, results have types. All main methods return a promise and are configured using a configuration object

- Added:
    * Introduction of a configuration object
    * Allow registration of multiple DID methods when used as DIF resolver

- Changed:
    * All registration/resolution methods are typed and return a promise
    * No more getURL methods in the resolver/registrar. Use getConfig() to access the values
    * Prefix the Resolver and Registrar classes with Uni, to not have to alias them on imports with DIF resolver present


## v0.2.0 - 2021-09-13
Improved error handling + DIF resolver support, which means you can now use this the resolver as a DIF did-client supported resolver.

- Added:
  * DIF did-resolver support.

- Fixed:
  * Improved error handling

## v0.1.1 - 2021-08-12
React Native compatibility

- Fixed:
  * Ensure we are React Native compatible

## v0.1.0 - 2021-08-12
Initial release

- Alpha release:
    * Universal resolver support
    * Universal registrar support
