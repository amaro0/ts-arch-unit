# ts-arch-unit

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

---

API is not stable and might be changed in future releases.
