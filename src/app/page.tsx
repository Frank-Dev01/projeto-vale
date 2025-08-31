"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Sidebar } from "@/components/sidebar";
import { Header } from "@/components/header";
import { AuthGuard } from "@/components/auth-guard";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { ChartContainer, ChartTooltip, ChartLegend } from "@/components/ui/chart";

interface Empreendimento {
  id: string;
  nome: string;
  descricao: string;
  endereco: string;
  cidade: string;
  estado: string;
  areaTotal: string;
  createdAt: string;
  deletedAt?: string;
  deletedBy?: string;
}

interface Lote {
  id: string;
  empreendimentoId: string;
  quadra: string;
  lote: string;
  area: number;
  valor: number;
  status: string;
}

export default function Dashboard() {
  // Carregar empreendimentos do localStorage
  const [empreendimentos, setEmpreendimentos] = useState<Empreendimento[]>([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('empreendimentos');
      if (saved) {
        const parsed = JSON.parse(saved);
        setEmpreendimentos(parsed.filter((emp: any) => !emp.deletedAt));
      } else {
        // Dados padrão caso não exista no localStorage
        setEmpreendimentos([
          {
            id: "1",
            nome: "Residencial Vale Verde",
            descricao: "Empreendimento residencial de alto padrão",
            endereco: "Rua das Flores, 123",
            cidade: "São Paulo",
            estado: "SP",
            areaTotal: "50000",
            createdAt: "2024-01-10T10:00:00Z"
          },
          {
            id: "2",
            nome: "Condomínio Parque das Águas",
            descricao: "Condomínio fechado com área de lazer",
            endereco: "Avenida Principal, 456",
            cidade: "São Paulo",
            estado: "SP",
            areaTotal: "75000",
            createdAt: "2024-01-12T14:30:00Z"
          }
        ]);
      }
    }
  }, []);

  // Função para obter nome do empreendimento pelo ID
  const getNomeEmpreendimento = (empreendimentoId: string) => {
    const empreendimento = empreendimentos.find(emp => emp.id === empreendimentoId);
    return empreendimento ? empreendimento.nome : "Empreendimento não encontrado";
  };

  // Mock data for demonstration - matching the image
  const stats = [
    {
      title: "Total de Lotes",
      value: "45",
      description: "Total de lotes cadastrados"
    },
    {
      title: "Propostas",
      value: "23",
      description: "Propostas recebidas"
    },
    {
      title: "Vendas",
      value: "9",
      description: "Vendas realizadas"
    },
    {
      title: "Receita Prevista",
      value: "R$ 2.850.000,00",
      description: "Valor total previsto"
    }
  ];

  // Mock data for recent lots - matching the lots page structure
  const recentLots: Lote[] = [
    {
      id: "1",
      empreendimentoId: "1",
      quadra: "A",
      lote: "01",
      area: 450,
      valor: 850000,
      status: "DISPONÍVEL"
    },
    {
      id: "2",
      empreendimentoId: "1",
      quadra: "B",
      lote: "05",
      area: 320,
      valor: 1200000,
      status: "RESERVADO"
    },
    {
      id: "3",
      empreendimentoId: "2",
      quadra: "C",
      lote: "12",
      area: 280,
      valor: 950000,
      status: "EM PROPOSTA"
    },
    {
      id: "4",
      empreendimentoId: "1",
      quadra: "A",
      lote: "08",
      area: 380,
      valor: 1100000,
      status: "VENDIDO"
    },
    {
      id: "5",
      empreendimentoId: "2",
      quadra: "D",
      lote: "03",
      area: 420,
      valor: 1350000,
      status: "DISPONÍVEL"
    }
  ];

  // Data for pie chart - Distribuição de Lotes por Status
  const lotDistributionData = [
    { name: "Disponível", value: 25, color: "#22c55e" },
    { name: "Reservado", value: 8, color: "#f59e0b" },
    { name: "Em Proposta", value: 5, color: "#8b5cf6" },
    { name: "Vendido", value: 9, color: "#ef4444" }
  ];

  // Data for bar chart - Reservas por Mês
  const reservationsByMonth = [
    { month: "Janeiro", reservations: 28 },
    { month: "Fevereiro", reservations: 32 },
    { month: "Março", reservations: 35 },
    { month: "Abril", reservations: 29 },
    { month: "Maio", reservations: 31 },
    { month: "Junho", reservations: 27 },
    { month: "Julho", reservations: 26 },
    { month: "Agosto", reservations: 33 },
    { month: "Setembro", reservations: 30 },
    { month: "Outubro", reservations: 34 },
    { month: "Novembro", reservations: 28 },
    { month: "Dezembro", reservations: 25 }
  ];

  const chartConfig = {
    disponiveis: {
      label: "Disponível",
      color: "#22c55e",
    },
    reservados: {
      label: "Reservado",
      color: "#f59e0b",
    },
    emProposta: {
      label: "Em Proposta",
      color: "#8b5cf6",
    },
    vendidos: {
      label: "Vendido",
      color: "#ef4444",
    },
    reservas: {
      label: "Reservas",
      color: "#3b82f6",
    },
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "DISPONÍVEL":
        return <Badge className="bg-green-100 text-green-800 border-green-200">Disponível</Badge>;
      case "RESERVADO":
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Reservado</Badge>;
      case "EM PROPOSTA":
        return <Badge className="bg-purple-100 text-purple-800 border-purple-200">Em Proposta</Badge>;
      case "VENDIDO":
        return <Badge className="bg-red-100 text-red-800 border-red-200">Vendido</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatCurrency = (value: number) => {
    return `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
  };

  return (
    <AuthGuard requireAdmin={true}>
      <div className="flex h-screen bg-background">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {stats.map((stat) => (
                <Card key={stat.title}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <p className="text-xs text-muted-foreground">{stat.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Charts Row */}
            <div className="grid gap-6 md:grid-cols-2">
              {/* Pie Chart - Distribuição de Lotes por Status */}
              <Card>
                <CardHeader>
                  <CardTitle>Distribuição de Lotes por Status</CardTitle>
                  <CardDescription>Distribuição dos lotes por status no sistema</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig} className="h-[300px] w-full">
                    <PieChart>
                      <Pie
                        data={lotDistributionData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={0}
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                        labelLine={false}
                      >
                        {lotDistributionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <ChartTooltip
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload;
                            return (
                              <div className="bg-background border rounded-lg p-2 shadow-lg">
                                <p className="font-medium">{data.name}</p>
                                <p className="text-sm text-muted-foreground">
                                  {data.value} lotes ({((data.value / 47) * 100).toFixed(1)}%)
                                </p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <ChartLegend />
                    </PieChart>
                  </ChartContainer>
                </CardContent>
              </Card>

              {/* Bar Chart - Reservas por Mês */}
              <Card>
                <CardHeader>
                  <CardTitle>Reservas por Mês</CardTitle>
                  <CardDescription>Número de reservas efetuadas em cada mês</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig} className="h-[300px] w-full">
                    <BarChart data={reservationsByMonth}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="month" 
                        tick={{ fontSize: 12 }}
                        interval={0}
                        angle={-45}
                        textAnchor="end"
                        height={80}
                      />
                      <YAxis 
                        tick={{ fontSize: 12 }}
                        label={{ value: 'Reservas', angle: -90, position: 'insideLeft' }}
                        domain={[0, 50]}
                      />
                      <ChartTooltip
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload;
                            return (
                              <div className="bg-background border rounded-lg p-2 shadow-lg">
                                <p className="font-medium">{data.month}</p>
                                <p className="text-sm text-muted-foreground">
                                  {data.reservations} reservas
                                </p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Bar 
                        dataKey="reservations" 
                        fill="#3b82f6"
                        radius={[4, 4, 0, 0]}
                        label={{ position: 'top', fill: '#374151', fontSize: 12 }}
                      />
                    </BarChart>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>

            {/* Recent Lots Table */}
            <Card>
              <CardHeader>
                <CardTitle>Lotes Recentes</CardTitle>
                <CardDescription>Últimos lotes cadastrados no sistema</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Empreendimento</TableHead>
                      <TableHead>Quadra</TableHead>
                      <TableHead>Lt</TableHead>
                      <TableHead>Área (m²)</TableHead>
                      <TableHead>Valor (R$)</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentLots.map((lot, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{getNomeEmpreendimento(lot.empreendimentoId)}</TableCell>
                        <TableCell>{lot.quadra}</TableCell>
                        <TableCell>{lot.lote}</TableCell>
                        <TableCell>{lot.area.toLocaleString('pt-BR')}</TableCell>
                        <TableCell className="font-medium">{formatCurrency(lot.valor)}</TableCell>
                        <TableCell>{getStatusBadge(lot.status)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
    </AuthGuard>
  );
}