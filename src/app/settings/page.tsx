"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Settings, 
  Search, 
  Save, 
  RefreshCw, 
  Download, 
  Upload,
  Bell,
  Shield,
  Database,
  Building2,
  Grid3X3,
  Trash2,
  User,
  Calendar,
  Edit,
  Plus
} from "lucide-react";
import { Sidebar } from "@/components/sidebar";
import { Header } from "@/components/header";
import { AuthGuard } from "@/components/auth-guard";
import { useAuth } from "@/hooks/use-auth";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface SearchSettings {
  globalSearch: boolean;
  searchHistory: boolean;
  autoSuggestions: boolean;
  maxResults: number;
  searchFields: string[];
}

interface NotificationSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  transactionAlerts: boolean;
  portfolioAlerts: boolean;
  systemAlerts: boolean;
}

interface DisplaySettings {
  theme: string;
  language: string;
  dateFormat: string;
  currency: string;
  itemsPerPage: number;
}

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

interface Quadra {
  id: string;
  nome: string;
  empreendimento: string;
  empreendimentoNome: string;
  createdAt: string;
  deletedAt?: string;
  deletedBy?: string;
}

interface Usuario {
  id: string;
  nome: string;
  identificador: string;
  senha?: string;
  papel: "ADMIN" | "USER";
  status: "ATIVO" | "INATIVO";
  createdAt: string;
  deletedAt?: string;
  deletedBy?: string;
}

interface PaymentCondition {
  id: string;
  nome: string;
  entradaMinima: number;
  parcelasMaximas: number;
  jurosMes: number;
  status: "ATIVO" | "INATIVO";
  createdAt: string;
  deletedAt?: string;
  deletedBy?: string;
}

