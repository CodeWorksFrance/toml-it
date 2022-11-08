import * as toml from "toml";
import { Structure } from "../models/structure.model";
import * as fs from "fs";

function readTomlFile(): string {
  const file = fs.readFileSync("./tests/file.toml", {
    encoding: "utf-8",
    flag: "r",
  });
  return file;
}

export function parseString(): Structure {
  const data = toml.parse(readTomlFile());
  const result = new Structure(data);
  return result;
}
