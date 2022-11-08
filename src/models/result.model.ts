import { Structure } from "./structure.model";

export enum Status {
  SUCCESS,
  FAILURE,
};

export class ResultMetadatas {
  icon: string;

  constructor(icon: string) {
    this.icon = icon;
  }
}

export class Result {
  status: Status;
  metadatas: ResultMetadatas;
  structure: Structure;

  constructor(status: Status, metadatas: ResultMetadatas, structure: Structure) {
    this.status = status;
    this.metadatas = metadatas;
    this.structure = structure;
  }
}