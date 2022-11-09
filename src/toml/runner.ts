import * as fs from "fs";
import * as glob from "glob";
import * as toml from "toml";
import { execSync } from "child_process";
import { log } from "console";
import { Structure } from "../models/structure.model";
import { Result, ResultMetadatas, Status } from "../models/result.model";
import { BgGreen, BgRed, FgBlack, Reset } from "../utils/colors";

export class TestRunner {
  private getSpecFilesNames(): Array<string> {
    return glob.sync("**/*.spec.toml", {});
  }

  private readTomlFile(filename: string): string {
    const file = fs.readFileSync(filename, {
      encoding: "utf-8",
      flag: "r",
    });
    return file;
  }

  private checkMetadatas(status: Status) {
    return status === Status.SUCCESS ? "✅" : "❌";
  }

  getTestsStructures(): Array<Structure> {
    const specFilesNames = this.getSpecFilesNames();
    const structures: Array<Structure> = [];

    specFilesNames.forEach((filename) => {
      const data = toml.parse(this.readTomlFile(filename));
      structures.push(new Structure(data, filename));
    });

    return structures;
  }

  private execSync(test: Structure) {
    return execSync(`npm start -- ${test.args}`)
      .toString()
      .split("\n")
      .filter((o) => !o.startsWith(">") && o !== "")
      .join("\n");
  }

  private diff(stdout: string, output: string) {
    log(`   ${FgBlack} ${BgGreen} EXPECTED ${Reset} ${stdout}`);
    log(`   ${FgBlack} ${BgRed} RECEIVED ${Reset} ${output}\n`);
  }

  private timer(begin: Date, end: Date): string {
    return `(${end.getTime() - begin.getTime()}ms)`;
  }

  run(): boolean {
    const testsStructures = this.getTestsStructures();

    testsStructures.forEach((test) => {
      const begin = new Date();
      const output = this.execSync(test);
      let result: Result;

      if (output === test.stdout) {
        const metadatas = new ResultMetadatas("");
        result = new Result(Status.SUCCESS, metadatas, test);
      } else {
        const metadatas = new ResultMetadatas("");
        result = new Result(Status.FAILURE, metadatas, test);
      }
      const end = new Date();

      log(
        ` ${this.checkMetadatas(result.status)} ${test.filename} ▶ ${
          result.structure.description
        } ${this.timer(begin, end)} ${
          result.status === Status.SUCCESS ? "\n" : ""
        }`
      );

      if (result.status === Status.FAILURE) {
        this.diff(result.structure.stdout, output);
        throw new Error("toml-it silently failed.");
      }
    });
    return true;
  }
}
