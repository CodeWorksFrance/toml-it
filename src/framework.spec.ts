import * as glob from "glob";
import * as fs from "fs";
import { TestRunner } from "./toml";
import { Status } from "./models/result.model";

describe("Framework specifications", () => {
  describe("TOML parsing", () => {
    it("should parse test file", () => {
      jest.spyOn(fs, "readFileSync").mockReturnValueOnce(`
        stdout="test"
        description="this is a correct toml test description"`);
      new TestRunner().getTestsStructures();
    });

    it("should throw an exception when properties length is not correct", () => {
      jest.spyOn(fs, "readFileSync").mockReturnValueOnce(
        `stdout="test"
           description="this is my first test"
           unknowProperty=""`
      );
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
          stdout="Successfull test"
          description="This is a successfull test"
        `);
      new TestRunner().run();
      expect(spy).toHaveBeenCalledWith(
        " ✅ test.spec.toml ▶ This is a successfull test"
      );
    });

    it("should display correct result with error status", () => {
      const spy = jest.spyOn(console, "log");
      jest.spyOn(glob, "sync").mockReturnValueOnce(["test.spec.toml"]);
      jest.spyOn(fs, "readFileSync").mockReturnValueOnce(`
          stdout="Failing test"
          description="This is a failing test"
        `);
      const runner = new TestRunner();
      runner.checkTestStatus = jest.fn().mockReturnValue(Status.FAILURE);
      runner.run();
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(
        " ❌ test.spec.toml ▶ This is a failing test"
      );
    });
  });
});
