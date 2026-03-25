import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import StatsStrip from "./components/StatsStrip";
import FeatureGrid from "./components/FeatureGrid";
import Process from "./components/Process";
import GalleryPreview from "./components/GalleryPreview";
import CallToAction from "./components/CallToAction";
import Footer from "./components/Footer";

export default function HomePage() {
  return (
    <div className="page-wrap flex-1">
      <div className="bg-aurora" />
      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col px-6 pb-16 pt-8 sm:px-10">
        <Navbar />
        <main className="flex flex-col gap-20">
          <Hero />
          <StatsStrip />
          <FeatureGrid />
          <Process />
          <GalleryPreview />
          <CallToAction />
        </main>
        <Footer />
      </div>
    </div>
  );
}