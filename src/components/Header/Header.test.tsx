import * as React from 'react';
import { Header } from './Header';

it('header must not be null', () => {
  const header = <Header />;
  expect(header).not.toBeNull();
});