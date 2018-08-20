import React from 'react';
import { Header } from 'semantic-ui-react';

import Layout from './Layout';
import test from './test';

const DynamicPage = () => (
  <Layout>
    <Header as="h2">Dynamic Pageww</Header>
    <p onClick={()=>{
      test();
    }}>This page was loaded asynchronously!!!</p>
  </Layout>
);

export default DynamicPage;
