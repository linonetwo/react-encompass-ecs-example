export class MyClass {
  public _counter: number;

  constructor(init = 0) {
    console.log(init);
    this._counter = init;
  }

  get counter() {
    return this._counter;
  }

  public increment(delta = 1) {
    this._counter += delta;
  }
}
