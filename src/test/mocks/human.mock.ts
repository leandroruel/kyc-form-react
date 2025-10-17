// Mock for @vladmandic/human library to avoid TensorFlow.js node dependency in tests

export interface Config {
  backend?: string;
  modelBasePath?: string;
  face?: any;
  body?: any;
  hand?: any;
  object?: any;
  gesture?: any;
}

export class Human {
  constructor(_config?: Partial<Config>) {
    // Mock constructor
  }

  async load() {
    // Mock load
    return Promise.resolve();
  }

  async warmup() {
    // Mock warmup
    return Promise.resolve();
  }

  async detect(_input: any) {
    // Mock detect - returns no faces detected
    return Promise.resolve({
      face: [],
      body: [],
      hand: [],
      object: [],
      gesture: [],
    });
  }
}

export default { Human };
