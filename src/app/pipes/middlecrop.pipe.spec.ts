import { MiddleCropPipe } from './middlecrop.pipe';

describe('MiddleCropPipe', () => {
  let pipe: MiddleCropPipe;

  beforeEach(() => {
    pipe = new MiddleCropPipe();
  })

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return the same input for a small one', () => {
    expect(pipe.transform("johnhon@gmail.com", 25)).toEqual("johnhon@gmail.com");
  });

  it('should return an ellipis for a big one', () => {
    expect(pipe.transform("my-sooooo-loooong-email@gmail.com", 25)).toEqual("my-sooooo-lo...ail@gmail.com");
  });

});
