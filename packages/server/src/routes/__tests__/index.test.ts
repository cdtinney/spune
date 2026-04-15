import { describe, it, expect } from 'vitest';
import express from 'express';
import router from '../index';

describe('router', () => {
  it('returns an express router', () => {
    expect(Object.getPrototypeOf(router)).toEqual(express.Router);
  });
});
