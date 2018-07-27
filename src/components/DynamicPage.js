import React from 'react';
import { Header } from 'semantic-ui-react';

import Layout from './Layout';

const DynamicPage = () => (
  <Layout>
    <Header as="h2">Dynamic Pageww</Header>
    <p>This page was loaded asynchronously!!!</p>
  </Layout>
);

export default DynamicPage;
