
# toml-it

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
import { TestRunner } from './';

describe('Runner', () => {
  it('should run tests', () => {
    new TestRunner();
  });
});
```

## Example

If you want to test the following production code:

```ts
if (process.argv.length === 3) {
  console.log("ok");
} else {
  console.log("not ok");
  console.log("hello world!");
  console.log("Goodbye Marty!");
}
```

You now could write two files:

### `notok.spec.toml`

```toml
stdout = """not ok
hello world!
Goodbye Marty!"""
args = "argument_1 argument_2 argument_3"
description="Should display 'not ok'"
```

### `ok.spec.toml`

```toml
stdout = "ok"
args = "argument_1"
description="Should display 'ok'"
```