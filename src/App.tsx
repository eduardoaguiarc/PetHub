import React from 'react';
import { PetHubProvider, usePetHub } from './context/PetHubContext';
import { RoleSwitcherBar } from './components/layout/RoleSwitcherBar';
import { TutorAppFrame } from './components/tutor/TutorAppFrame';
import { MerchantDashboard } from './components/merchant/MerchantDashboard';
import { SuperAdminDashboard } from './components/admin/SuperAdminDashboard';

const PetHubShell: React.FC = () => {
  const { role } = usePetHub();

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF5F2] text-[#2D1E1A]">
      <RoleSwitcherBar />
      <div className="flex-1">
        {role === 'tutor' && <TutorAppFrame />}
        {role === 'merchant' && <MerchantDashboard />}
        {role === 'admin' && <SuperAdminDashboard />}
      </div>
    </div>
  );
};

export function App() {
  return (
    <PetHubProvider>
      <PetHubShell />
    </PetHubProvider>
  );
}

export default App;
