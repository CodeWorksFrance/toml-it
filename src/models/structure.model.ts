const MAX_PROPERTIES_LENGTH = 2;

export class Structure {
  stdout: string;
  description: string;

  checkProperties(o: object): boolean {
    if((o as any).stdout === undefined || (o as any).description === undefined) {
      throw new Error("Properties are probably mispelled.")
    }
    return true;
  }

  checkPropertiesLength(o: object): boolean {
    if(Object.keys(o).length > MAX_PROPERTIES_LENGTH) {
     throw new Error('There are some missing properties in the TOML file.');
    }
    return true;
  }

  validate(o: object) {
    this.checkProperties(o);
    this.checkPropertiesLength(o);
  }

  constructor(o: object) {
    this.validate(o);
    this.stdout = (o as any).stdout;
    this.description = (o as any).description;
  }
}