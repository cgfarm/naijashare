import React, { useState, useEffect } from 'react';
import { User, UserRole, ReceiptData } from './types';
import { dbService } from './services/db';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { PublicHome } from './components/PublicHome';
import { RidesView } from './components/RidesView';
import { ServicesView } from './components/ServicesView';
import { ApartmentsView } from './components/ApartmentsView';
import { DashboardView } from './components/DashboardView';
import { AuthModal } from './components/AuthModal';
import { CodeExplorerModal } from './components/CodeExplorerModal';
import { IdentityVerificationModal } from './components/IdentityVerificationModal';
import { ReceiptModal } from './components/ReceiptModal';
import { TermsModal } from './components/TermsModal';
import { AdvertiseBusinessModal } from './components/AdvertiseBusinessModal';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(dbService.getCurrentUser());
  const [activeTab, setActiveTab] = useState<'home' | 'rides' | 'services' | 'apartments' | 'dashboard'>('home');
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isCodeExplorerOpen, setIsCodeExplorerOpen] = useState(false);
  const [isVerificationOpen, setIsVerificationOpen] = useState(false);
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [isAdvertiseOpen, setIsAdvertiseOpen] = useState(false);
  const [activeReceipt, setActiveReceipt] = useState<ReceiptData | null>(null);

  // Sync state when database updates
  useEffect(() => {
    const handleDbUpdate = () => {
      setCurrentUser(dbService.getCurrentUser());
    };
    window.addEventListener('naijashare_db_updated', handleDbUpdate);
    return () => window.removeEventListener('naijashare_db_updated', handleDbUpdate);
  }, []);

  const handleRoleSwitch = (role: UserRole) => {
    const user = dbService.switchUserByRole(role);
    setCurrentUser(user);
    setActiveTab('dashboard');
  };

  const handleLoginSuccess = () => {
    setCurrentUser(dbService.getCurrentUser());
  };

  const handleOpenReceipt = (receipt: ReceiptData) => {
    setActiveReceipt(receipt);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-slate-900 font-sans">
      
      {/* Top Navigation */}
      <Navbar
        currentUser={currentUser}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenCodeExplorer={() => setIsCodeExplorerOpen(true)}
        onOpenVerification={() => setIsVerificationOpen(true)}
        onOpenAdvertise={() => setIsAdvertiseOpen(true)}
        onRoleSwitch={handleRoleSwitch}
      />

      {/* Main View Port */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <PublicHome
            onNavigate={(tab) => setActiveTab(tab)}
            onOpenCodeExplorer={() => setIsCodeExplorerOpen(true)}
            onOpenAuth={() => setIsAuthOpen(true)}
            onOpenAdvertise={() => setIsAdvertiseOpen(true)}
            onOpenTerms={() => setIsTermsOpen(true)}
          />
        )}

        {activeTab === 'rides' && (
          <RidesView
            currentUser={currentUser}
            onOpenAuth={() => setIsAuthOpen(true)}
            onViewReceipt={handleOpenReceipt}
            onOpenVerification={() => setIsVerificationOpen(true)}
          />
        )}

        {activeTab === 'services' && (
          <ServicesView
            currentUser={currentUser}
            onOpenAuth={() => setIsAuthOpen(true)}
            onViewReceipt={handleOpenReceipt}
          />
        )}

        {activeTab === 'apartments' && (
          <ApartmentsView
            currentUser={currentUser}
            onOpenAuth={() => setIsAuthOpen(true)}
            onViewReceipt={handleOpenReceipt}
          />
        )}

        {activeTab === 'dashboard' && currentUser && (
          <DashboardView
            currentUser={currentUser}
            onRoleSwitch={handleRoleSwitch}
            onOpenCodeExplorer={() => setIsCodeExplorerOpen(true)}
            onOpenVerification={() => setIsVerificationOpen(true)}
            onViewReceipt={handleOpenReceipt}
            onOpenAdvertise={() => setIsAdvertiseOpen(true)}
          />
        )}
      </main>

      {/* Footer */}
      <Footer
        onOpenTerms={() => setIsTermsOpen(true)}
        onOpenAdvertise={() => setIsAdvertiseOpen(true)}
      />

      {/* Modals */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      <CodeExplorerModal
        isOpen={isCodeExplorerOpen}
        onClose={() => setIsCodeExplorerOpen(false)}
      />

      {currentUser && (
        <IdentityVerificationModal
          isOpen={isVerificationOpen}
          onClose={() => setIsVerificationOpen(false)}
          onVerified={() => {
            setCurrentUser(dbService.getCurrentUser());
          }}
          currentUser={currentUser}
        />
      )}

      <ReceiptModal
        isOpen={!!activeReceipt}
        onClose={() => setActiveReceipt(null)}
        receipt={activeReceipt}
      />

      <TermsModal
        isOpen={isTermsOpen}
        onClose={() => setIsTermsOpen(false)}
      />

      <AdvertiseBusinessModal
        isOpen={isAdvertiseOpen}
        onClose={() => setIsAdvertiseOpen(false)}
        onAdCreated={() => {
          setCurrentUser(dbService.getCurrentUser());
        }}
      />

    </div>
  );
}
