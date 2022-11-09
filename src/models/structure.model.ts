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
      throw new Error('Properties are probably mispelled.');
    }
    return true;
  }

  private checkPropertiesLength(o: object): boolean {
    if (Object.keys(o).length > MAX_PROPERTIES_LENGTH) {
      throw new Error('There are some missing properties in the TOML file.');
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
    this.validate(o);
    this.filename = filename;
    this.stdout = o.stdout;
    this.args = o.args;
    this.description = o.description;
  }
}
