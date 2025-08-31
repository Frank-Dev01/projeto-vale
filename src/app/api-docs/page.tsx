"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "@/components/sidebar";
import { Header } from "@/components/header";
import { AuthGuard } from "@/components/auth-guard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { 
  BookOpen, 
  Shield, 
  Code, 
  CheckCircle, 
  AlertCircle, 
  Info,
  Copy,
  ExternalLink,
  Github,
  FileText,
  Key,
  Server,
  Database,
  Users,
  Building2,
  TrendingUp,
  BarChart3
} from "lucide-react";

const swaggerSpec = {
  openapi: "3.0.3",
  info: {
    title: "Projeto Vale - Sistema de Gestão Imobiliária",
    description: "API completa para o sistema de gestão de lotes imobiliários Projeto Vale",
    version: "1.0.0",
    contact: {
      name: "Projeto Vale",
      email: "contato@projeto-vale.com.br",
      url: "https://projeto-vale.com.br"
    },
    license: {
      name: "MIT",
      url: "https://opensource.org/licenses/MIT"
    }
  },
  servers: [
    {
      url: "http://localhost:3000/api",
      description: "Servidor de desenvolvimento"
    },
    {
      url: "https://api.projeto-vale.com.br",
      description: "Servidor de produção"
    }
  ],
  security: [
    {
      "BearerAuth": []
    }
  ],
  components: {
    securitySchemes: {
      "BearerAuth": {
        "type": "http",
        "scheme": "bearer",
        "bearerFormat": "JWT",
        "description": "Token JWT obtido através do endpoint /auth/login"
      }
    }
  },
  paths: {
    "/auth/login": {
      post: {
        tags: ["Autenticação"],
        summary: "Autenticar usuário",
        description: "Realiza a autenticação de um usuário no sistema",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  identifier: {
                    type: "string",
                    description: "CRECI ou email"
                  },
                  password: {
                    type: "string",
                    format: "password"
                  }
                },
                required: ["identifier", "password"]
              }
            }
          }
        },
        responses: {
          "200": {
            description: "Login realizado com sucesso"
          },
          "401": {
            description: "Credenciais inválidas"
          }
        }
      }
    },
    "/health": {
      get: {
        tags: ["Sistema"],
        summary: "Verificar saúde da API",
        description: "Endpoint para verificar se a API está funcionando",
        responses: {
          "200": {
            description: "API funcionando"
          }
        }
      }
    },
    "/lots": {
      get: {
        tags: ["Lotes"],
        summary: "Listar lotes",
        description: "Retorna uma lista de lotes com filtros",
        parameters: [
          {
            name: "status",
            in: "query",
            schema: {
              type: "string",
              enum: ["DISPONÍVEL", "RESERVADO", "EM PROPOSTA", "VENDIDO"]
            }
          }
        ],
        responses: {
          "200": {
            description: "Lista de lotes"
          }
        }
      },
      post: {
        tags: ["Lotes"],
        summary: "Criar novo lote",
        description: "Cria um novo lote no sistema",
        security: [{ "BearerAuth": [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  empreendimento: { type: "string" },
                  quadra: { type: "string" },
                  lote: { type: "string" },
                  area: { type: "number" },
                  valor: { type: "number" },
                  entrada: { type: "number" },
                  status: { 
                    type: "string",
                    enum: ["DISPONÍVEL", "RESERVADO", "EM PROPOSTA", "VENDIDO"]
                  }
                },
                required: ["empreendimento", "quadra", "lote", "area", "valor", "entrada", "status"]
              }
            }
          }
        },
        responses: {
          "201": {
            description: "Lote criado com sucesso"
          }
        }
      }
    }
  },
  tags: [
    {
      name: "Autenticação",
      description: "Endpoints para autenticação"
    },
    {
      name: "Lotes",
      description: "Gerenciamento de lotes"
    },
    {
      name: "Sistema",
      description: "Endpoints do sistema"
    }
  ]
};

