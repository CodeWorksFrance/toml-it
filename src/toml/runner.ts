import * as fs from "fs";
import * as glob from "glob";
import * as toml from "toml";
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
  
  checkTestStatus(): Status {
    return Status.SUCCESS;
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
  
  run() {
    const testsStructures = this.getTestsStructures();
  
    testsStructures.forEach((test) => {
      const metadatas = new ResultMetadatas("");
      const result = new Result(this.checkTestStatus(), metadatas, test);
  
      console.log(
        ` ${this.checkMetadatas(result.status)} ${test.filename} ▶ ${
          result.structure.description
        }`
      );
    });
  }
}
