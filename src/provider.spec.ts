import { isClassProvider, BaseProvider, isValueProvider, isFactoryProvider } from './provider';

describe('isClassProvider', () => {
  it('can identify a class provider', () => {
    const output = isClassProvider({ provide: String, useClass: String } as BaseProvider<String>);
    expect(output).toBeTruthy();
  });
  it('can identify a non-class provider', () => {
    const output = isClassProvider({ provide: String, useValue: 'Hello' } as BaseProvider<String>);
    expect(output).toBeFalsy();
  });
});

describe('isValueProvider', () => {
  it('can identify a value provider', () => {
    const output = isValueProvider({ provide: String, useValue: 'Hello' } as BaseProvider<String>);
    expect(output).toBeTruthy();
  });
  it('can identify a non-value provider', () => {
    const output = isValueProvider({ provide: String, useClass: String } as BaseProvider<String>);
    expect(output).toBeFalsy();
  });
});

describe('isFactoryProvider', () => {
  it('can identify a factory provider', () => {
    const output = isFactoryProvider({ provide: String, useFactory: () => 'Hello' } as BaseProvider<String>);
    expect(output).toBeTruthy();
  });
  it('can identify a non-factory provider', () => {
    const output = isFactoryProvider({ provide: String, useClass: String } as BaseProvider<String>);
    expect(output).toBeFalsy();
  });
});