export default function ApiDocsPage() {
  const [copiedEndpoint, setCopiedEndpoint] = useState<string | null>(null);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedEndpoint(text);
      setTimeout(() => setCopiedEndpoint(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const endpoints = [
    {
      method: "POST",
      path: "/auth/login",
      description: "Autenticar usuário no sistema",
      security: false,
      example: {
        request: {
          identifier: "12345",
          password: "123456"
        },
        response: {
          user: {
            id: "admin-1",
            identifier: "12345",
            role: "ADMIN",
            name: "Administrador"
          },
          message: "Login realizado com sucesso"
        }
      }
    },
    {
      method: "GET",
      path: "/health",
      description: "Verificar saúde da API",
      security: false,
      example: {
        response: {
          message: "Good!",
          timestamp: "2024-01-01T00:00:00.000Z"
        }
      }
    },
    {
      method: "GET",
      path: "/lots",
      description: "Listar lotes com filtros",
      security: true,
      example: {
        request: "?status=DISPONÍVEL&empreendimento=1",
        response: {
          data: [
            {
              empreendimento: "1",
              quadra: "A",
              lote: "01",
              area: 450,
              valor: 850000,
              status: "DISPONÍVEL"
            }
          ],
          metadata: {
            total: 1,
            filters: {
              status: "DISPONÍVEL",
              empreendimento: "1",
              quadra: "TODOS",
              lote: "TODOS"
            },
            timestamp: "2024-01-01T00:00:00.000Z"
          }
        }
      }
    },
    {
      method: "POST",
      path: "/lots",
      description: "Criar novo lote",
      security: true,
      example: {
        request: {
          empreendimento: "1",
          quadra: "A",
          lote: "10",
          area: 380,
          valor: 950000,
          entrada: 95000,
          status: "DISPONÍVEL"
        },
        response: {
          data: {
            id: "lot-new-id",
            empreendimento: "1",
            quadra: "A",
            lote: "10",
            area: 380,
            valor: 950000,
            entrada: 95000,
            status: "DISPONÍVEL",
            createdAt: "2024-01-01T00:00:00.000Z",
            updatedAt: "2024-01-01T00:00:00.000Z"
          },
          message: "Lote criado com sucesso"
        }
      }
    },
    {
      method: "PUT",
      path: "/lots",
      description: "Atualizar lote existente",
      security: true,
      example: {
        request: {
          id: "lot-existing-id",
          status: "RESERVADO",
          reservedBy: "user-1"
        },
        response: {
          data: {
            id: "lot-existing-id",
            status: "RESERVADO",
            reservedAt: "2024-01-01T00:00:00.000Z",
            reservedBy: "user-1"
          },
          message: "Lote atualizado com sucesso"
        }
      }
    },
    {
      method: "DELETE",
      path: "/lots",
      description: "Excluir lote",
      security: true,
      example: {
        request: "?id=lot-to-delete",
        response: {
          message: "Lote excluído com sucesso"
        }
      }
    }
  ];

  const securityFeatures = [
    {
      title: "Autenticação JWT",
      description: "Utilização de tokens JWT para autenticação segura",
      icon: Key,
      status: "implementado"
    },
    {
      title: "Autorização por Role",
      description: "Controle de acesso baseado em papéis (ADMIN/USER)",
      icon: Shield,
      status: "implementado"
    },
    {
      title: "HTTPS Only",
      description: "Comunicação segura via HTTPS em produção",
      icon: Shield,
      status: "recomendado"
    },
    {
      title: "Rate Limiting",
      description: "Limitação de requisições para prevenir abusos",
      icon: Server,
      status: "planejado"
    },
    {
      title: "Input Validation",
      description: "Validação rigorosa de todos os dados de entrada",
      icon: CheckCircle,
      status: "implementado"
    },
    {
      title: "SQL Injection Protection",
      description: "Proteção contra injeção de SQL via Prisma ORM",
      icon: Database,
      status: "implementado"
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "implementado":
        return <Badge className="bg-green-100 text-green-800 border-green-200">Implementado</Badge>;
      case "recomendado":
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Recomendado</Badge>;
      case "planejado":
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Planejado</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <AuthGuard requireAdmin={true}>
      <div className="flex h-screen bg-background">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto p-6">
            <div className="space-y-6">
              {/* Header */}
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-4">
                  <BookOpen className="h-8 w-8 text-primary" />
                  <div>
                    <h1 className="text-3xl font-bold tracking-tight">Documentação da API</h1>
                    <p className="text-muted-foreground">
                      Documentação completa da API do Projeto Vale com padrões de segurança
                    </p>
                  </div>
                </div>
              </div>

              {/* API Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Info className="h-5 w-5" />
                    Visão Geral da API
                  </CardTitle>
                  <CardDescription>
                    Informações básicas sobre a API do Projeto Vale
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Server className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">Versão</span>
                      </div>
                      <p className="text-2xl font-bold">1.0.0</p>
                      <p className="text-xs text-muted-foreground">Estável</p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Code className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">Formato</span>
                      </div>
                      <p className="text-2xl font-bold">REST</p>
                      <p className="text-xs text-muted-foreground">JSON</p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">Segurança</span>
                      </div>
                      <p className="text-2xl font-bold">JWT</p>
                      <p className="text-xs text-muted-foreground">Bearer Token</p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Database className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">Banco</span>
                      </div>
                      <p className="text-2xl font-bold">SQLite</p>
                      <p className="text-xs text-muted-foreground">Prisma ORM</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Security Standards */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Padrões de Segurança
                  </CardTitle>
                  <CardDescription>
                    Medidas de segurança implementadas na API
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2">
                    {securityFeatures.map((feature, index) => (
                      <div key={index} className="flex items-start gap-3 p-4 border rounded-lg">
                        <feature.icon className="h-5 w-5 text-primary mt-0.5" />
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium">{feature.title}</h4>
                            {getStatusBadge(feature.status)}
                          </div>
                          <p className="text-sm text-muted-foreground">{feature.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* API Endpoints */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Code className="h-5 w-5" />
                    Endpoints da API
                  </CardTitle>
                  <CardDescription>
                    Lista completa dos endpoints disponíveis na API
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="all" className="w-full">
                    <TabsList className="grid w-full grid-cols-6">
                      <TabsTrigger value="all">Todos</TabsTrigger>
                      <TabsTrigger value="auth">Autenticação</TabsTrigger>
                      <TabsTrigger value="lots">Lotes</TabsTrigger>
                      <TabsTrigger value="clients">Clientes</TabsTrigger>
                      <TabsTrigger value="transactions">Transações</TabsTrigger>
                      <TabsTrigger value="reports">Relatórios</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="all" className="space-y-4">
                      {endpoints.map((endpoint, index) => (
                        <Card key={index} className="border-l-4 border-l-primary">
                          <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <Badge 
                                  variant={endpoint.method === "GET" ? "secondary" : "default"}
                                  className={
                                    endpoint.method === "GET" 
                                      ? "bg-blue-100 text-blue-800" 
                                      : endpoint.method === "POST"
                                      ? "bg-green-100 text-green-800"
                                      : endpoint.method === "PUT"
                                      ? "bg-yellow-100 text-yellow-800"
                                      : "bg-red-100 text-red-800"
                                  }
                                >
                                  {endpoint.method}
                                </Badge>
                                <code className="text-sm font-mono bg-muted px-2 py-1 rounded">
                                  {endpoint.path}
                                </code>
                              </div>
                              <div className="flex items-center gap-2">
                                {endpoint.security && (
                                  <Badge variant="outline" className="text-xs">
                                    <Shield className="h-3 w-3 mr-1" />
                                    Protegido
                                  </Badge>
                                )}
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => copyToClipboard(`http://localhost:3000/api${endpoint.path}`)}
                                  className="h-8 w-8 p-0"
                                >
                                  <Copy className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm text-muted-foreground mb-3">
                              {endpoint.description}
                            </p>
                            <Accordion type="single" collapsible>
                              <AccordionItem value="example">
                                <AccordionTrigger className="text-sm">
                                  Ver exemplo
                                </AccordionTrigger>
                                <AccordionContent>
                                  <div className="space-y-3 text-sm">
                                    <div>
                                      <h5 className="font-medium mb-1">Request:</h5>
                                      <pre className="bg-muted p-3 rounded text-xs overflow-x-auto">
                                        {JSON.stringify(endpoint.example.request, null, 2)}
                                      </pre>
                                    </div>
                                    <div>
                                      <h5 className="font-medium mb-1">Response:</h5>
                                      <pre className="bg-muted p-3 rounded text-xs overflow-x-auto">
                                        {JSON.stringify(endpoint.example.response, null, 2)}
                                      </pre>
                                    </div>
                                  </div>
                                </AccordionContent>
                              </AccordionItem>
                            </Accordion>
                          </CardContent>
                        </Card>
                      ))}
                    </TabsContent>
                    
                    <TabsContent value="auth" className="space-y-4">
                      {endpoints.filter(e => e.path.includes("auth")).map((endpoint, index) => (
                        <Card key={index} className="border-l-4 border-l-primary">
                          <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <Badge className="bg-green-100 text-green-800">POST</Badge>
                                <code className="text-sm font-mono bg-muted px-2 py-1 rounded">
                                  {endpoint.path}
                                </code>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => copyToClipboard(`http://localhost:3000/api${endpoint.path}`)}
                                className="h-8 w-8 p-0"
                              >
                                <Copy className="h-4 w-4" />
                              </Button>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm text-muted-foreground mb-3">
                              {endpoint.description}
                            </p>
                          </CardContent>
                        </Card>
                      ))}
                    </TabsContent>
                    
                    <TabsContent value="lots" className="space-y-4">
                      {endpoints.filter(e => e.path.includes("lots")).map((endpoint, index) => (
                        <Card key={index} className="border-l-4 border-l-primary">
                          <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <Badge 
                                  variant={endpoint.method === "GET" ? "secondary" : "default"}
                                  className={
                                    endpoint.method === "GET" 
                                      ? "bg-blue-100 text-blue-800" 
                                      : endpoint.method === "POST"
                                      ? "bg-green-100 text-green-800"
                                      : endpoint.method === "PUT"
                                      ? "bg-yellow-100 text-yellow-800"
                                      : "bg-red-100 text-red-800"
                                  }
                                >
                                  {endpoint.method}
                                </Badge>
                                <code className="text-sm font-mono bg-muted px-2 py-1 rounded">
                                  {endpoint.path}
                                </code>
                              </div>
                              <div className="flex items-center gap-2">
                                {endpoint.security && (
                                  <Badge variant="outline" className="text-xs">
                                    <Shield className="h-3 w-3 mr-1" />
                                    Protegido
                                  </Badge>
                                )}
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => copyToClipboard(`http://localhost:3000/api${endpoint.path}`)}
                                  className="h-8 w-8 p-0"
                                >
                                  <Copy className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm text-muted-foreground mb-3">
                              {endpoint.description}
                            </p>
                          </CardContent>
                        </Card>
                      ))}
                    </TabsContent>
                    
                    <TabsContent value="clients" className="space-y-4">
                      <Card>
                        <CardContent className="pt-6">
                          <div className="text-center py-8">
                            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                            <h3 className="text-lg font-semibold mb-2">Endpoints de Clientes</h3>
                            <p className="text-muted-foreground">
                              Gerenciamento completo de clientes (CRUD)
                            </p>
                            <div className="mt-4 space-y-2 text-left max-w-md mx-auto">
                              <div className="flex items-center gap-2 text-sm">
                                <Badge className="bg-blue-100 text-blue-800">GET</Badge>
                                <code>/clients</code>
                                <span className="text-muted-foreground">- Listar clientes</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm">
                                <Badge className="bg-green-100 text-green-800">POST</Badge>
                                <code>/clients</code>
                                <span className="text-muted-foreground">- Criar cliente</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm">
                                <Badge className="bg-yellow-100 text-yellow-800">PUT</Badge>
                                <code>/clients/{"{id}"}</code>
                                <span className="text-muted-foreground">- Atualizar cliente</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm">
                                <Badge className="bg-red-100 text-red-800">DELETE</Badge>
                                <code>/clients/{"{id}"}</code>
                                <span className="text-muted-foreground">- Excluir cliente</span>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                    
                    <TabsContent value="transactions" className="space-y-4">
                      <Card>
                        <CardContent className="pt-6">
                          <div className="text-center py-8">
                            <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                            <h3 className="text-lg font-semibold mb-2">Endpoints de Transações</h3>
                            <p className="text-muted-foreground">
                              Gerenciamento de transações financeiras
                            </p>
                            <div className="mt-4 space-y-2 text-left max-w-md mx-auto">
                              <div className="flex items-center gap-2 text-sm">
                                <Badge className="bg-blue-100 text-blue-800">GET</Badge>
                                <code>/transactions</code>
                                <span className="text-muted-foreground">- Listar transações</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm">
                                <Badge className="bg-green-100 text-green-800">POST</Badge>
                                <code>/transactions</code>
                                <span className="text-muted-foreground">- Criar transação</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm">
                                <Badge className="bg-blue-100 text-blue-800">GET</Badge>
                                <code>/transactions/{"{id}"}</code>
                                <span className="text-muted-foreground">- Obter transação</span>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                    
                    <TabsContent value="reports" className="space-y-4">
                      <Card>
                        <CardContent className="pt-6">
                          <div className="text-center py-8">
                            <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                            <h3 className="text-lg font-semibold mb-2">Endpoints de Relatórios</h3>
                            <p className="text-muted-foreground">
                              Relatórios e análises de dados
                            </p>
                            <div className="mt-4 space-y-2 text-left max-w-md mx-auto">
                              <div className="flex items-center gap-2 text-sm">
                                <Badge className="bg-blue-100 text-blue-800">GET</Badge>
                                <code>/reports/dashboard</code>
                                <span className="text-muted-foreground">- Dados do dashboard</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm">
                                <Badge className="bg-blue-100 text-blue-800">GET</Badge>
                                <code>/reports/financial</code>
                                <span className="text-muted-foreground">- Relatório financeiro</span>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>

              {/* How to Use */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    Como Usar a API
                  </CardTitle>
                  <CardDescription>
                    Guia rápido para começar a usar a API do Projeto Vale
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-medium mb-2">1. Autenticação</h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        Primeiro, obtenha um token de autenticação fazendo login:
                      </p>
                      <pre className="bg-muted p-3 rounded text-xs overflow-x-auto">
{`POST /api/auth/login
Content-Type: application/json

{
  "identifier": "12345",
  "password": "123456"
}`}
                      </pre>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">2. Usar o Token</h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        Inclua o token no cabeçalho Authorization em todas as requisições protegidas:
                      </p>
                      <pre className="bg-muted p-3 rounded text-xs overflow-x-auto">
{`GET /api/lots
Authorization: Bearer seu-token-aqui`}
                      </pre>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">3. Exemplo de Uso</h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        Exemplo completo usando JavaScript/ Fetch:
                      </p>
                      <pre className="bg-muted p-3 rounded text-xs overflow-x-auto">
{`// Login
const loginResponse = await fetch('/api/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    identifier: '12345',
    password: '123456'
  })
});

const { user } = await loginResponse.json();

// Listar lotes
const lotsResponse = await fetch('/api/lots?status=DISPONÍVEL', {
  headers: {
    'Authorization': \`Bearer \${token}\`
  }
});

const { data } = await lotsResponse.json();
console.log('Lotes disponíveis:', data);`}
                      </pre>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Download Swagger Spec */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Download da Especificação
                  </CardTitle>
                  <CardDescription>
                    Baixe a especificação completa da API em formato JSON
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button 
                      onClick={() => copyToClipboard(JSON.stringify(swaggerSpec, null, 2))}
                      className="flex items-center gap-2"
                    >
                      <Copy className="h-4 w-4" />
                      Copiar JSON
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => {
                        const blob = new Blob([JSON.stringify(swaggerSpec, null, 2)], { type: 'application/json' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = 'projeto-vale-api.json';
                        a.click();
                        URL.revokeObjectURL(url);
                      }}
                      className="flex items-center gap-2"
                    >
                      <FileText className="h-4 w-4" />
                      Download JSON
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => window.open('https://editor.swagger.io/', '_blank')}
                      className="flex items-center gap-2"
                    >
                      <ExternalLink className="h-4 w-4" />
                      Swagger Editor
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}