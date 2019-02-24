import configureStore, {
  history,
} from '../configureStore';

describe('configureStore', () => {
  it('is an object', () => {
    expect(configureStore()).toBeInstanceOf(Object);
  });
});

describe('history', () => {
  it('is an object', () => {
    expect(history).toBeInstanceOf(Object);
  });
});
