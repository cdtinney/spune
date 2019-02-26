const express = require('express');
const initRouter = require('../index');

describe('initRouter', () => {
  it('returns an express router', () => {
    expect(Object.getPrototypeOf(initRouter()))
      .toEqual(express.Router);
  })
});
