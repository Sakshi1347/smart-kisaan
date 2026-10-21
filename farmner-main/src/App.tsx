import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import Navbar from "@/components/Navbar";
import { PHASE1 } from "@/lib/phase1";
import Landing from "./pages/Landing";
import SchemeExplorer from "./pages/SchemeExplorer";
import SchemeCompare from "./pages/SchemeCompare";
import Dashboard from "./pages/Dashboard";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import SchemeDetails from "./pages/SchemeDetails";
import PhaseLater from "./pages/PhaseLater";
import Help from "./pages/Help";
import EligibilityCheck from "./pages/EligibilityCheck";
import CropDisease from "./pages/CropDisease";
import { AccessibilityProvider } from "@/contexts/AccessibilityContext";
import AccessibilityModal from "@/components/AccessibilityModal";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <LanguageProvider>
        <AccessibilityProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Navbar />
              <AccessibilityModal />
              <div className="pb-20 md:pb-0">
              <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/help" element={<Help />} />
                <Route path="/schemes" element={<SchemeExplorer />} />
                <Route path="/schemes/:schemeId" element={<SchemeDetails />} />
                <Route path="/eligibility" element={<EligibilityCheck />} />
                <Route path="/documents" element={<EligibilityCheck />} />
                <Route path="/crop-disease" element={<CropDisease />} />
                <Route
                  path="/compare"
                  element={
                    PHASE1.schemeCompare ? (
                      <SchemeCompare />
                    ) : (
                      <PhaseLater feature="Scheme compare" featureHi="योजना तुलना" />
                    )
                  }
                />
                <Route
                  path="/dashboard"
                  element={
                    PHASE1.authAndDashboard ? (
                      <Dashboard />
                    ) : (
                      <PhaseLater feature="Dashboard" featureHi="डैशबोर्ड" />
                    )
                  }
                />
                <Route
                  path="/chat"
                  element={
                    <PhaseLater feature="DIY AI chatbot" featureHi="स्व-निर्मित एआई चैटबॉट" />
                  }
                />
                <Route
                  path="/auth"
                  element={
                    PHASE1.authAndDashboard ? (
                      <Auth />
                    ) : (
                      <PhaseLater feature="Sign in" featureHi="साइन इन" />
                    )
                  }
                />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
          </BrowserRouter>
        </TooltipProvider>
      </AccessibilityProvider>
    </LanguageProvider>
  </AuthProvider>
</QueryClientProvider>
);

export default App;
