import * as glob from 'glob';
import * as fs from 'fs';
import { TestRunner } from './toml';

describe('Framework specifications', () => {
  describe('TOML parsing', () => {
    it('should parse test file', () => {
      jest.spyOn(fs, 'readFileSync').mockReturnValueOnce(`
        stdout="test"
        args="argument_1 argument_2 argument_3"
        description="this is a correct toml test description"`);
      new TestRunner().getTestsStructures();
    });

    it('should throw an exception when properties length is not correct', () => {
      jest.spyOn(fs, 'readFileSync').mockReturnValueOnce(`
        stdout="test"
        args="argument_1 argument_2 argument_3"
        description="this is my first test"
        unknowProperty=""`);
      try {
        new TestRunner().getTestsStructures();
      } catch (e) {
        expect((e as { message: string }).message).toEqual(
          'There are some missing properties in the TOML file.'
        );
      }
    });

    it('should throw an exception when properties is not correct', () => {
      jest
        .spyOn(fs, 'readFileSync')
        .mockReturnValueOnce('unknowProperty="test" \n\t');

      try {
        new TestRunner().getTestsStructures();
      } catch (e) {
        expect((e as { message: string }).message).toEqual(
          'Properties are probably mispelled.'
        );
      }
    });
  });

  describe('Run', () => {
    beforeEach(() => {
      jest.clearAllMocks();
      jest.useFakeTimers();
    });

    it('should display correct result with success status', () => {
      jest.spyOn(glob, 'sync').mockReturnValueOnce(['test.spec.toml']);
      jest.spyOn(fs, 'readFileSync')
        .mockReturnValueOnce(`stdout = "not ok\nhello world!\nGoodbye Marty!"
      args = "argument_1 argument_2 argument_3"
      description="Should display 'not ok'"
        `);
      expect(new TestRunner().run()).toBeTruthy();
    });

    it('should display correct result with error status', () => {
      jest.spyOn(glob, 'sync').mockReturnValueOnce(['test.spec.toml']);
      jest.spyOn(fs, 'readFileSync').mockReturnValueOnce(`
          stdout="Failing test"
          args="argument_1 argument_2 argument_3"
          description="This is a failing test"
        `);
      try {
        new TestRunner().run();
      } catch (e) {
        expect((e as { message: string }).message).toEqual(
          'toml-it silently failed.'
        );
      }
    });
  });
});
