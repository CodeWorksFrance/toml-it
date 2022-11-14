# toml-it

[![npm package](https://img.shields.io/github/package-json/v/CodeWorksFrance/toml-it)](https://www.npmjs.com/package/toml-it) [![Node.js CI](https://github.com/CodeWorksFrance/toml-it/actions/workflows/nodejs-ci.yml/badge.svg)](https://github.com/CodeWorksFrance/toml-it/actions/workflows/nodejs-ci.yml) &nbsp; [![eslint](https://github.com/CodeWorksFrance/toml-it/actions/workflows/eslint.yml/badge.svg)](https://github.com/CodeWorksFrance/toml-it/actions/workflows/eslint.yml)

`toml-it` it a simple integration tests runner. It tests the output of a `node` program.

## How to write a test

Tests files must match the following pattern `**/*.spec.toml`.
The structure of a tests should be:

``` toml
stdout=""
description=""
args=""
```

## Launch tests

If you are using `jest` as test runner, you can simply create a file `toml-it.spec.ts` and enter the following code:

```ts
import { TestRunner } from "toml-it";

describe('integration tests with toml', () => {
  it('toml it', () => {
    new TestRunner().run();
  });
});
```

Then add the following command in your `package.json`:

```json
"scripts": {
    ...,
    "test:integration": "tsc; jest",
  },
```

## Example

If you want to test the following production code:

```ts
if (process.argv.length === 3) {
  console.log("ok");
} else {
  console.log("not ok");
}
```

You now could write two files:

### `notok.spec.toml`

```toml
stdout = "not ok"
args = "argument_1 argument_2 argument_3"
description="Should display 'not ok'"
```

### `ok.spec.toml`

```toml
stdout = "ok"
args = "argument_1"
description="Should display 'ok'"
```
