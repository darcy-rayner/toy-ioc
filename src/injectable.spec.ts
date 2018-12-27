import 'reflect-metadata';
import { isInjectable, Injectable } from './injectable';

describe('Injectable', () => {
  @Injectable()
  class InjectableClass {}
  class StandardClass {}

  describe('isInjectable', () => {
    it('recognises and injectable class', () => {
      const injectable = isInjectable(InjectableClass);
      expect(injectable).toBeTruthy();
    });

    it('recognises a non-injectable class', () => {
      const injectable = isInjectable(StandardClass);
      expect(injectable).toBeFalsy();
    });
  });
});
