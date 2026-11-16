/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { AboutPage } from './components/AboutPage';
import { BookEventPage } from './components/BookEventPage';
import { BuildEventPage } from './components/BuildEventPage';
import { CollectionsPage } from './components/CollectionsPage';
import { Footer } from './components/Footer';
import { GalleryPage } from './components/GalleryPage';
import { HomePage } from './components/HomePage';
import { LightboxModal } from './components/LightboxModal';
import { Navbar } from './components/Navbar';
import { OpeningReveal } from './components/OpeningReveal';
import { OwnerManagerModal } from './components/OwnerManagerModal';
import { CatalogProvider, useCatalog } from './context/CatalogContext';

function AppShell() {
  const { currentView } = useCatalog();

  const renderPage = () => {
    switch (currentView) {
      case 'home':
        return <HomePage />;
      case 'build':
        return <BuildEventPage />;
      case 'collections':
        return <CollectionsPage />;
      case 'gallery':
        return <GalleryPage />;
      case 'about':
        return <AboutPage />;
      case 'book':
        return <BookEventPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F6] text-[#1C1917]">
      <OpeningReveal />
      <Navbar />

      <main className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentView}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
          >
            {renderPage()}
          </motion.div>
        </AnimatePresence>
      </main>

      <Footer />
      <LightboxModal />
      <OwnerManagerModal />
    </div>
  );
}

export default function App() {
  return (
    <CatalogProvider>
      <AppShell />
    </CatalogProvider>
  );
}
