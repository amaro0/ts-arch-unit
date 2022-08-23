# ts-arch-unit

<p align="center">
    <a href="https://img.shields.io/github/workflow/status/amaro0/ts-arch-unit/CI/master" alt="Build">
        <img src="https://img.shields.io/github/workflow/status/amaro0/ts-arch-unit/CI/master" />
    </a>
    <a href="https://github.com/amaro0/ts-arch-unit/blob/master/LICENSE" alt="License">
        <img src="https://img.shields.io/github/license/amaro0/ts-arch-unit" />
    </a>
    <a href="https://github.com/amaro0/ts-arch-unit/blob/master/LICENSE" alt="Coverage">
        <img src="https://img.shields.io/github/license/amaro0/ts-arch-unit" />
    </a>
</p>

Unit test your typescript architecture. Inspired by [ArchUnit](https://www.archunit.org/).

Explore all available methods on https://amaro0.github.io/ts-arch-unit/.

Should work with any test runner.

### Examples with mocha

```typescript
describe('example tests', () => {
  it('command handlers should not depend on concrete classes', () => {
    classes()
      .that()
      .haveMatchingName(/CommandHandler/)
      .should()
      .not()
      .depend()
      .onAnyConcreteImplementation();
  });

  it('services directory should have propely named files', () => {
    files()
      .that()
      .resideInADirectory('services')
      .should()
      .haveMatchingName(/[A-Za-z]+Service.ts/);
  });

  it('controllers should not depend on repositories', () => {
    files()
      .that()
      .resideInADirectory('controllers')
      .should()
      .not()
      .dependOnFiles()
      .that()
      .resideInADirectory('repositories');
  });
});
```

### Installation

`npm install --save-dev ts-arch-unit`

### How to use

To use ts-arch-unit you have to place `.tsarchunitrc` config file in your project. Right now the
only option is `root` describing folder of your ts source files

#### Example `.tsarchunitrc` file

```json
{
  "root": "src"
}
```

### How to write queries

There are few general rules that might help you write powerful queries without issues:

- Query has to be started by selecting proper entity. Right now you can start query by using
  `classes()` or `files()`.
- Most query methods work in two modes, **filter** or **assert** mode. Filter mode is enabled by
  default just after starting query. Assert mode is toggled **AFTER** running `.should()`. That
  means you can write
  `classes().that().haveMatchingName(/CommandHandler/).and().resideInDirectory('core')` to select
  classes that will be asserted and then by appending
  `.should().implementInterface('ICommand').and().haveMatchingMethod('handle')`.
- After running `.should()` there is no possibility for entering filter mode in the same query.
  Write new query instead.
- **ALL** methods are affected by `.not()` both in filter and assert mode. Negation is canceled
  after one method. That means you can write queries like
  `classes().that().haveMatchingName(/Repository/).should().not().resideInADirectory('core');`methods
  or
  `classes().that().not().haveMatchingName(/Repository/).should().not().resideInADirectory('repositories');`.
- Right now only methods that are not working in assert mode are for exceptions excluding( e.g.
  `excludedByMatchingName`).

That's all. The rest is your imagination and endless chaining of available methods :>

---

API is not stable and might be changed in future releases.
