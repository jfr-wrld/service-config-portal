import { ServiceConfigProvider, useServiceConfig } from './context/ServiceConfigContext';
import ServiceManagement from './components/ServiceManagement';
import ServiceConfigurator from './components/ServiceConfigurator';
import { getDefaultRules } from './data/configSchema';
import { useState } from 'react';

function AppRouter() {
  const [activeService, setActiveService] = useState(null);
  const { setRules } = useServiceConfig();

  const handleSelectService = (service) => {
    setRules(getDefaultRules(service));
    setActiveService(service);
  };

  const handleBack = () => {
    setActiveService(null);
  };

  if (!activeService) {
    return <ServiceManagement onSelectService={handleSelectService} />;
  }

  return <ServiceConfigurator service={activeService} onBack={handleBack} />;
}

export default function App() {
  return (
    <ServiceConfigProvider>
      <AppRouter />
    </ServiceConfigProvider>
  );
}
