import { Container } from "./container";
import { Injectable } from "./injectable";
import { Inject } from "./inject";
import { InjectionToken } from "./provider";

describe("Container", () => {
  describe("inject", () => {
    class BasicClass {
      constructor(public x: number) {}
    }

    @Injectable()
    class InjectableClass {
      constructor(public basicClass: BasicClass) {}
    }

    @Injectable()
    class ACircularClass {
      constructor(public other: BCircularClass) {}
    }

    @Injectable()
    class BCircularClass {
      constructor(public other: ACircularClass) {}
    }

    @Injectable()
    class AnotherBasicClass {
      x: number = 10;
    }

    @Injectable()
    class TokenOverrideClass {
      constructor(@Inject(AnotherBasicClass) public basicClass: BasicClass) {}
    }

    const SPECIAL_STRING_TOKEN = new InjectionToken("some-identifer");
    @Injectable()
    class TokenStringOverrideClass {
      constructor(@Inject(SPECIAL_STRING_TOKEN) public someValue: string) {}
    }

    interface SomeInterface {
      a: string;
    }

    @Injectable()
    class SomeInferfaceClass {
      constructor(public someInterface: SomeInterface) {}
    }

    it("can inject using a value provider", () => {
      const container = new Container();
      const input = { x: 200 };
      container.addProvider({ provide: BasicClass, useValue: input });
      const output = container.inject(BasicClass);
      expect(input).toBe(output);
    });

    it("can inject using a factory provider", () => {
      const container = new Container();
      const input = { x: 200 };
      container.addProvider({ provide: BasicClass, useFactory: () => input });
      const injectedVal = container.inject(BasicClass);
      expect(injectedVal).toBe(input);
    });

    it("can inject using a class provider", () => {
      const container = new Container();
      const basicValue = { x: 200 };
      container.addProvider({ provide: BasicClass, useValue: basicValue });
      container.addProvider({
        provide: InjectableClass,
        useClass: InjectableClass
      });
      const injectedVal = container.inject(InjectableClass);
      expect(injectedVal.basicClass).toBe(basicValue);
    });

    it("will default to a class provider for the top level class if no provider for that type exists and the type is injectable ", () => {
      const container = new Container();
      const basicValue = { x: 200 };
      container.addProvider({ provide: BasicClass, useValue: basicValue });
      const injectedVal = container.inject(InjectableClass);
      expect(injectedVal.basicClass).toBe(basicValue);
    });

    it("will throw an error when a class with a circular dependency is detected", () => {
      const container = new Container();
      container.addProvider({
        provide: ACircularClass,
        useClass: ACircularClass
      });
      container.addProvider({
        provide: BCircularClass,
        useClass: BCircularClass
      });
      expect(() =>
        container.inject(ACircularClass)
      ).toThrowErrorMatchingInlineSnapshot(
        `"Injection error. Recursive dependency detected in constructor for type ACircularClass with parameter at index 0"`
      );
    });

    it("will throw an error when a class which isn't injectable is provided with a class provider", () => {
      const injector = new Container();
      const provider = { provide: BasicClass, useClass: BasicClass };
      expect(() =>
        injector.addProvider(provider)
      ).toThrowErrorMatchingInlineSnapshot(
        `"Cannot provide BasicClass using class BasicClass, BasicClass isn't injectable"`
      );
    });

    it("can inject a class provider with an override", () => {
      const container = new Container();
      container.addProvider({
        provide: AnotherBasicClass,
        useClass: AnotherBasicClass
      });
      container.addProvider({ provide: BasicClass, useValue: { x: 200 } });
      container.addProvider({
        provide: TokenOverrideClass,
        useClass: TokenOverrideClass
      });

      const output = container.inject(TokenOverrideClass);
      expect(output.basicClass).toEqual(new AnotherBasicClass());
    });

    it("can inject a string value provider with an override and injection token", () => {
      const container = new Container();
      const specialValue = "the special value";
      container.addProvider({
        provide: TokenStringOverrideClass,
        useClass: TokenStringOverrideClass
      });
      container.addProvider({
        provide: SPECIAL_STRING_TOKEN,
        useValue: specialValue
      });

      const output = container.inject(TokenStringOverrideClass);
      expect(output.someValue).toEqual(specialValue);
    });

    it("will throw an exception if a value for an injection token doesn't exist", () => {
      const container = new Container();
      container.addProvider({
        provide: TokenStringOverrideClass,
        useClass: TokenStringOverrideClass
      });
      expect(() =>
        container.inject(TokenStringOverrideClass)
      ).toThrowErrorMatchingInlineSnapshot(
        `"No provider for type some-identifer"`
      );
    });

    it("will fail to inject an interface", () => {
      const container = new Container();
      expect(() =>
        container.inject(SomeInferfaceClass)
      ).toThrowErrorMatchingInlineSnapshot(`"No provider for type Object"`);
    });
  });
});
