import * as glob from "glob";
import * as fs from "fs";
import { TestRunner } from "./toml";

describe("Framework specifications", () => {
  describe("TOML parsing", () => {
    it("should parse test file", () => {
      jest.spyOn(fs, "readFileSync").mockReturnValueOnce(`
        stdout="test"
        args="argument_1 argument_2 argument_3"
        description="this is a correct toml test description"`);
      new TestRunner().getTestsStructures();
    });

    it("should throw an exception when properties length is not correct", () => {
      jest.spyOn(fs, "readFileSync").mockReturnValueOnce(`
        stdout="test"
        args="argument_1 argument_2 argument_3"
        description="this is my first test"
        unknowProperty=""`);
      try {
        new TestRunner().getTestsStructures();
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
        new TestRunner().getTestsStructures();
      } catch (e: any) {
        expect(e.message).toEqual("Properties are probably mispelled.");
      }
    });
  });

  describe("Run", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("should display correct result with success status", () => {
      const spy = jest.spyOn(console, "log");
      jest.spyOn(glob, "sync").mockReturnValueOnce(["test.spec.toml"]);
      jest.spyOn(fs, "readFileSync").mockReturnValueOnce(`
          stdout="not ok"
          args="argument_1 argument_2 argument_3"
          description="This is a successfull test"
        `);
      new TestRunner();
      expect(spy).toHaveBeenCalledWith(
        " ✅ test.spec.toml ▶ This is a successfull test"
      );
    });

    it("should display correct result with error status", () => {
      const spy = jest.spyOn(console, "log");
      jest.spyOn(glob, "sync").mockReturnValueOnce(["test.spec.toml"]);
      jest.spyOn(fs, "readFileSync").mockReturnValueOnce(`
          stdout="Failing test"
          args="argument_1 argument_2 argument_3"
          description="This is a failing test"
        `);
      new TestRunner();
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(
        " ❌ test.spec.toml ▶ This is a failing test"
      );
    });
  });
});
