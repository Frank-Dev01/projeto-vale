"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Building2, Key, Eye, EyeOff, Mail, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";

export default function LoginPage() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Call the authentication API
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          identifier,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Erro ao fazer login");
        return;
      }

      // Login successful
      console.log("Login successful, user data:", data.user);
      login(data.user);
      console.log("Login function called");

      // Adicionar um atraso maior para garantir que o estado seja atualizado
      setTimeout(() => {
        console.log("Checking localStorage before redirect...");
        if (typeof window !== 'undefined') {
          const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
          const userData = localStorage.getItem("user");
          console.log("localStorage check - isLoggedIn:", isLoggedIn, "userData:", userData);
        }
        
        console.log("Redirecting based on user role:", data.user.role);
        // Redirect based on user role - using window.location for force redirect
        if (data.user.role === "admin") {
          console.log("Redirecting admin to /");
          window.location.href = "/";
        } else {
          console.log("Redirecting user to /my-lots");
          window.location.href = "/my-lots";
        }
      }, 500); // Aumentado para 500ms

    } catch (err) {
      setError("Erro ao fazer login. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="w-full max-w-md px-4">
        {/* Logo e Título */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="flex items-center gap-2">
              <Building2 className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900 dark:text-white">Vale Empreendimentos</span>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Sistema de Gestão de Lotes
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Faça login para acessar o sistema
          </p>
        </div>

        {/* Card de Login */}
        <Card className="w-full">
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Login</CardTitle>
            <CardDescription>
              Entre com suas credenciais para acessar o sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              {error && (
                <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md dark:bg-red-900/20 dark:border-red-800">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="identifier">CRECI ou Email</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="identifier"
                    type="text"
                    placeholder="Digite seu CRECI ou email"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    required
                    className="h-11 pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Digite sua senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="h-11 pr-12"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-11 px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-500" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-500" />
                    )}
                  </Button>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full h-11" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Entrando...
                  </div>
                ) : (
                  "Entrar"
                )}
              </Button>
            </form>

            <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Credenciais de demonstração:
                </p>
                <div className="space-y-2">
                  <div className="flex justify-center gap-2">
                    <Badge variant="secondary">Admin: 12345</Badge>
                    <Badge variant="secondary">Senha: 123456</Badge>
                  </div>
                  <div className="flex justify-center gap-2">
                    <Badge variant="secondary">User: joao.silva@email.com</Badge>
                    <Badge variant="secondary">Senha: 123456</Badge>
                  </div>
                  <div className="flex justify-center gap-2">
                    <Badge variant="secondary">User: maria.santos@email.com</Badge>
                    <Badge variant="secondary">Senha: 123456</Badge>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Rodapé */}
        <div className="text-center mt-6 text-sm text-gray-500 dark:text-gray-400">
          <p>© 2024 Vale Empreendimentos. Todos os direitos reservados.</p>
        </div>
      </div>
    </div>
  );
}