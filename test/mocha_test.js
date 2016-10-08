import chai from "chai"

import {test1, test2} from "../src/.test/mocha_test.js"

// You should learn syntax of [mocha](http://mochajs.org/#getting-started)
// and [chai](http://chaijs.com)

// Tell chai that we'll be using the "should" style assertions.
chai.should();

describe("mocha", () => {
  describe("test1", () => {
    it("should equal to '1'", () => {
      test1.test.should.equal("1");
    });
  });

  describe("test2", () => {
    let print;

    beforeEach(() => {
      print = test2("print: ")(" by test2");
    });

    it("should be 'print: first test by test2'", () => {
      print("first test").should.equal("print: first test by test2");
    });

    it("should be 'print: second test by test2'", () => {
      print("second test").should.equal("print: second test by test2");
    });
  });
});
