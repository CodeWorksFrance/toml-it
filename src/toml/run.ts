import * as toml from "toml";
import * as glob from "glob";
import { Structure } from "../models/structure.model";
import * as fs from "fs";

function getSpecFilesNames(): Array<string> {
  return glob.sync("**/*.spec.toml", {});
}

function readTomlFile(filename: string): string {
  const file = fs.readFileSync(filename, {
    encoding: "utf-8",
    flag: "r",
  });
  return file;
}

export function getTestsStructures(): Array<Structure> {
  const specFilesNames = getSpecFilesNames();
  const structures: Array<Structure> = [];

  specFilesNames.forEach((filename) => {
    const data = toml.parse(readTomlFile(filename));
    structures.push(new Structure(data, filename));
  });

  return structures;
}

export function run() {
  const testsStructures = getTestsStructures();
  
  testsStructures.forEach(test => {
    console.log(` ✅ ${test.filename} ▶ ${test.description}`);
  })
}
