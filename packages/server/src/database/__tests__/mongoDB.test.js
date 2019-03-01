const mongoDB = require('../mongoDB');
const { connectEventListeners } = require('../mongoDB');

describe('mongoDB', () => {
  it('exports an object without errors', () => {
    expect(mongoDB).toBeDefined();
  });

  it('connects to the database successfully when the database is running', (done) => {
    const mockDone = jest.fn().mockImplementation(() => {
      expect(mockDone).toHaveBeenCalledWith(); // No errors
      mongoDB.disconnect(done);
    });

    mongoDB.connect(mockDone);
  });

  describe('connectEventListeners', () => {
    it('calls the callback with errors when an error event occurs', () => {
      const mockConnection = (() => {
        const listeners = {};
        return {
          on: function on(event, callback) {
            listeners[event] = callback;
          },
          once: jest.fn(),
          fire: function fire(event, args) {
            listeners[event](args);
          },
        };
      })();

      const mockCallback = jest.fn();
      connectEventListeners(mockConnection, mockCallback);
      mockConnection.fire('error', 'foo');
      expect(mockCallback).toHaveBeenCalledWith('foo');
    });
  });
});
