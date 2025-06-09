import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/auth-context";
import { DataSyncProvider } from "@/contexts/data-sync-context";
import ProtectedRoute from "@/components/auth/protected-route";
import MainLayout from "@/components/layout/main-layout";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import Analytics from "@/pages/analytics";
import DensidadeInSituPage from "@/pages/solos/densidade-in-situ";
import DensidadeRealPage from "@/pages/solos/densidade-real";
import DensidadeMaxMinPage from "@/pages/solos/densidade-max-min";
import AdminDashboard from "@/pages/admin/dashboard";
import UserManagement from "@/pages/admin/user-management";
import OrganizationManagement from "@/pages/admin/organization-management";
import ManualUsuario from "@/pages/help/manual-usuario";
import ManualAdmin from "@/pages/help/manual-admin";

function Router() {
  return (
    <ProtectedRoute>
      <MainLayout>
        <Switch>
          <Route path="/" component={Dashboard} />
          <Route path="/analytics" component={Analytics} />
          <Route path="/solos/densidade-in-situ" component={DensidadeInSituPage} />
          <Route path="/solos/densidade-real" component={DensidadeRealPage} />
          <Route path="/solos/densidade-max-min" component={DensidadeMaxMinPage} />
          <Route path="/admin" component={AdminDashboard} />
          <Route path="/admin/users" component={UserManagement} />
          <Route path="/admin/organizations" component={OrganizationManagement} />
          <Route path="/help/manual-usuario" component={ManualUsuario} />
          <Route path="/help/manual-admin" component={ManualAdmin} />
          <Route component={NotFound} />
        </Switch>
      </MainLayout>
    </ProtectedRoute>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <DataSyncProvider>
            <Toaster />
            <Router />
          </DataSyncProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
