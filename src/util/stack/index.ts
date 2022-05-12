export const push = <T>(stack: T[]) => (value: T): T[] => {
  return [...stack, value];
};

export const pop = <T>(stack: T[]): { stack: T[]; value: T } => {
  if (stack.length < 1) {
    throw Error("Error: stack is empty");
  }
  return {
    stack: stack.slice(0, -1),
    value: stack[stack.length - 1],
  };
};
