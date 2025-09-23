import React, { useState } from 'react';
import Layout from './components/Layout';
import PropertyListings from './pages/PropertyListings';
import Neighborhoods from './pages/Neighborhoods';
import AgentProfiles from './pages/AgentProfiles';
import AdGeneration from './pages/AdGeneration';

function App() {
  const [activeTab, setActiveTab] = useState('listings');

  const renderPage = () => {
    switch (activeTab) {
      case 'listings':
        return <PropertyListings />;
      case 'neighborhoods':
        return <Neighborhoods />;
      case 'agents':
        return <AgentProfiles />;
      case 'ads':
        return <AdGeneration />;
      default:
        return <PropertyListings />;
    }
  };

  return (
    <Layout activeTab={activeTab} onTabChange={setActiveTab}>
      {renderPage()}
    </Layout>
  );
}

export default App;