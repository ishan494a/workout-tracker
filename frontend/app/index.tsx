import React from 'react';
import { StatusBar } from 'react-native';
import Layout from './_layout';

const App = () => {
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <Layout />
    </>
  );
};

export default App;
