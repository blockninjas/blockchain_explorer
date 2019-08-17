import React from 'react';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { Header } from './components/Header';

library.add(fas, far);

export const App: React.FC = ({ children }) => (
  <>
    <Header />
    {children}
  </>
);
