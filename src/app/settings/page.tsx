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
  Edit
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
      timezone: "America/Sao_Paulo",
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

  const activeEmpreendimentos = empreendimentos.filter(emp => !emp.deletedAt);
  const activeQuadras = quadras.filter(quadra => !quadra.deletedAt);
  const deletedEmpreendimentos = empreendimentos.filter(emp => emp.deletedAt);
  const deletedQuadras = quadras.filter(quadra => quadra.deletedAt);

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
                        <div className="grid gap-4 md:grid-cols-2">
                          <div className="space-y-2">
                            <Label htmlFor="company">Nome da Empresa</Label>
                            <Input 
                              id="company" 
                              value={systemSettings.company}
                              onChange={(e) => setSystemSettings(prev => ({ ...prev, company: e.target.value }))}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="timezone">Fuso Horário</Label>
                            <Select value={systemSettings.timezone} onValueChange={(value) => setSystemSettings(prev => ({ ...prev, timezone: value }))}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="America/Sao_Paulo">America/Sao_Paulo</SelectItem>
                                <SelectItem value="America/New_York">America/New_York</SelectItem>
                                <SelectItem value="Europe/London">Europe/London</SelectItem>
                              </SelectContent>
                            </Select>
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
                              <TableHead>Nome</TableHead>
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
                              <TableHead>Nome</TableHead>
                              <TableHead>Empreendimento</TableHead>
                              <TableHead>Ações</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {activeQuadras.map((quadra) => (
                              <TableRow key={quadra.id}>
                                <TableCell className="font-medium">{quadra.nome}</TableCell>
                                <TableCell>{quadra.empreendimentoNome}</TableCell>
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
                            ))}
                          </TableBody>
                        </Table>
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
    </AuthGuard>
  );
}