import * as fs from "fs";
import * as glob from "glob";
import * as toml from "toml";
import { execSync } from "child_process";
import { Structure } from "../models/structure.model";
import { Result, ResultMetadatas, Status } from "../models/result.model";

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

  constructor() {
    const testsStructures = this.getTestsStructures();

    testsStructures.forEach((test) => {
      const begin = new Date();
      const output = execSync(`npm start -- ${test.args}`).toString().split("\n").filter((o) => !o.startsWith(">") && o !== "");
      let result: Result;
      if (output.join('\n') === test.stdout) {
        const metadatas = new ResultMetadatas("");
        result = new Result(Status.SUCCESS, metadatas, test);
      } else {
        const metadatas = new ResultMetadatas("");
        result = new Result(Status.FAILURE, metadatas, test);
      }
      const end = new Date();
      console.log(
        ` ${this.checkMetadatas(result.status)} ${test.filename} ▶ ${
          result.structure.description
        } (${end.getTime() - begin.getTime()}ms)`
      );
    });
  }
}
