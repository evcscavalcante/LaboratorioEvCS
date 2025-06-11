import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";

import { DataSyncProvider } from "@/contexts/data-sync-context";
import MainLayout from "@/components/layout/main-layout";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import Laboratory from "@/pages/laboratory";
import Analytics from "@/pages/analytics";
import SecureLogin from "@/pages/secure-login";
import SubscriptionPage from "@/pages/subscription";
import DensidadeInSituPage from "@/pages/solos/densidade-in-situ";
import DensidadeRealPage from "@/pages/solos/densidade-real";
import DensidadeMaxMinPage from "@/pages/solos/densidade-max-min";
import BalancaVerificacao from "@/pages/balanca-verificacao";
import Configuracoes from "@/pages/configuracoes";
import Relatorios from "@/pages/relatorios";
import Dashboard from "@/pages/dashboard";
import EquipamentosGestao from "@/pages/equipamentos-gestao";
import AdminDashboard from "@/pages/admin/dashboard";
import UserManagement from "@/pages/admin/user-management";
import UserRoles from "@/pages/admin/user-roles";
import OrganizationManagement from "@/pages/admin/organization-management";
import ManualUsuario from "@/pages/help/manual-usuario";
import ManualAdmin from "@/pages/help/manual-admin";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando autenticação...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <SecureLogin />;
  }

  return (
    <MainLayout>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/laboratory" component={Laboratory} />
        <Route path="/analytics" component={Analytics} />
        <Route path="/subscription" component={SubscriptionPage} />
        <Route path="/solos/densidade-in-situ" component={DensidadeInSituPage} />
        <Route path="/solos/densidade-real" component={DensidadeRealPage} />
        <Route path="/solos/densidade-max-min" component={DensidadeMaxMinPage} />
        <Route path="/balanca-verificacao" component={BalancaVerificacao} />
        <Route path="/configuracoes" component={Configuracoes} />
        <Route path="/relatorios" component={Relatorios} />
        <Route path="/equipamentos" component={EquipamentosGestao} />
        <Route path="/admin" component={AdminDashboard} />
        <Route path="/admin/users" component={UserManagement} />
        <Route path="/admin/user-roles" component={UserRoles} />
        <Route path="/admin/organizations" component={OrganizationManagement} />
        <Route path="/help/manual-usuario" component={ManualUsuario} />
        <Route path="/help/manual-admin" component={ManualAdmin} />
        <Route component={NotFound} />
      </Switch>
    </MainLayout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <DataSyncProvider>
        <Router />
      </DataSyncProvider>
    </QueryClientProvider>
  );
}

export default App;
