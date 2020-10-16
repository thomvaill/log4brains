import { ValueObject } from "./ValueObject";

describe("ValueObject", () => {
  type MyVo1Props = {
    prop1: string;
    prop2: number;
  };
  class MyVo1 extends ValueObject<MyVo1Props> {}
  class MyVo1bis extends ValueObject<MyVo1Props> {}

  type MyVo2Props = {
    prop1: string;
  };
  class MyVo2 extends ValueObject<MyVo2Props> {}

  describe("equals()", () => {
    it("returns true for the same instance", () => {
      const vo = new MyVo1({ prop1: "foo", prop2: 42 });
      expect(vo.equals(vo)).toBeTruthy();
    });

    it("returns true for a different instance with the same props", () => {
      const vo1 = new MyVo1({ prop1: "foo", prop2: 42 });
      const vo2 = new MyVo1({ prop1: "foo", prop2: 42 });
      expect(vo1.equals(vo2)).toBeTruthy();
      expect(vo2.equals(vo1)).toBeTruthy();
    });

    it("returns false for a different instance", () => {
      const vo1 = new MyVo1({ prop1: "foo", prop2: 42 });
      const vo2 = new MyVo1({ prop1: "bar", prop2: 42 });
      expect(vo1.equals(vo2)).toBeFalsy();
      expect(vo2.equals(vo1)).toBeFalsy();
    });

    it("returns false for a different class", () => {
      const vo1 = new MyVo1({ prop1: "foo", prop2: 42 });
      const vo2 = new MyVo2({ prop1: "foo" });
      expect(vo2.equals(vo1)).toBeFalsy();
    });

    it("returns false for a different class with the same props", () => {
      const vo1 = new MyVo1({ prop1: "foo", prop2: 42 });
      const vo1bis = new MyVo1bis({ prop1: "foo", prop2: 42 });
      expect(vo1bis.equals(vo1)).toBeFalsy();
      expect(vo1.equals(vo1bis)).toBeFalsy();
    });
  });
});
