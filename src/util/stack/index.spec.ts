import { pop, push } from ".";

describe("Stack", function () {
  test("push()", function () {
    // GIVEN
    const array = [0, 1, 2, 3];

    // WHEN
    const actual = push(array)(4);

    // THEN
    const expected = [0, 1, 2, 3, 4];
    expect(actual).toEqual(expected);
    expect(array.length).toEqual(4);
  });

  test("pop()", function () {
    // GIVEN
    const array = [0, 1, 2, 3, 4];

    // WHEN
    const actual = pop(array);

    // THEN
    const expected = {
      stack: [0, 1, 2, 3],
      value: 4,
    };
    expect(actual).toEqual(expected);
    expect(array.length).toEqual(5);
  });
});
