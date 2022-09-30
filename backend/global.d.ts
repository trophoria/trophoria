import 'jest-extended';

declare global {
  namespace jest {
    interface Matchers<R> {
      /**
       * Executes the in expected provided (async) callback in an save environment
       * and checks, if this callback throws an error. If not, the test fails. If an
       * error gets thrown, it must be an instance of the provided type.
       *
       * @param type  The error type to check for
       */
      toThrowCaptured(type: unknown): Promise<R>;
    }
  }
}
