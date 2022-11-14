import { error } from 'console';
const MAX_PROPERTIES_LENGTH = 3;

export class Structure {
  stdout: string;
  description: string;
  args: string;
  filename: string;

  private checkProperties(o: {
    stdout: string;
    description: string;
    args: string;
  }): boolean {
    if (
      o.stdout === undefined ||
      o.description === undefined ||
      o.args === undefined
    ) {
      error(` 🐛 ${this.filename} ▶ Properties are probably mispelled.\n`);
    }
    return true;
  }

  private checkPropertiesLength(o: object): boolean {
    if (Object.keys(o).length > MAX_PROPERTIES_LENGTH) {
      error(
        ` 🐛 ${this.filename} ▶ There are too much properties in the TOML file.\n`
      );
    }
    return true;
  }

  private validate(o: { stdout: string; description: string; args: string }) {
    this.checkProperties(o);
    this.checkPropertiesLength(o);
  }

  constructor(
    o: {
      stdout: string;
      description: string;
      args: string;
    },
    filename: string
  ) {
    this.filename = filename;
    this.validate(o);
    this.stdout = o.stdout;
    this.args = o.args;
    this.description = o.description;
  }
}
