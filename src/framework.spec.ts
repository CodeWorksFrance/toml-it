import { parseString } from "./toml/parsing";
import * as fs from "fs";

describe("Framework specifications", () => {
  describe("TOML parsing", () => {
    it("should parse test file", () => {
      jest.spyOn(fs, "readFileSync").mockReturnValueOnce(`
        stdout="test"
        description="this is a correct toml test description"`);
      parseString();
    });

    it("should throw an exception when properties length is not correct", () => {
      jest.spyOn(fs, "readFileSync").mockReturnValueOnce(
        `stdout="test"
           description="this is my first test"
           unknowProperty=""`
      );
      try {
        parseString();
      } catch (e: any) {
        expect(e.message).toEqual(
          "There are some missing properties in the TOML file."
        );
      }
    });

    it("should throw an exception when properties is not correct", () => {
      jest
        .spyOn(fs, "readFileSync")
        .mockReturnValueOnce('unknowProperty="test" \n\t');

      try {
        parseString();
      } catch (e: any) {
        expect(e.message).toEqual("Properties are probably mispelled.");
      }
    });
  });
});
