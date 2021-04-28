import React from 'react';

import Navbar from './landingPageComponents/Navbar';
import LandingSection from './landingPageComponents/LandingSection';
import InfoSection from './landingPageComponents/InfoSection';
import InfoSection2 from './landingPageComponents/InfoSection2';
import InfoSection3 from './landingPageComponents/InfoSection3';
import CallToAction from './landingPageComponents/CallToAction';
import Footer from './landingPageComponents/Footer';

export default function LandingPage() {
  return (
    <>
      <Navbar />
      <LandingSection />
      <InfoSection />
      <InfoSection3 />
      <InfoSection2 />
      <CallToAction />
      <Footer />
    </>
  );
}