export default function SettingsPage() {
  const { creci, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("general");
  const [isSaving, setIsSaving] = useState(false);

  // Estados para edição de empreendimentos
  const [editingEmpreendimento, setEditingEmpreendimento] = useState<Empreendimento | null>(null);
  const [isEditEmpreendimentoDialogOpen, setIsEditEmpreendimentoDialogOpen] = useState(false);
  const [empreendimentoFormData, setEmpreendimentoFormData] = useState({
    nome: "",
    descricao: "",
    endereco: "",
    cidade: "",
    estado: "",
    areaTotal: ""
  });

  // Estados para edição de quadras
  const [editingQuadra, setEditingQuadra] = useState<Quadra | null>(null);
  const [isEditQuadraDialogOpen, setIsEditQuadraDialogOpen] = useState(false);
  const [quadraFormData, setQuadraFormData] = useState({
    nome: "",
    empreendimento: ""
  });

  // Estados para edição de usuários
  const [editingUsuario, setEditingUsuario] = useState<Usuario | null>(null);
  const [isEditUsuarioDialogOpen, setIsEditUsuarioDialogOpen] = useState(false);
  const [usuarioFormData, setUsuarioFormData] = useState({
    nome: "",
    identificador: "",
    senha: "",
    papel: "USER" as "ADMIN" | "USER",
    status: "ATIVO" as "ATIVO" | "INATIVO"
  });

  // Estados para edição de condições de pagamento
  const [editingPaymentCondition, setEditingPaymentCondition] = useState<PaymentCondition | null>(null);
  const [isEditPaymentConditionDialogOpen, setIsEditPaymentConditionDialogOpen] = useState(false);
  const [paymentConditionFormData, setPaymentConditionFormData] = useState({
    nome: "",
    entradaMinima: 10,
    parcelasMaximas: 12,
    jurosMes: 0,
    status: "ATIVO" as "ATIVO" | "INATIVO"
  });

  // Carregar dados do localStorage ou usar dados padrão
  const [empreendimentos, setEmpreendimentos] = useState<Empreendimento[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('empreendimentos');
      if (saved) {
        return JSON.parse(saved);
      }
    }
    return [
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
    ];
  });

  const [quadras, setQuadras] = useState<Quadra[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('quadras');
      if (saved) {
        return JSON.parse(saved);
      }
    }
    return [
      {
        id: "1",
        nome: "A",
        empreendimento: "1",
        empreendimentoNome: "Residencial Vale Verde",
        createdAt: "2024-01-10T10:00:00Z"
      },
      {
        id: "2",
        nome: "B",
        empreendimento: "1",
        empreendimentoNome: "Residencial Vale Verde",
        createdAt: "2024-01-10T10:00:00Z"
      },
      {
        id: "3",
        nome: "C",
        empreendimento: "1",
        empreendimentoNome: "Residencial Vale Verde",
        createdAt: "2024-01-10T10:00:00Z"
      },
      {
        id: "4",
        nome: "D",
        empreendimento: "1",
        empreendimentoNome: "Residencial Vale Verde",
        createdAt: "2024-01-10T10:00:00Z"
      }
    ];
  });

  const [usuarios, setUsuarios] = useState<Usuario[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('usuarios');
      if (saved) {
        return JSON.parse(saved);
      }
    }
    return [
      {
        id: "1",
        nome: "Administrador",
        identificador: "CRECI-12345",
        papel: "ADMIN",
        status: "ATIVO",
        createdAt: "2024-01-10T10:00:00Z"
      },
      {
        id: "2",
        nome: "João Silva",
        identificador: "joao.silva@email.com",
        papel: "USER",
        status: "ATIVO",
        createdAt: "2024-01-15T14:30:00Z"
      },
      {
        id: "3",
        nome: "Maria Santos",
        identificador: "maria.santos@email.com",
        papel: "USER",
        status: "INATIVO",
        createdAt: "2024-01-20T09:15:00Z"
      }
    ];
  });

  const [paymentConditions, setPaymentConditions] = useState<PaymentCondition[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('paymentConditions');
      if (saved) {
        return JSON.parse(saved);
      }
    }
    return [
      {
        id: "1",
        nome: "À Vista",
        entradaMinima: 100,
        parcelasMaximas: 1,
        jurosMes: 0,
        status: "ATIVO",
        createdAt: "2024-01-10T10:00:00Z"
      },
      {
        id: "2",
        nome: "Parcelado Simples",
        entradaMinima: 20,
        parcelasMaximas: 12,
        jurosMes: 2,
        status: "ATIVO",
        createdAt: "2024-01-10T10:00:00Z"
      },
      {
        id: "3",
        nome: "Parcelado Estendido",
        entradaMinima: 10,
        parcelasMaximas: 24,
        jurosMes: 1.5,
        status: "ATIVO",
        createdAt: "2024-01-10T10:00:00Z"
      },
      {
        id: "4",
        nome: "Financiamento Próprio",
        entradaMinima: 5,
        parcelasMaximas: 36,
        jurosMes: 1,
        status: "INATIVO",
        createdAt: "2024-01-10T10:00:00Z"
      }
    ];
  });

  const [searchSettings, setSearchSettings] = useState<SearchSettings>({
    globalSearch: true,
    searchHistory: true,
    autoSuggestions: true,
    maxResults: 50,
    searchFields: ["symbol", "name", "client", "document"]
  });

  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    emailNotifications: true,
    pushNotifications: true,
    transactionAlerts: true,
    portfolioAlerts: true,
    systemAlerts: false
  });

  const [displaySettings, setDisplaySettings] = useState<DisplaySettings>({
    theme: "light",
    language: "pt-BR",
    dateFormat: "dd/MM/yyyy",
    currency: "BRL",
    itemsPerPage: 20
  });

  // Estado para configurações do sistema
  const [systemSettings, setSystemSettings] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('systemSettings');
      if (saved) {
        return JSON.parse(saved);
      }
    }
    return {
      company: "Vale Empreendimentos",
      description: "Sistema completo para gestão de lotes, clientes e transações em Vale Empreendimentos",
      externalReserveLink: "https://wa.me/5511999999999?text=Olá! Gostaria de reservar um lote."
    };
  });

  const handleSaveSettings = async () => {
    setIsSaving(true);
    // Salvar configurações do sistema no localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('systemSettings', JSON.stringify(systemSettings));
    }
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
  };

  const handleExportSettings = () => {
    const settings = {
      search: searchSettings,
      notifications: notificationSettings,
      display: displaySettings,
      exportedAt: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(settings, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'configuracoes-sistema.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleResetSettings = () => {
    setSearchSettings({
      globalSearch: true,
      searchHistory: true,
      autoSuggestions: true,
      maxResults: 50,
      searchFields: ["symbol", "name", "client", "document"]
    });
    setNotificationSettings({
      emailNotifications: true,
      pushNotifications: true,
      transactionAlerts: true,
      portfolioAlerts: true,
      systemAlerts: false
    });
    setDisplaySettings({
      theme: "light",
      language: "pt-BR",
      dateFormat: "dd/MM/yyyy",
      currency: "BRL",
      itemsPerPage: 20
    });
  };

  const handleDeleteEmpreendimento = (id: string) => {
    setEmpreendimentos(prev => {
      const updated = prev.map(emp => 
        emp.id === id 
          ? { ...emp, deletedAt: new Date().toISOString(), deletedBy: creci || "Desconhecido" }
          : emp
      );
      localStorage.setItem('empreendimentos', JSON.stringify(updated));
      return updated;
    });
  };

  const handleDeleteQuadra = (id: string) => {
    setQuadras(prev => {
      const updated = prev.map(quadra => 
        quadra.id === id 
          ? { ...quadra, deletedAt: new Date().toISOString(), deletedBy: creci || "Desconhecido" }
          : quadra
      );
      localStorage.setItem('quadras', JSON.stringify(updated));
      return updated;
    });
  };

  // Funções para edição de empreendimentos
  const handleEditEmpreendimento = (empreendimento: Empreendimento) => {
    setEditingEmpreendimento(empreendimento);
    setEmpreendimentoFormData({
      nome: empreendimento.nome,
      descricao: empreendimento.descricao,
      endereco: empreendimento.endereco,
      cidade: empreendimento.cidade,
      estado: empreendimento.estado,
      areaTotal: empreendimento.areaTotal
    });
    setIsEditEmpreendimentoDialogOpen(true);
  };

  const handleSaveEmpreendimento = () => {
    if (editingEmpreendimento) {
      setEmpreendimentos(prev => {
        const updated = prev.map(emp => 
          emp.id === editingEmpreendimento.id 
            ? { 
                ...emp, 
                nome: empreendimentoFormData.nome,
                descricao: empreendimentoFormData.descricao,
                endereco: empreendimentoFormData.endereco,
                cidade: empreendimentoFormData.cidade,
                estado: empreendimentoFormData.estado,
                areaTotal: empreendimentoFormData.areaTotal
              }
            : emp
        );
        localStorage.setItem('empreendimentos', JSON.stringify(updated));
        return updated;
      });
      
      setIsEditEmpreendimentoDialogOpen(false);
      setEditingEmpreendimento(null);
    }
  };

  // Funções para edição de quadras
  const handleEditQuadra = (quadra: Quadra) => {
    setEditingQuadra(quadra);
    setQuadraFormData({
      nome: quadra.nome,
      empreendimento: quadra.empreendimento
    });
    setIsEditQuadraDialogOpen(true);
  };

  const handleSaveQuadra = () => {
    if (editingQuadra) {
      setQuadras(prev => {
        const updated = prev.map(q => 
          q.id === editingQuadra.id 
            ? { 
                ...q, 
                nome: quadraFormData.nome,
                empreendimento: quadraFormData.empreendimento,
                empreendimentoNome: empreendimentos.find(e => e.id === quadraFormData.empreendimento)?.nome || q.empreendimentoNome
              }
            : q
        );
        localStorage.setItem('quadras', JSON.stringify(updated));
        return updated;
      });
      setIsEditQuadraDialogOpen(false);
      setEditingQuadra(null);
    }
  };

  // Funções para edição de usuários
  const handleEditUsuario = (usuario: Usuario) => {
    setEditingUsuario(usuario);
    setUsuarioFormData({
      nome: usuario.nome,
      identificador: usuario.identificador,
      senha: usuario.senha || "",
      papel: usuario.papel,
      status: usuario.status
    });
    setIsEditUsuarioDialogOpen(true);
  };

  const handleCreateUsuario = () => {
    setEditingUsuario(null);
    setUsuarioFormData({
      nome: "",
      identificador: "",
      senha: "",
      papel: "USER",
      status: "ATIVO"
    });
    setIsEditUsuarioDialogOpen(true);
  };

  const handleSaveUsuario = () => {
    if (editingUsuario) {
      // Editar usuário existente
      setUsuarios(prev => {
        const updated = prev.map(u => 
          u.id === editingUsuario.id 
            ? { 
                ...u, 
                nome: usuarioFormData.nome,
                identificador: usuarioFormData.identificador,
                senha: usuarioFormData.senha || undefined,
                papel: usuarioFormData.papel,
                status: usuarioFormData.status
              }
            : u
        );
        localStorage.setItem('usuarios', JSON.stringify(updated));
        return updated;
      });
    } else {
      // Criar novo usuário
      const novoUsuario: Usuario = {
        id: Date.now().toString(), // Gerar ID simples
        nome: usuarioFormData.nome,
        identificador: usuarioFormData.identificador,
        senha: usuarioFormData.senha || undefined,
        papel: usuarioFormData.papel,
        status: usuarioFormData.status,
        createdAt: new Date().toISOString()
      };
      setUsuarios(prev => {
        const updated = [...prev, novoUsuario];
        localStorage.setItem('usuarios', JSON.stringify(updated));
        return updated;
      });
    }
    
    setIsEditUsuarioDialogOpen(false);
    setEditingUsuario(null);
  };

  const handleDeleteUsuario = (id: string) => {
    setUsuarios(prev => {
      const updated = prev.map(usuario => 
        usuario.id === id 
          ? { ...usuario, deletedAt: new Date().toISOString(), deletedBy: creci || "Desconhecido" }
          : usuario
      );
      localStorage.setItem('usuarios', JSON.stringify(updated));
      return updated;
    });
  };

  // Funções para edição de condições de pagamento
  const handleEditPaymentCondition = (condition: PaymentCondition) => {
    setEditingPaymentCondition(condition);
    setPaymentConditionFormData({
      nome: condition.nome,
      entradaMinima: condition.entradaMinima,
      parcelasMaximas: condition.parcelasMaximas,
      jurosMes: condition.jurosMes,
      status: condition.status
    });
    setIsEditPaymentConditionDialogOpen(true);
  };

  const handleCreatePaymentCondition = () => {
    setEditingPaymentCondition(null);
    setPaymentConditionFormData({
      nome: "",
      entradaMinima: 10,
      parcelasMaximas: 12,
      jurosMes: 0,
      status: "ATIVO"
    });
    setIsEditPaymentConditionDialogOpen(true);
  };

  const handleSavePaymentCondition = () => {
    if (editingPaymentCondition) {
      // Editar condição existente
      setPaymentConditions(prev => {
        const updated = prev.map(condition => 
          condition.id === editingPaymentCondition.id 
            ? { 
                ...condition, 
                nome: paymentConditionFormData.nome,
                entradaMinima: paymentConditionFormData.entradaMinima,
                parcelasMaximas: paymentConditionFormData.parcelasMaximas,
                jurosMes: paymentConditionFormData.jurosMes,
                status: paymentConditionFormData.status
              }
            : condition
        );
        localStorage.setItem('paymentConditions', JSON.stringify(updated));
        return updated;
      });
    } else {
      // Criar nova condição
      const novaPaymentCondition: PaymentCondition = {
        id: Date.now().toString(), // Gerar ID simples
        nome: paymentConditionFormData.nome,
        entradaMinima: paymentConditionFormData.entradaMinima,
        parcelasMaximas: paymentConditionFormData.parcelasMaximas,
        jurosMes: paymentConditionFormData.jurosMes,
        status: paymentConditionFormData.status,
        createdAt: new Date().toISOString()
      };
      setPaymentConditions(prev => {
        const updated = [...prev, novaPaymentCondition];
        localStorage.setItem('paymentConditions', JSON.stringify(updated));
        return updated;
      });
    }
    
    setIsEditPaymentConditionDialogOpen(false);
    setEditingPaymentCondition(null);
  };

  const handleDeletePaymentCondition = (id: string) => {
    setPaymentConditions(prev => {
      const updated = prev.map(condition => 
        condition.id === id 
          ? { ...condition, deletedAt: new Date().toISOString(), deletedBy: creci || "Desconhecido" }
          : condition
      );
      localStorage.setItem('paymentConditions', JSON.stringify(updated));
      return updated;
    });
  };

  const activeEmpreendimentos = empreendimentos.filter(emp => !emp.deletedAt);
  const activeQuadras = quadras.filter(quadra => !quadra.deletedAt);
  const activeUsuarios = usuarios.filter(usuario => !usuario.deletedAt);
  const activePaymentConditions = paymentConditions.filter(condition => !condition.deletedAt);
  const deletedEmpreendimentos = empreendimentos.filter(emp => emp.deletedAt);
  const deletedQuadras = quadras.filter(quadra => quadra.deletedAt);

  const getRoleBadge = (papel: string) => {
    switch (papel) {
      case "ADMIN":
        return <Badge className="bg-red-100 text-red-800 border-red-200">Admin</Badge>;
      case "USER":
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Usuário</Badge>;
      default:
        return <Badge variant="outline">{papel}</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ATIVO":
        return <Badge className="bg-green-100 text-green-800 border-green-200">Ativo</Badge>;
      case "INATIVO":
        return <Badge className="bg-gray-100 text-gray-800 border-gray-200">Inativo</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return (
    <AuthGuard requireAdmin={true}>
      <div className="flex h-screen bg-background">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto p-6">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-3xl font-bold tracking-tight">Configurações</h1>
                  <p className="text-muted-foreground">
                    Gerencie as preferências do sistema
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={handleExportSettings}>
                    <Download className="mr-2 h-4 w-4" />
                    Exportar
                  </Button>
                  <Button variant="outline" onClick={handleResetSettings}>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Restaurar
                  </Button>
                  <Button onClick={handleSaveSettings} disabled={isSaving}>
                    {isSaving ? (
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="mr-2 h-4 w-4" />
                    )}
                    Salvar
                  </Button>
                </div>
              </div>

              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList>
                  <TabsTrigger value="general">Geral</TabsTrigger>
                  <TabsTrigger value="permissions">Pessoas & Permissões</TabsTrigger>
                  <TabsTrigger value="payment">Condições de Pagamento</TabsTrigger>
                  <TabsTrigger value="search">Busca</TabsTrigger>
                  <TabsTrigger value="notifications">Notificações</TabsTrigger>
                </TabsList>

                <TabsContent value="general">
                  <div className="grid gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Informações do Sistema</CardTitle>
                        <CardDescription>
                          Configurações básicas do sistema
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-1">
                          <div className="space-y-2">
                            <Label htmlFor="company">Nome da Empresa</Label>
                            <Input 
                              id="company" 
                              value={systemSettings.company}
                              onChange={(e) => setSystemSettings(prev => ({ ...prev, company: e.target.value }))}
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="description">Descrição</Label>
                          <Textarea 
                            id="description" 
                            placeholder="Descrição da empresa..."
                            value={systemSettings.description}
                            onChange={(e) => setSystemSettings(prev => ({ ...prev, description: e.target.value }))}
                            rows={3}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="externalReserveLink">Link Externo para Reserva</Label>
                          <Input 
                            id="externalReserveLink" 
                            placeholder="https://wa.me/5511999999999?text=Olá! Gostaria de reservar um lote."
                            value={systemSettings.externalReserveLink}
                            onChange={(e) => setSystemSettings(prev => ({ ...prev, externalReserveLink: e.target.value }))}
                          />
                          <p className="text-sm text-muted-foreground">
                            Link utilizado para redirecionar usuários quando clicam em "Reservar"
                          </p>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Empreendimentos</CardTitle>
                        <CardDescription>
                          Gerencie os empreendimentos cadastrados no sistema
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Empreendimento</TableHead>
                              <TableHead>Cidade</TableHead>
                              <TableHead>Estado</TableHead>
                              <TableHead>Área Total</TableHead>
                              <TableHead>Ações</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {activeEmpreendimentos.map((empreendimento) => (
                              <TableRow key={empreendimento.id}>
                                <TableCell className="font-medium">{empreendimento.nome}</TableCell>
                                <TableCell>{empreendimento.cidade}</TableCell>
                                <TableCell>{empreendimento.estado}</TableCell>
                                <TableCell>{empreendimento.areaTotal} m²</TableCell>
                                <TableCell>
                                  <div className="flex gap-2">
                                    <Button variant="outline" size="sm" onClick={() => handleEditEmpreendimento(empreendimento)}>
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                    <AlertDialog>
                                      <AlertDialogTrigger asChild>
                                        <Button variant="outline" size="sm">
                                          <Trash2 className="h-4 w-4" />
                                        </Button>
                                      </AlertDialogTrigger>
                                      <AlertDialogContent>
                                        <AlertDialogHeader>
                                          <AlertDialogTitle>Excluir Empreendimento</AlertDialogTitle>
                                          <AlertDialogDescription>
                                            Tem certeza que deseja excluir o empreendimento "{empreendimento.nome}"? Esta ação pode ser desfeita.
                                          </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                          <AlertDialogAction onClick={() => handleDeleteEmpreendimento(empreendimento.id)}>
                                            Excluir
                                          </AlertDialogAction>
                                        </AlertDialogFooter>
                                      </AlertDialogContent>
                                    </AlertDialog>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Quadras</CardTitle>
                        <CardDescription>
                          Gerencie as quadras cadastradas no sistema
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Empreendimento</TableHead>
                              <TableHead>Quadra</TableHead>
                              <TableHead>Ações</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {activeQuadras.map((quadra) => {
                              const empreendimento = empreendimentos.find(emp => emp.id === quadra.empreendimento);
                              const nomeEmpreendimento = empreendimento ? empreendimento.nome : quadra.empreendimentoNome;
                              
                              return (
                                <TableRow key={quadra.id}>
                                  <TableCell>{nomeEmpreendimento}</TableCell>
                                  <TableCell className="font-medium">{quadra.nome}</TableCell>
                                  <TableCell>
                                    <div className="flex gap-2">
                                      <Button variant="outline" size="sm" onClick={() => handleEditQuadra(quadra)}>
                                        <Edit className="h-4 w-4" />
                                      </Button>
                                      <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                          <Button variant="outline" size="sm">
                                            <Trash2 className="h-4 w-4" />
                                          </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                          <AlertDialogHeader>
                                            <AlertDialogTitle>Excluir Quadra</AlertDialogTitle>
                                            <AlertDialogDescription>
                                              Tem certeza que deseja excluir a quadra "{quadra.nome}"? Esta ação pode ser desfeita.
                                            </AlertDialogDescription>
                                          </AlertDialogHeader>
                                          <AlertDialogFooter>
                                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                            <AlertDialogAction onClick={() => handleDeleteQuadra(quadra.id)}>
                                              Excluir
                                            </AlertDialogAction>
                                          </AlertDialogFooter>
                                        </AlertDialogContent>
                                      </AlertDialog>
                                    </div>
                                  </TableCell>
                                </TableRow>
                              );
                            })}
                          </TableBody>
                        </Table>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="permissions">
                  <div className="grid gap-6">
                    <Card>
                      <CardHeader>
                        <div className="flex justify-between items-center">
                          <div>
                            <CardTitle>Gerenciar Usuários</CardTitle>
                            <CardDescription>
                              Adicione, edite ou remova usuários do sistema
                            </CardDescription>
                          </div>
                          <Button onClick={handleCreateUsuario}>
                            <User className="mr-2 h-4 w-4" />
                            Criar Usuário
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Nome</TableHead>
                                <TableHead>Identificador</TableHead>
                                <TableHead>Função</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Criado em</TableHead>
                                <TableHead>Ações</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {activeUsuarios.map((usuario) => (
                                <TableRow key={usuario.id}>
                                  <TableCell className="font-medium">{usuario.nome}</TableCell>
                                  <TableCell>{usuario.identificador}</TableCell>
                                  <TableCell>{getRoleBadge(usuario.papel)}</TableCell>
                                  <TableCell>{getStatusBadge(usuario.status)}</TableCell>
                                  <TableCell>{formatDate(usuario.createdAt)}</TableCell>
                                  <TableCell>
                                    <div className="flex gap-2">
                                      <Button variant="outline" size="sm" onClick={() => handleEditUsuario(usuario)}>
                                        <Edit className="h-4 w-4" />
                                      </Button>
                                      <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                          <Button variant="outline" size="sm">
                                            <Trash2 className="h-4 w-4" />
                                          </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                          <AlertDialogHeader>
                                            <AlertDialogTitle>Excluir Usuário</AlertDialogTitle>
                                            <AlertDialogDescription>
                                              Tem certeza que deseja excluir o usuário "{usuario.nome}"? Esta ação pode ser desfeita.
                                            </AlertDialogDescription>
                                          </AlertDialogHeader>
                                          <AlertDialogFooter>
                                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                            <AlertDialogAction onClick={() => handleDeleteUsuario(usuario.id)}>
                                              Excluir
                                            </AlertDialogAction>
                                          </AlertDialogFooter>
                                        </AlertDialogContent>
                                      </AlertDialog>
                                    </div>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Permissões e Níveis de Acesso</CardTitle>
                        <CardDescription>
                          Configure as permissões para cada tipo de usuário
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-6">
                          <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-4">
                              <div className="flex items-center justify-between">
                                <div>
                                  <h4 className="font-medium">Administrador</h4>
                                  <p className="text-sm text-muted-foreground">Acesso completo ao sistema</p>
                                </div>
                                <Badge className="bg-red-100 text-red-800 border-red-200">Admin</Badge>
                              </div>
                              <div className="space-y-2 text-sm">
                                <div className="flex items-center gap-2">
                                  <Shield className="h-4 w-4 text-green-600" />
                                  <span>Gerenciar todos os usuários</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Shield className="h-4 w-4 text-green-600" />
                                  <span>Editar configurações do sistema</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Shield className="h-4 w-4 text-green-600" />
                                  <span>Gerenciar lotes e transações</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Shield className="h-4 w-4 text-green-600" />
                                  <span>Acesso a todos os relatórios</span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="space-y-4">
                              <div className="flex items-center justify-between">
                                <div>
                                  <h4 className="font-medium">Usuário</h4>
                                  <p className="text-sm text-muted-foreground">Acesso limitado às funções básicas</p>
                                </div>
                                <Badge className="bg-blue-100 text-blue-800 border-blue-200">Usuário</Badge>
                              </div>
                              <div className="space-y-2 text-sm">
                                <div className="flex items-center gap-2">
                                  <Shield className="h-4 w-4 text-green-600" />
                                  <span>Visualizar lotes disponíveis</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Shield className="h-4 w-4 text-green-600" />
                                  <span>Criar propostas</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Shield className="h-4 w-4 text-gray-400" />
                                  <span>Gerenciar apenas seus lotes</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Shield className="h-4 w-4 text-gray-400" />
                                  <span>Relatórios básicos</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="payment">
                  <div className="grid gap-6">
                    <Card>
                      <CardHeader>
                        <div className="flex justify-between items-center">
                          <div>
                            <CardTitle>Condições de Pagamento</CardTitle>
                            <CardDescription>
                              Gerencie as condições de pagamento disponíveis no sistema
                            </CardDescription>
                          </div>
                          <Button onClick={handleCreatePaymentCondition}>
                            <Plus className="mr-2 h-4 w-4" />
                            Nova Condição
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Nome</TableHead>
                                <TableHead>Entrada Mínima</TableHead>
                                <TableHead>Parcelas Máximas</TableHead>
                                <TableHead>Juros Mês</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Ações</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {activePaymentConditions.map((condition) => (
                                <TableRow key={condition.id}>
                                  <TableCell className="font-medium">{condition.nome}</TableCell>
                                  <TableCell>{condition.entradaMinima}%</TableCell>
                                  <TableCell>{condition.parcelasMaximas}</TableCell>
                                  <TableCell>{condition.jurosMes}%</TableCell>
                                  <TableCell>{getStatusBadge(condition.status)}</TableCell>
                                  <TableCell>
                                    <div className="flex gap-2">
                                      <Button variant="outline" size="sm" onClick={() => handleEditPaymentCondition(condition)}>
                                        <Edit className="h-4 w-4" />
                                      </Button>
                                      <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                          <Button variant="outline" size="sm">
                                            <Trash2 className="h-4 w-4" />
                                          </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                          <AlertDialogHeader>
                                            <AlertDialogTitle>Excluir Condição de Pagamento</AlertDialogTitle>
                                            <AlertDialogDescription>
                                              Tem certeza que deseja excluir a condição "{condition.nome}"? Esta ação pode ser desfeita.
                                            </AlertDialogDescription>
                                          </AlertDialogHeader>
                                          <AlertDialogFooter>
                                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                            <AlertDialogAction onClick={() => handleDeletePaymentCondition(condition.id)}>
                                              Excluir
                                            </AlertDialogAction>
                                          </AlertDialogFooter>
                                        </AlertDialogContent>
                                      </AlertDialog>
                                    </div>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="search">
                  <Card>
                    <CardHeader>
                      <CardTitle>Configurações de Busca</CardTitle>
                      <CardDescription>
                        Personalize as opções de busca do sistema
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <Label>Busca Global</Label>
                              <p className="text-sm text-muted-foreground">Habilitar busca global em todo o sistema</p>
                            </div>
                            <Switch
                              checked={searchSettings.globalSearch}
                              onCheckedChange={(checked) => setSearchSettings(prev => ({ ...prev, globalSearch: checked }))}
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <Label>Histórico de Busca</Label>
                              <p className="text-sm text-muted-foreground">Salvar histórico de buscas realizadas</p>
                            </div>
                            <Switch
                              checked={searchSettings.searchHistory}
                              onCheckedChange={(checked) => setSearchSettings(prev => ({ ...prev, searchHistory: checked }))}
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <Label>Sugestões Automáticas</Label>
                              <p className="text-sm text-muted-foreground">Mostrar sugestões durante a digitação</p>
                            </div>
                            <Switch
                              checked={searchSettings.autoSuggestions}
                              onCheckedChange={(checked) => setSearchSettings(prev => ({ ...prev, autoSuggestions: checked }))}
                            />
                          </div>
                        </div>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label>Resultados Máximos</Label>
                            <Select 
                              value={searchSettings.maxResults.toString()} 
                              onValueChange={(value) => setSearchSettings(prev => ({ ...prev, maxResults: parseInt(value) }))}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="25">25</SelectItem>
                                <SelectItem value="50">50</SelectItem>
                                <SelectItem value="100">100</SelectItem>
                                <SelectItem value="200">200</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="notifications">
                  <Card>
                    <CardHeader>
                      <CardTitle>Configurações de Notificações</CardTitle>
                      <CardDescription>
                        Gerencie as preferências de notificação do sistema
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label>Notificações por Email</Label>
                            <p className="text-sm text-muted-foreground">Receber notificações por email</p>
                          </div>
                          <Switch
                            checked={notificationSettings.emailNotifications}
                            onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, emailNotifications: checked }))}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label>Notificações Push</Label>
                            <p className="text-sm text-muted-foreground">Receber notificações push no navegador</p>
                          </div>
                          <Switch
                            checked={notificationSettings.pushNotifications}
                            onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, pushNotifications: checked }))}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label>Alertas de Transação</Label>
                            <p className="text-sm text-muted-foreground">Notificar sobre novas transações</p>
                          </div>
                          <Switch
                            checked={notificationSettings.transactionAlerts}
                            onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, transactionAlerts: checked }))}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label>Alertas de Portfólio</Label>
                            <p className="text-sm text-muted-foreground">Notificar sobre mudanças no portfólio</p>
                          </div>
                          <Switch
                            checked={notificationSettings.portfolioAlerts}
                            onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, portfolioAlerts: checked }))}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label>Alertas do Sistema</Label>
                            <p className="text-sm text-muted-foreground">Notificar sobre atualizações do sistema</p>
                          </div>
                          <Switch
                            checked={notificationSettings.systemAlerts}
                            onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, systemAlerts: checked }))}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </main>
        </div>
      </div>

      {/* Dialog de Edição de Empreendimento */}
      <Dialog open={isEditEmpreendimentoDialogOpen} onOpenChange={setIsEditEmpreendimentoDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Empreendimento</DialogTitle>
            <DialogDescription>
              Altere as informações do empreendimento
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome</Label>
              <Input 
                id="nome"
                value={empreendimentoFormData.nome}
                onChange={(e) => setEmpreendimentoFormData(prev => ({ ...prev, nome: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="descricao">Descrição</Label>
              <Textarea 
                id="descricao"
                value={empreendimentoFormData.descricao}
                onChange={(e) => setEmpreendimentoFormData(prev => ({ ...prev, descricao: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endereco">Endereço</Label>
              <Input 
                id="endereco"
                value={empreendimentoFormData.endereco}
                onChange={(e) => setEmpreendimentoFormData(prev => ({ ...prev, endereco: e.target.value }))}
              />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="cidade">Cidade</Label>
                <Input 
                  id="cidade"
                  value={empreendimentoFormData.cidade}
                  onChange={(e) => setEmpreendimentoFormData(prev => ({ ...prev, cidade: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="estado">Estado</Label>
                <Input 
                  id="estado"
                  value={empreendimentoFormData.estado}
                  onChange={(e) => setEmpreendimentoFormData(prev => ({ ...prev, estado: e.target.value }))}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="areaTotal">Área Total (m²)</Label>
              <Input 
                id="areaTotal"
                value={empreendimentoFormData.areaTotal}
                onChange={(e) => setEmpreendimentoFormData(prev => ({ ...prev, areaTotal: e.target.value }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleSaveEmpreendimento}>
              Salvar Alterações
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog de Edição de Quadra */}
      <Dialog open={isEditQuadraDialogOpen} onOpenChange={setIsEditQuadraDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Quadra</DialogTitle>
            <DialogDescription>
              Altere as informações da quadra
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome</Label>
              <Input 
                id="nome"
                value={quadraFormData.nome}
                onChange={(e) => setQuadraFormData(prev => ({ ...prev, nome: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="empreendimento">Empreendimento</Label>
              <Select value={quadraFormData.empreendimento} onValueChange={(value) => setQuadraFormData(prev => ({ ...prev, empreendimento: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {activeEmpreendimentos.map((empreendimento) => (
                    <SelectItem key={empreendimento.id} value={empreendimento.id}>
                      {empreendimento.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleSaveQuadra}>
              Salvar Alterações
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog de Edição/Criação de Usuário */}
      <Dialog open={isEditUsuarioDialogOpen} onOpenChange={setIsEditUsuarioDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingUsuario ? "Editar Usuário" : "Criar Usuário"}</DialogTitle>
            <DialogDescription>
              {editingUsuario ? "Altere as informações do usuário" : "Preencha os dados para criar um novo usuário"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome</Label>
              <Input 
                id="nome"
                value={usuarioFormData.nome}
                onChange={(e) => setUsuarioFormData(prev => ({ ...prev, nome: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="identificador">CRECI</Label>
              <Input 
                id="identificador"
                value={usuarioFormData.identificador}
                onChange={(e) => setUsuarioFormData(prev => ({ ...prev, identificador: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="senha">Senha</Label>
              <Input 
                id="senha"
                type="password"
                value={usuarioFormData.senha}
                onChange={(e) => setUsuarioFormData(prev => ({ ...prev, senha: e.target.value }))}
                placeholder="Digite uma senha"
              />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="papel">Função</Label>
                <Select value={usuarioFormData.papel} onValueChange={(value: "ADMIN" | "USER") => setUsuarioFormData(prev => ({ ...prev, papel: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ADMIN">Administrador</SelectItem>
                    <SelectItem value="USER">Usuário</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={usuarioFormData.status} onValueChange={(value: "ATIVO" | "INATIVO") => setUsuarioFormData(prev => ({ ...prev, status: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ATIVO">Ativo</SelectItem>
                    <SelectItem value="INATIVO">Inativo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleSaveUsuario}>
              Salvar Alterações
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog de Edição de Condição de Pagamento */}
      <Dialog open={isEditPaymentConditionDialogOpen} onOpenChange={setIsEditPaymentConditionDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingPaymentCondition ? "Editar Condição de Pagamento" : "Nova Condição de Pagamento"}</DialogTitle>
            <DialogDescription>
              {editingPaymentCondition ? "Altere as informações da condição de pagamento" : "Cadastre uma nova condição de pagamento"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome</Label>
              <Input 
                id="nome"
                value={paymentConditionFormData.nome}
                onChange={(e) => setPaymentConditionFormData(prev => ({ ...prev, nome: e.target.value }))}
                placeholder="Ex: À Vista, Parcelado Simples"
              />
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="entradaMinima">Entrada Mínima (%)</Label>
                <Input 
                  id="entradaMinima"
                  type="number"
                  min="0"
                  max="100"
                  value={paymentConditionFormData.entradaMinima}
                  onChange={(e) => setPaymentConditionFormData(prev => ({ ...prev, entradaMinima: parseInt(e.target.value) || 0 }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="parcelasMaximas">Parcelas Máximas</Label>
                <Input 
                  id="parcelasMaximas"
                  type="number"
                  min="1"
                  value={paymentConditionFormData.parcelasMaximas}
                  onChange={(e) => setPaymentConditionFormData(prev => ({ ...prev, parcelasMaximas: parseInt(e.target.value) || 1 }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="jurosMes">Juros Mês (%)</Label>
                <Input 
                  id="jurosMes"
                  type="number"
                  min="0"
                  step="0.1"
                  value={paymentConditionFormData.jurosMes}
                  onChange={(e) => setPaymentConditionFormData(prev => ({ ...prev, jurosMes: parseFloat(e.target.value) || 0 }))}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={paymentConditionFormData.status} onValueChange={(value: "ATIVO" | "INATIVO") => setPaymentConditionFormData(prev => ({ ...prev, status: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ATIVO">Ativo</SelectItem>
                  <SelectItem value="INATIVO">Inativo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleSavePaymentCondition}>
              Salvar Alterações
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AuthGuard>
  );
}