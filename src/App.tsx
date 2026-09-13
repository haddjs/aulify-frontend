import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./components/Homepage";
import LoginPage from "./components/LoginPage";
import BottomNav from "./components/Nav/BottomNav";
import SideNav from "./components/Nav/SideNav";
import SpendingPage from "./components/SpendingPage";
import WalletComingSoon from "./components/WalletComingSoon";
import { AuthProvider, useAuth } from "./context/AuthContext";

function AppRoutes() {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!user) return <LoginPage />;

  return (
    <div className="flex min-h-screen">
      <div className="hidden md:block">
        <SideNav />
      </div>

      <main className="w-full pb-24 md:pb-0">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/transactions" element={<SpendingPage />} />
          <Route path="/wallet" element={<WalletComingSoon />} />
        </Routes>
      </main>

      <div className="block md:hidden">
        <BottomNav />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
