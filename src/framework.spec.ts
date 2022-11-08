import { getTestsStructures, run } from "./toml/run";
import * as fs from "fs";

describe("Framework specifications", () => {
  describe("TOML parsing", () => {
    it("should parse test file", () => {
      jest.spyOn(fs, "readFileSync").mockReturnValueOnce(`
        stdout="test"
        description="this is a correct toml test description"`);
      getTestsStructures();
    });

    it("should throw an exception when properties length is not correct", () => {
      jest.spyOn(fs, "readFileSync").mockReturnValueOnce(
        `stdout="test"
           description="this is my first test"
           unknowProperty=""`
      );
      try {
        getTestsStructures();
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
        getTestsStructures();
      } catch (e: any) {
        expect(e.message).toEqual("Properties are probably mispelled.");
      }
    });
  });

  describe('Run', () => {
    it('should display correct result', () => {
      const spy = jest.spyOn(console, 'log');
      run();
      expect(spy).toHaveBeenNthCalledWith(1, " ✅ tests/first.spec.toml ▶ This is my first test");
      expect(spy).toHaveBeenNthCalledWith(2, " ✅ tests/second.spec.toml ▶ This is my second test");
    });
  });
});
