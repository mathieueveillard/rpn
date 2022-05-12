import { rpn } from ".";
import { Success, Error } from "./util/maybe";

describe("v1", function () {
  describe("Binary operations", function () {
    test("Binary operation: +", function () {
      expect((rpn([1, 1, "+"]) as Success<number>).result).toEqual(2);
    });

    test("[Triangulation] Binary operation: +", function () {
      expect((rpn([1, 2, "+"]) as Success<number>).result).toEqual(3);
    });

    test("Binary operation: +", function () {
      expect((rpn([1, 2, "-"]) as Success<number>).result).toEqual(-1);
    });

    test("Binary operation: *", function () {
      expect((rpn([1, 2, "*"]) as Success<number>).result).toEqual(2);
    });

    test("Binary operation: /", function () {
      expect((rpn([1, 2, "/"]) as Success<number>).result).toEqual(0.5);
    });
  });

  describe("Recursion with stack", function () {
    test("", function () {
      expect((rpn([1, 1, "+", 1, "+"]) as Success<number>).result).toEqual(3);
    });

    test("", function () {
      expect((rpn([1, 1, 1, "+", "+"]) as Success<number>).result).toEqual(3);
    });
  });

  // https://stackoverflow.com/a/64868283
  describe("Unary operators", function () {
    test("NEGATE", function () {
      expect((rpn([1, "NEGATE"]) as Success<number>).result).toEqual(-1);
    });

    test("[Control]", function () {
      expect((rpn([1, "NEGATE", 1, "+"]) as Success<number>).result).toEqual(0);
    });
  });

  describe("Error management", function () {
    test("Division by 0", function () {
      expect((rpn([1, 0, "/"]) as Error<number>).error).toEqual("Error: division by 0");
    });

    test("Insufficient number of operands (unary operator)", function () {
      expect((rpn(["NEGATE"]) as Error<number>).error).toEqual("Error: insufficient number of operands");
    });

    test("Insufficient number of operands (binary operator)", function () {
      expect((rpn([1, "+"]) as Error<number>).error).toEqual("Error: insufficient number of operands");
    });

    test("Insufficient number of operands (binary operator)", function () {
      expect((rpn(["+"]) as Error<number>).error).toEqual("Error: insufficient number of operands");
    });
  });
});
