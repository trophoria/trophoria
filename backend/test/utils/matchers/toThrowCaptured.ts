export async function toThrowCaptured(actual: () => Promise<void>, expected) {
  const successMessage = 'successfully thrown correct error';
  let errorMessage = 'function did not throw any error';
  let pass = false;

  try {
    await actual();
  } catch (e) {
    pass = e instanceof expected;
    if (!pass) {
      errorMessage =
        e.constructor.name +
        ' is not an instance of ' +
        expected.constructor.name;
    }
  }

  return { pass, message: () => (pass ? successMessage : errorMessage) };
}
