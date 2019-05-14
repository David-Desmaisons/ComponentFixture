function silentConsole(window) {
  const { console } = window;
  const { warn: originalWarn, error: originalError } = console;
  console.warn = console.error = () => {};

  return () => {
    console.warn = originalWarn;
    console.error = originalError;
  };
}

export default silentConsole;
