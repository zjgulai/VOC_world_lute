import { lazy, Suspense, useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { ThemeProvider } from './components/ThemeProvider';
import './App.css';

const OverviewSection = lazy(() => import('./sections/OverviewSection').then((module) => ({ default: module.OverviewSection })));
const Top20Section = lazy(() => import('./sections/Top20Section').then((module) => ({ default: module.Top20Section })));
const CountriesSection = lazy(() => import('./sections/CountriesSection').then((module) => ({ default: module.CountriesSection })));
const ProductsSection = lazy(() => import('./sections/ProductsSection').then((module) => ({ default: module.ProductsSection })));
const SegmentsSection = lazy(() => import('./sections/SegmentsSection').then((module) => ({ default: module.SegmentsSection })));
const ClustersSection = lazy(() => import('./sections/ClustersSection').then((module) => ({ default: module.ClustersSection })));
const PlatformsSection = lazy(() => import('./sections/PlatformsSection').then((module) => ({ default: module.PlatformsSection })));
const InfoSourceQualitySection = lazy(() =>
  import('./sections/InfoSourceQualitySection').then((module) => ({ default: module.InfoSourceQualitySection }))
);
const P1SearchSection = lazy(() => import('./sections/P1SearchSection').then((module) => ({ default: module.P1SearchSection })));

function SectionFallback() {
  return (
    <div className="rounded-xl border border-border bg-card p-6 text-sm text-muted-foreground shadow-sm">
      正在加载模块...
    </div>
  );
}

function App() {
  const [activeSection, setActiveSection] = useState('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Handle scroll to update active section
  useEffect(() => {
    const handleScroll = () => {
      const sections = [
        'overview',
        'top20',
        'countries',
        'products',
        'segments',
        'clusters',
        'platforms',
        'infoSources',
        'p1Search',
      ];
      const scrollPosition = window.scrollY + 100;

      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(sectionId);
    }
  };

  return (
    <ThemeProvider defaultTheme="light" storageKey="voc-theme">
      <div className="min-h-screen bg-background flex">
        {/* Sidebar */}
        <Sidebar
          activeSection={activeSection}
          onSectionClick={scrollToSection}
          isOpen={isSidebarOpen}
          onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        />

        {/* Main Content */}
        <main
          className={`flex-1 transition-all duration-300 ${
            isSidebarOpen ? 'ml-64' : 'ml-16'
          }`}
        >
          {/* Header */}
          <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border">
            <div className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-xl font-semibold text-foreground">
                    VOC目的国舆情分析
                  </h1>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    麦肯锡风格咨询看板 · 全球母婴市场洞察
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">数据更新时间</p>
                    <p className="text-sm font-medium">2025年1月</p>
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* Content Sections */}
          <div className="p-6 space-y-8">
            <section id="overview" className="scroll-mt-20">
              <Suspense fallback={<SectionFallback />}>
                <OverviewSection />
              </Suspense>
            </section>

            <section id="top20" className="scroll-mt-20">
              <Suspense fallback={<SectionFallback />}>
                <Top20Section />
              </Suspense>
            </section>

            <section id="countries" className="scroll-mt-20">
              <Suspense fallback={<SectionFallback />}>
                <CountriesSection />
              </Suspense>
            </section>

            <section id="products" className="scroll-mt-20">
              <Suspense fallback={<SectionFallback />}>
                <ProductsSection />
              </Suspense>
            </section>

            <section id="segments" className="scroll-mt-20">
              <Suspense fallback={<SectionFallback />}>
                <SegmentsSection />
              </Suspense>
            </section>

            <section id="clusters" className="scroll-mt-20">
              <Suspense fallback={<SectionFallback />}>
                <ClustersSection />
              </Suspense>
            </section>

            <section id="platforms" className="scroll-mt-20">
              <Suspense fallback={<SectionFallback />}>
                <PlatformsSection />
              </Suspense>
            </section>

            <section id="infoSources" className="scroll-mt-20">
              <Suspense fallback={<SectionFallback />}>
                <InfoSourceQualitySection />
              </Suspense>
            </section>

            <section id="p1Search" className="scroll-mt-20">
              <Suspense fallback={<SectionFallback />}>
                <P1SearchSection />
              </Suspense>
            </section>
          </div>

          {/* Footer */}
          <footer className="border-t border-border mt-12 py-6 px-6">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <p>© 2025 VOC目的国舆情分析 · 麦肯锡咨询风格看板</p>
              <p>数据来源: 专题2_VOC_目的国VOC舆情分析_业务评审版.xlsx</p>
            </div>
          </footer>
        </main>
      </div>
    </ThemeProvider>
  );
}

export default App;
