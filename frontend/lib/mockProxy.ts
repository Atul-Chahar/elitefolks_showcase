export const createMockProxy = (name: string): any => {
  return new Proxy({}, {
    get: function(target, prop) {
      if (prop === 'then') return undefined; // Avoid infinite promise chains if awaited directly
      return async (...args: any[]) => {
        console.log(`[Showcase Mock] Called ${name}.${String(prop)}`);
        // Provide typical default shapes for arrays and booleans or strings
        return []; 
      };
    }
  }) as any;
};
export const createMockComponent = (name: string): Record<string, any> => {
  return function MockComponent() {
    return null; // NextJS doesn't need to render anything for an API server action
  } as any;
};
