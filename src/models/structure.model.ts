const MAX_PROPERTIES_LENGTH = 2;

export class Structure {
  stdout: string;
  description: string;
  filename: string;

  private checkProperties(o: object): boolean {
    if((o as any).stdout === undefined || (o as any).description === undefined) {
      throw new Error("Properties are probably mispelled.")
    }
    return true;
  }

  private checkPropertiesLength(o: object): boolean {
    if(Object.keys(o).length > MAX_PROPERTIES_LENGTH) {
     throw new Error('There are some missing properties in the TOML file.');
    }
    return true;
  }

  private validate(o: object) {
    this.checkProperties(o);
    this.checkPropertiesLength(o);
  }

  constructor(o: object, filename: string) {
    this.validate(o);
    this.filename = filename;
    this.stdout = (o as any).stdout;
    this.description = (o as any).description;
  }
}