const express = require('express');
const router = require('../index');

describe('router', () => {
  it('returns an express router', () => {
    expect(Object.getPrototypeOf(router))
      .toEqual(express.Router);
  })
});
