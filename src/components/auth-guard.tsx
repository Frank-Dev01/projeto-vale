"use client";

import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

interface AuthGuardProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export function AuthGuard({ children, requireAdmin = false }: AuthGuardProps) {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Pequeno atraso para garantir que o hook useAuth seja inicializado
    const timer = setTimeout(() => {
      setIsInitialized(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isInitialized) return;

    console.log("AuthGuard Debug:", {
      pathname,
      isAuthenticated,
      user: user?.role,
      isInitialized
    });

    // Se não está autenticado e não está na página de login, redirecionar para login
    if (!isAuthenticated && pathname !== "/login") {
      console.log("Redirecting to login - not authenticated");
      router.push("/login");
      return;
    }

    // Se está autenticado e está na página de login, redirecionar para a página adequada
    if (isAuthenticated && pathname === "/login") {
      console.log("Redirecting from login to appropriate page");
      if (user?.role === "admin") {
        console.log("Redirecting admin to /");
        router.push("/");
      } else {
        console.log("Redirecting user to /my-lots");
        router.push("/my-lots");
      }
      return;
    }

    // Verificar se a rota requer acesso de admin
    if (requireAdmin && isAuthenticated && user?.role !== "admin") {
      console.log("Redirecting to my-lots - not admin");
      router.push("/my-lots");
      return;
    }

    // Verificar se usuário comum está tentando acessar rotas de admin
    if (!requireAdmin && isAuthenticated && user?.role === "user") {
      const adminRoutes = ["/", "/lots", "/reports", "/settings"];
      if (adminRoutes.includes(pathname)) {
        console.log("Redirecting to my-lots - user accessing admin route");
        router.push("/my-lots");
        return;
      }
    }
  }, [isInitialized, isAuthenticated, user, router, pathname, requireAdmin]);

  // Se ainda não foi inicializado, mostrar o conteúdo apenas para a página de login
  if (!isInitialized) {
    if (pathname === "/login") {
      return <>{children}</>;
    }
    return null;
  }

  // Se não está autenticado e está na página de login, mostrar o conteúdo
  if (!isAuthenticated && pathname === "/login") {
    return <>{children}</>;
  }

  // Se não está autenticado e não está na página de login, mostrar nada (será redirecionado)
  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}