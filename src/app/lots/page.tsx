"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";
import { Plus, Edit, Trash2, Search, Filter, Loader2, Building2, Grid3X3, AlertTriangle, Activity, DollarSign, TrendingUp, TrendingDown, Clock } from "lucide-react";
import { Sidebar } from "@/components/sidebar";
import { Header } from "@/components/header";
import { AuthGuard } from "@/components/auth-guard";
import { useLotsData } from "@/hooks/use-lots-data";

interface Lot {
  id: string;
  empreendimento: string;
  quadra: string;
  lote: string;
  area: number;
  valor: number;
  entrada: number;
  status: string;
  observacoes?: string;
  createdAt: string;
  updatedAt: string;
  reservedAt?: string;
}

export default function LotsPage() {
  const {
    lots,
    isLoading,
    error,
    addLot,
    updateLot,
    deleteLot,
    getReservationDaysLeft,
    checkExpiredReservations
  } = useLotsData();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEmpreendimentoDialogOpen, setIsEmpreendimentoDialogOpen] = useState(false);
  const [isQuadraDialogOpen, setIsQuadraDialogOpen] = useState(false);
  const [editingLot, setEditingLot] = useState<Lot | null>(null);
  const [selectedLot, setSelectedLot] = useState<Lot | null>(null);
  const [lotToDelete, setLotToDelete] = useState<Lot | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [empreendimentoFilter, setEmpreendimentoFilter] = useState("all");
  const [quadraFilter, setQuadraFilter] = useState("all");
  
  const [formData, setFormData] = useState({
    empreendimento: "",
    quadra: "",
    lote: "",
    area: "",
    valorPorMetro: "",
    valor: "",
    entrada: "",
    quantidadeParcelas: "",
    valorSessentaPorcento: "",
    status: "DISPONÍVEL",
    observacoes: ""
  });

  const [empreendimentoFormData, setEmpreendimentoFormData] = useState({
    nome: "",
    descricao: "",
    endereco: "",
    cidade: "",
    estado: "",
    areaTotal: ""
  });

  const [empreendimentos, setEmpreendimentos] = useState<Array<{
    id: string;
    nome: string;
    descricao: string;
    endereco: string;
    cidade: string;
    estado: string;
    areaTotal: string;
  }>>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('empreendimentos');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Filtrar apenas empreendimentos não excluídos
        return parsed.filter((emp: any) => !emp.deletedAt);
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
        areaTotal: "50000"
      },
      {
        id: "2", 
        nome: "Condomínio Parque das Águas",
        descricao: "Condomínio fechado com área de lazer",
        endereco: "Avenida Principal, 456",
        cidade: "São Paulo",
        estado: "SP",
        areaTotal: "75000"
      }
    ];
  });

  const [quadraFormData, setQuadraFormData] = useState({
    nome: "",
    empreendimento: ""
  });

  const [quadras, setQuadras] = useState<Array<{
    id: string;
    nome: string;
    empreendimento: string;
  }>>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('quadras');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Filtrar apenas quadras não excluídas
        return parsed.filter((quadra: any) => !quadra.deletedAt);
      }
    }
    return [
      {
        id: "1",
        nome: "A",
        empreendimento: "1"
      },
      {
        id: "2",
        nome: "B", 
        empreendimento: "1"
      },
      {
        id: "3",
        nome: "C",
        empreendimento: "1"
      },
      {
        id: "4",
        nome: "D",
        empreendimento: "1"
      }
    ];
  });

  // Otimização: useMemo para filtragem - evita recálculo a cada renderização
  const filteredLots = useMemo(() => {
    if (!searchTerm && statusFilter === "all" && empreendimentoFilter === "all" && quadraFilter === "all") return lots;
    
    return lots.filter(lot => {
      const matchesSearch = !searchTerm || 
        lot.quadra.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lot.lote.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "all" || lot.status === statusFilter;
      const matchesEmpreendimento = empreendimentoFilter === "all" || lot.empreendimento === empreendimentoFilter;
      const matchesQuadra = quadraFilter === "all" || lot.quadra === quadraFilter;
      return matchesSearch && matchesStatus && matchesEmpreendimento && matchesQuadra;
    });
  }, [lots, searchTerm, statusFilter, empreendimentoFilter, quadraFilter]);

  // Otimização: useCallback para formatação de moeda
  const formatCurrency = useCallback((value: number) => {
    return `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
  }, []);

  // Função para obter o nome do empreendimento pelo ID
  const getEmpreendimentoNome = useCallback((empreendimentoId: string) => {
    const empreendimento = empreendimentos.find(emp => emp.id === empreendimentoId);
    return empreendimento ? empreendimento.nome : empreendimentoId;
  }, [empreendimentos]);

  // Calculate dashboard statistics
  const dashboardStats = useMemo(() => {
    const totalLots = lots.length;
    const availableLots = lots.filter(lot => lot.status === 'DISPONÍVEL').length;
    const soldLots = lots.filter(lot => lot.status === 'VENDIDO').length;
    const reservedLots = lots.filter(lot => lot.status === 'RESERVADO').length;
    const inProposalLots = lots.filter(lot => lot.status === 'EM PROPOSTA').length;
    const totalValue = lots.reduce((sum, lot) => sum + lot.valor, 0);

    return {
      totalLots,
      availableLots,
      soldLots,
      reservedLots,
      inProposalLots,
      totalValue
    };
  }, [lots]);

  // Efeito para limpar a quadra quando o empreendimento muda
  useEffect(() => {
    if (formData.empreendimento) {
      setFormData(prev => ({
        ...prev,
        quadra: ""
      }));
    }
  }, [formData.empreendimento]);

  // Efeito para limpar o filtro de quadra quando o filtro de empreendimento muda
  useEffect(() => {
    if (empreendimentoFilter !== "all") {
      setQuadraFilter("all");
    }
  }, [empreendimentoFilter]);

  // Otimização: useCallback para funções de manipulação
  const getStatusBadge = useCallback((status: string) => {
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
  }, []);

  // Otimização: useCallback para handlers
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    const newLot: Lot = {
      id: editingLot?.id || Date.now().toString(),
      empreendimento: formData.empreendimento,
      quadra: formData.quadra.toUpperCase(),
      lote: formData.lote.padStart(2, '0'),
      area: parseInt(formData.area),
      valor: parseFloat(formData.valor),
      entrada: parseFloat(formData.entrada) || (parseFloat(formData.valor) * 0.1), // 10% do valor se não especificado
      status: formData.status,
      observacoes: formData.observacoes,
      createdAt: editingLot?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    try {
      if (editingLot) {
        await updateLot(editingLot.id, newLot);
      } else {
        await addLot(newLot);
      }

      resetForm();
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Erro ao salvar lote:', error);
      // Aqui você pode adicionar uma notificação de erro
    }
  }, [formData, editingLot, addLot, updateLot]);

  const handleEdit = useCallback((lot: Lot) => {
    setEditingLot(lot);
    setFormData({
      empreendimento: lot.empreendimento,
      quadra: lot.quadra,
      lote: lot.lote,
      area: lot.area.toString(),
      valorPorMetro: (lot.valor / lot.area).toString(),
      valor: lot.valor.toString(),
      entrada: "",
      quantidadeParcelas: "",
      valorSessentaPorcento: "",
      status: lot.status,
      observacoes: lot.observacoes || ""
    });
    setIsDialogOpen(true);
  }, []);

  const handleDelete = useCallback((lot: Lot) => {
    setLotToDelete(lot);
  }, []);

  const confirmDelete = useCallback(() => {
    if (lotToDelete) {
      deleteLot(lotToDelete.id);
      if (selectedLot?.id === lotToDelete.id) {
        setSelectedLot(null);
      }
      setLotToDelete(null);
    }
  }, [lotToDelete, deleteLot, selectedLot]);

  const cancelDelete = useCallback(() => {
    setLotToDelete(null);
  }, []);

  const handleLotClick = useCallback((lot: Lot) => {
    setSelectedLot(selectedLot?.id === lot.id ? null : lot);
  }, [selectedLot]);

  const resetForm = useCallback(() => {
    setFormData({
      empreendimento: "",
      quadra: "",
      lote: "",
      area: "",
      valorPorMetro: "",
      valor: "",
      entrada: "",
      quantidadeParcelas: "",
      valorSessentaPorcento: "",
      status: "DISPONÍVEL",
      observacoes: ""
    });
    setEditingLot(null);
  }, []);

  const handleEmpreendimentoSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    // Criar novo empreendimento e adicionar à lista
    const novoEmpreendimento = {
      id: Date.now().toString(),
      ...empreendimentoFormData,
      createdAt: new Date().toISOString()
    };
    
    setEmpreendimentos(prev => {
      const updated = [...prev, novoEmpreendimento];
      localStorage.setItem('empreendimentos', JSON.stringify(updated));
      return updated;
    });
    setIsEmpreendimentoDialogOpen(false);
    setEmpreendimentoFormData({
      nome: "",
      descricao: "",
      endereco: "",
      cidade: "",
      estado: "",
      areaTotal: ""
    });
  }, [empreendimentoFormData]);

  const handleQuadraSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    // Criar nova quadra e adicionar à lista
    const empreendimentoSelecionado = empreendimentos.find(emp => emp.id === quadraFormData.empreendimento);
    const novaQuadra = {
      id: Date.now().toString(),
      ...quadraFormData,
      empreendimentoNome: empreendimentoSelecionado?.nome || "Desconhecido",
      createdAt: new Date().toISOString()
    };
    
    setQuadras(prev => {
      const updated = [...prev, novaQuadra];
      localStorage.setItem('quadras', JSON.stringify(updated));
      return updated;
    });
    setIsQuadraDialogOpen(false);
    setQuadraFormData({
      nome: "",
      empreendimento: ""
    });
  }, [quadraFormData, empreendimentos]);

  // Função para calcular o valor automaticamente
  const handleValorPorMetroChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const valorPorMetro = e.target.value;
    const area = parseFloat(formData.area);
    
    setFormData(prev => ({
      ...prev,
      valorPorMetro
    }));

    // Calcular valor total se área e valor por metro estiverem preenchidos
    if (!isNaN(area) && area > 0 && valorPorMetro) {
      const valorPorMetroNum = parseFloat(valorPorMetro);
      if (!isNaN(valorPorMetroNum)) {
        const valorTotal = area * valorPorMetroNum;
        setFormData(prev => ({
          ...prev,
          valorPorMetro,
          valor: valorTotal.toFixed(2)
        }));
      }
    }
  }, [formData.area]);

  const handleAreaChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const area = e.target.value;
    const valorPorMetro = parseFloat(formData.valorPorMetro);
    
    setFormData(prev => ({
      ...prev,
      area
    }));

    // Calcular valor total se área e valor por metro estiverem preenchidos
    if (area && !isNaN(valorPorMetro) && valorPorMetro > 0) {
      const areaNum = parseFloat(area);
      if (!isNaN(areaNum)) {
        const valorTotal = areaNum * valorPorMetro;
        setFormData(prev => ({
          ...prev,
          area,
          valor: valorTotal.toFixed(2)
        }));
      }
    }
  }, [formData.valorPorMetro]);

  // Funções para formatação de moeda brasileira
  const formatCurrencyBR = useCallback((value: number | string): string => {
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(numValue)) return '';
    
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(numValue);
  }, []);

  const formatNumberBR = useCallback((value: number | string): string => {
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(numValue)) return '';
    
    return new Intl.NumberFormat('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(numValue);
  }, []);

  const parseCurrencyBR = useCallback((formattedValue: string): number => {
    // Remove o símbolo R$, espaços e pontos de milhar, depois substitui vírgula por ponto
    const cleanValue = formattedValue
      .replace(/[R$\s.]/g, '')
      .replace(',', '.');
    
    const parsed = parseFloat(cleanValue);
    return isNaN(parsed) ? 0 : parsed;
  }, []);

  // Função para formatar o valor no input
  const formatValorInput = useCallback((value: string): string => {
    if (!value) return '';
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return '';
    return formatNumberBR(numValue);
  }, [formatNumberBR]);

  // Atualizar as funções de cálculo automático para usar a formatação correta
  const updateValorTotal = useCallback((area: number, valorPorMetro: number) => {
    if (!isNaN(area) && area > 0 && !isNaN(valorPorMetro) && valorPorMetro > 0) {
      const valorTotal = area * valorPorMetro;
      setFormData(prev => ({
        ...prev,
        valor: valorTotal.toFixed(2)
      }));
    }
  }, []);

  // Função para calcular 60% do valor automaticamente
  const handleValorChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    const numericValue = parseCurrencyBR(rawValue);
    
    // Atualiza o estado com o valor numérico
    setFormData(prev => ({
      ...prev,
      valor: numericValue.toFixed(2)
    }));

    // Calcular 60% do valor automaticamente
    if (!isNaN(numericValue) && numericValue > 0) {
      const sessentaPorcento = numericValue * 0.6;
      setFormData(prev => ({
        ...prev,
        valor: numericValue.toFixed(2),
        valorSessentaPorcento: sessentaPorcento.toFixed(2)
      }));
    }
  }, [parseCurrencyBR]);

  const handleEntradaChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    const numericValue = parseCurrencyBR(rawValue);
    
    setFormData(prev => ({
      ...prev,
      entrada: numericValue.toFixed(2)
    }));
  }, [parseCurrencyBR]);

  const handleQuantidadeParcelasChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const quantidade = e.target.value;
    setFormData(prev => ({
      ...prev,
      quantidadeParcelas: quantidade
    }));
  }, []);

  const handleValorSessentaPorcentoChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    const numericValue = parseCurrencyBR(rawValue);
    
    setFormData(prev => ({
      ...prev,
      valorSessentaPorcento: numericValue.toFixed(2)
    }));
  }, [parseCurrencyBR]);

  return (
    <AuthGuard requireAdmin={true}>
      <TooltipProvider>
        <div className="flex h-screen bg-background">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Gerenciamento de Lotes</h1>
                <p className="text-muted-foreground">
                  Controle de lotes disponíveis para negociação
                </p>
              </div>
              <div className="flex gap-2">
                <Dialog open={isEmpreendimentoDialogOpen} onOpenChange={setIsEmpreendimentoDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline">
                      <Building2 className="mr-2 h-4 w-4" />
                      Novo Empreendimento
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                      <DialogTitle>Criar Novo Empreendimento</DialogTitle>
                      <DialogDescription>
                        Preencha as informações para criar um novo empreendimento.
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleEmpreendimentoSubmit}>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="nome" className="text-right">
                            Nome
                          </Label>
                          <Input
                            id="nome"
                            value={empreendimentoFormData.nome}
                            onChange={(e) => setEmpreendimentoFormData({...empreendimentoFormData, nome: e.target.value})}
                            className="col-span-3"
                            placeholder="Ex: Residencial Vale Verde"
                            required
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="descricao" className="text-right">
                            Descrição
                          </Label>
                          <Textarea
                            id="descricao"
                            value={empreendimentoFormData.descricao}
                            onChange={(e) => setEmpreendimentoFormData({...empreendimentoFormData, descricao: e.target.value})}
                            className="col-span-3"
                            rows={2}
                            placeholder="Descrição do empreendimento"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="endereco" className="text-right">
                            Endereço
                          </Label>
                          <Input
                            id="endereco"
                            value={empreendimentoFormData.endereco}
                            onChange={(e) => setEmpreendimentoFormData({...empreendimentoFormData, endereco: e.target.value})}
                            className="col-span-3"
                            placeholder="Ex: Rua das Flores, 123"
                            required
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="cidade" className="text-right">
                            Cidade
                          </Label>
                          <Input
                            id="cidade"
                            value={empreendimentoFormData.cidade}
                            onChange={(e) => setEmpreendimentoFormData({...empreendimentoFormData, cidade: e.target.value})}
                            className="col-span-3"
                            placeholder="Ex: São Paulo"
                            required
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="estado" className="text-right">
                            Estado
                          </Label>
                          <Input
                            id="estado"
                            value={empreendimentoFormData.estado}
                            onChange={(e) => setEmpreendimentoFormData({...empreendimentoFormData, estado: e.target.value})}
                            className="col-span-3"
                            placeholder="Ex: SP"
                            required
                          />
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="areaTotal" className="text-right">
                            Área Total (m²)
                          </Label>
                          <Input
                            id="areaTotal"
                            type="number"
                            value={empreendimentoFormData.areaTotal}
                            onChange={(e) => setEmpreendimentoFormData({...empreendimentoFormData, areaTotal: e.target.value})}
                            className="col-span-3"
                            placeholder="Ex: 50000"
                            required
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button type="submit">
                          Criar Empreendimento
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>

                <Dialog open={isQuadraDialogOpen} onOpenChange={setIsQuadraDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline">
                      Nova Quadra
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                      <DialogTitle>Criar Nova Quadra</DialogTitle>
                      <DialogDescription>
                        Preencha as informações para criar uma nova quadra.
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleQuadraSubmit}>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="quadraNome" className="text-right">
                            Quadra
                          </Label>
                          <Input
                            id="quadraNome"
                            value={quadraFormData.nome}
                            onChange={(e) => setQuadraFormData({...quadraFormData, nome: e.target.value})}
                            className="col-span-3"
                            placeholder="Ex: A"
                            required
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="empreendimento" className="text-right">
                            Empreendimento
                          </Label>
                          <Select
                            value={quadraFormData.empreendimento}
                            onValueChange={(value) => setQuadraFormData({...quadraFormData, empreendimento: value})}
                            required
                          >
                            <SelectTrigger className="col-span-3">
                              <SelectValue placeholder="Selecione um empreendimento" />
                            </SelectTrigger>
                            <SelectContent>
                              {empreendimentos.length === 0 ? (
                                <div className="py-6 text-center text-sm text-muted-foreground">
                                  Nenhum empreendimento cadastrado
                                </div>
                              ) : (
                                empreendimentos.map((empreendimento) => (
                                  <SelectItem key={empreendimento.id} value={empreendimento.id}>
                                    {empreendimento.nome}
                                  </SelectItem>
                                ))
                              )}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button type="submit">
                          Criar Quadra
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>

                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={resetForm}>
                      <Plus className="mr-2 h-4 w-4" />
                      Novo Lote
                    </Button>
                  </DialogTrigger>
                <DialogContent className="sm:max-w-[1200px] max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>
                      {editingLot ? "Editar Lote" : "Criar Novo Lote"}
                    </DialogTitle>
                    <DialogDescription>
                      {editingLot 
                        ? "Edite as informações do lote existente."
                        : "Preencha as informações para criar um novo lote."
                      }
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="empreendimento">
                            Empreendimento
                          </Label>
                          <Select
                            value={formData.empreendimento}
                            onValueChange={(value) => setFormData({...formData, empreendimento: value})}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o empreendimento" />
                            </SelectTrigger>
                            <SelectContent>
                              {empreendimentos.map((empreendimento) => (
                                <SelectItem key={empreendimento.id} value={empreendimento.id}>
                                  {empreendimento.nome}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="quadra">
                            Quadra
                          </Label>
                          <Select
                            value={formData.quadra}
                            onValueChange={(value) => setFormData({...formData, quadra: value})}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione a quadra" />
                            </SelectTrigger>
                            <SelectContent>
                              {quadras
                                .filter(quadra => 
                                  !formData.empreendimento || quadra.empreendimento === formData.empreendimento
                                )
                                .map((quadra) => (
                                  <SelectItem key={quadra.id} value={quadra.nome}>
                                    {quadra.nome}
                                  </SelectItem>
                                ))
                              }
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lote">
                            Lote
                          </Label>
                          <Input
                            id="lote"
                            value={formData.lote}
                            onChange={(e) => setFormData({...formData, lote: e.target.value})}
                            placeholder="Ex: 01"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="status">
                            Status
                          </Label>
                          <Select
                            value={formData.status}
                            onValueChange={(value) => setFormData({...formData, status: value})}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="DISPONÍVEL">Disponível</SelectItem>
                              <SelectItem value="RESERVADO">Reservado</SelectItem>
                              <SelectItem value="EM PROPOSTA">Em Proposta</SelectItem>
                              <SelectItem value="VENDIDO">Vendido</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="area">
                            Área (m²)
                          </Label>
                          <Input
                            id="area"
                            type="number"
                            value={formData.area}
                            onChange={handleAreaChange}
                            placeholder="Ex: 450"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="valorPorMetro">
                            R$ (m²)
                          </Label>
                          <Input
                            id="valorPorMetro"
                            type="number"
                            step="0.01"
                            value={formData.valorPorMetro}
                            onChange={handleValorPorMetroChange}
                            placeholder="Ex: 1500.00"
                            required
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="valor">
                            Valor (R$)
                          </Label>
                          <Input
                            id="valor"
                            type="text"
                            value={formatValorInput(formData.valor)}
                            onChange={handleValorChange}
                            placeholder="0,00"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="entrada">
                            Entrada (R$)
                          </Label>
                          <Input
                            id="entrada"
                            type="text"
                            value={formatValorInput(formData.entrada)}
                            onChange={handleEntradaChange}
                            placeholder="0,00"
                          />
                        </div>
                      </div>
                      
                      {/* Seção de Cards de Pagamento */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-center">Condições de Pagamento</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          
                          {/* Card 36x */}
                          <Card className="border-2 border-blue-200 hover:border-blue-400 transition-colors">
                            <CardHeader className="pb-3">
                              <CardTitle className="text-center text-blue-600">36x</CardTitle>
                              <CardDescription className="text-center">Pagamento em 36 parcelas</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3">
                              <div className="grid grid-cols-2 gap-2 text-sm">
                                <div>
                                  <Label className="text-xs text-gray-600">Qt</Label>
                                  <Input type="number" placeholder="36" className="h-8 text-xs" />
                                </div>
                                <div>
                                  <Label className="text-xs text-gray-600">R$ (60%)</Label>
                                  <Input type="text" placeholder="0,00" className="h-8 text-xs" readOnly />
                                </div>
                              </div>
                              <div className="grid grid-cols-2 gap-2 text-sm">
                                <div>
                                  <Label className="text-xs text-gray-600">Anual</Label>
                                  <Input type="text" placeholder="0,00" className="h-8 text-xs" />
                                </div>
                                <div>
                                  <Label className="text-xs text-gray-600">R$ (30%)</Label>
                                  <Input type="text" placeholder="0,00" className="h-8 text-xs" />
                                </div>
                              </div>
                            </CardContent>
                          </Card>

                          {/* Card 48x */}
                          <Card className="border-2 border-green-200 hover:border-green-400 transition-colors">
                            <CardHeader className="pb-3">
                              <CardTitle className="text-center text-green-600">48x</CardTitle>
                              <CardDescription className="text-center">Pagamento em 48 parcelas</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3">
                              <div className="grid grid-cols-2 gap-2 text-sm">
                                <div>
                                  <Label className="text-xs text-gray-600">Qt</Label>
                                  <Input type="number" placeholder="48" className="h-8 text-xs" />
                                </div>
                                <div>
                                  <Label className="text-xs text-gray-600">R$ (60%)</Label>
                                  <Input type="text" placeholder="0,00" className="h-8 text-xs" readOnly />
                                </div>
                              </div>
                              <div className="grid grid-cols-2 gap-2 text-sm">
                                <div>
                                  <Label className="text-xs text-gray-600">Anual</Label>
                                  <Input type="text" placeholder="0,00" className="h-8 text-xs" />
                                </div>
                                <div>
                                  <Label className="text-xs text-gray-600">R$ (30%)</Label>
                                  <Input type="text" placeholder="0,00" className="h-8 text-xs" />
                                </div>
                              </div>
                            </CardContent>
                          </Card>

                          {/* Card 60x */}
                          <Card className="border-2 border-purple-200 hover:border-purple-400 transition-colors">
                            <CardHeader className="pb-3">
                              <CardTitle className="text-center text-purple-600">60x</CardTitle>
                              <CardDescription className="text-center">Pagamento em 60 parcelas</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3">
                              <div className="grid grid-cols-2 gap-2 text-sm">
                                <div>
                                  <Label className="text-xs text-gray-600">Qt</Label>
                                  <Input type="number" placeholder="60" className="h-8 text-xs" />
                                </div>
                                <div>
                                  <Label className="text-xs text-gray-600">R$ (60%)</Label>
                                  <Input type="text" placeholder="0,00" className="h-8 text-xs" readOnly />
                                </div>
                              </div>
                              <div className="grid grid-cols-2 gap-2 text-sm">
                                <div>
                                  <Label className="text-xs text-gray-600">Anual</Label>
                                  <Input type="text" placeholder="0,00" className="h-8 text-xs" />
                                </div>
                                <div>
                                  <Label className="text-xs text-gray-600">R$ (30%)</Label>
                                  <Input type="text" placeholder="0,00" className="h-8 text-xs" />
                                </div>
                              </div>
                            </CardContent>
                          </Card>

                          {/* Card 96x */}
                          <Card className="border-2 border-orange-200 hover:border-orange-400 transition-colors">
                            <CardHeader className="pb-3">
                              <CardTitle className="text-center text-orange-600">96x</CardTitle>
                              <CardDescription className="text-center">Pagamento em 96 parcelas</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3">
                              <div className="grid grid-cols-2 gap-2 text-sm">
                                <div>
                                  <Label className="text-xs text-gray-600">Qt</Label>
                                  <Input type="number" placeholder="96" className="h-8 text-xs" />
                                </div>
                                <div>
                                  <Label className="text-xs text-gray-600">R$ (60%)</Label>
                                  <Input type="text" placeholder="0,00" className="h-8 text-xs" readOnly />
                                </div>
                              </div>
                              <div className="grid grid-cols-2 gap-2 text-sm">
                                <div>
                                  <Label className="text-xs text-gray-600">Anual</Label>
                                  <Input type="text" placeholder="0,00" className="h-8 text-xs" />
                                </div>
                                <div>
                                  <Label className="text-xs text-gray-600">R$ (30%)</Label>
                                  <Input type="text" placeholder="0,00" className="h-8 text-xs" />
                                </div>
                              </div>
                            </CardContent>
                          </Card>

                          {/* Card 120x */}
                          <Card className="border-2 border-red-200 hover:border-red-400 transition-colors">
                            <CardHeader className="pb-3">
                              <CardTitle className="text-center text-red-600">120x</CardTitle>
                              <CardDescription className="text-center">Pagamento em 120 parcelas</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3">
                              <div className="grid grid-cols-2 gap-2 text-sm">
                                <div>
                                  <Label className="text-xs text-gray-600">Qt</Label>
                                  <Input type="number" placeholder="120" className="h-8 text-xs" />
                                </div>
                                <div>
                                  <Label className="text-xs text-gray-600">R$ (60%)</Label>
                                  <Input type="text" placeholder="0,00" className="h-8 text-xs" readOnly />
                                </div>
                              </div>
                              <div className="grid grid-cols-2 gap-2 text-sm">
                                <div>
                                  <Label className="text-xs text-gray-600">Anual</Label>
                                  <Input type="text" placeholder="0,00" className="h-8 text-xs" />
                                </div>
                                <div>
                                  <Label className="text-xs text-gray-600">R$ (30%)</Label>
                                  <Input type="text" placeholder="0,00" className="h-8 text-xs" />
                                </div>
                              </div>
                            </CardContent>
                          </Card>

                          {/* Card 123x */}
                          <Card className="border-2 border-indigo-200 hover:border-indigo-400 transition-colors">
                            <CardHeader className="pb-3">
                              <CardTitle className="text-center text-indigo-600">123x</CardTitle>
                              <CardDescription className="text-center">Pagamento em 123 parcelas</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3">
                              <div className="grid grid-cols-2 gap-2 text-sm">
                                <div>
                                  <Label className="text-xs text-gray-600">Qt</Label>
                                  <Input type="number" placeholder="123" className="h-8 text-xs" />
                                </div>
                                <div>
                                  <Label className="text-xs text-gray-600">R$ (60%)</Label>
                                  <Input type="text" placeholder="0,00" className="h-8 text-xs" readOnly />
                                </div>
                              </div>
                              <div className="grid grid-cols-2 gap-2 text-sm">
                                <div>
                                  <Label className="text-xs text-gray-600">Anual</Label>
                                  <Input type="text" placeholder="0,00" className="h-8 text-xs" />
                                </div>
                                <div>
                                  <Label className="text-xs text-gray-600">R$ (30%)</Label>
                                  <Input type="text" placeholder="0,00" className="h-8 text-xs" />
                                </div>
                              </div>
                            </CardContent>
                          </Card>

                        </div>
                      </div>
                      
                      {/* Linha separadora final */}
                      <div className="border-t border-gray-200 my-4"></div>
                      
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="observacoes" className="text-right">
                          Observações
                        </Label>
                        <Textarea
                          id="observacoes"
                          value={formData.observacoes}
                          onChange={(e) => setFormData({...formData, observacoes: e.target.value})}
                          className="col-span-3"
                          rows={3}
                          placeholder="Informações adicionais sobre o lote"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="submit">
                        {editingLot ? "Atualizar" : "Criar"} Lote
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
              
              {/* AlertDialog de confirmação de exclusão */}
              <AlertDialog open={!!lotToDelete} onOpenChange={(open) => !open && cancelDelete()}>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-red-600" />
                      Confirmar Exclusão
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      Tem certeza que deseja excluir o lote <strong>{lotToDelete?.quadra} {lotToDelete?.lote}</strong>? 
                      Esta ação não pode ser desfeita.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel onClick={cancelDelete}>
                      Cancelar
                    </AlertDialogCancel>
                    <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
                      Excluir Lote
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              </div>
            </div>

            {/* Error Display */}
            {error && (
              <Card className="border-red-200 bg-red-50">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 text-red-800">
                    <span className="font-medium">Erro:</span>
                    <span>{error}</span>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Dashboard Cards */}
            <div className="grid gap-4 md:grid-cols-5">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total</CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{dashboardStats.totalLots.toLocaleString('pt-BR')}</div>
                  <p className="text-xs text-muted-foreground">
                    Total de lotes cadastrados
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Lotes</CardTitle>
                  <TrendingUp className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{dashboardStats.availableLots}</div>
                  <p className="text-xs text-muted-foreground">
                    Lotes disponíveis para negociação
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Em Proposta</CardTitle>
                  <TrendingUp className="h-4 w-4 text-purple-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-600">{dashboardStats.inProposalLots}</div>
                  <p className="text-xs text-muted-foreground">
                    Lotes em proposta
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Vendidos</CardTitle>
                  <TrendingDown className="h-4 w-4 text-red-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">{dashboardStats.soldLots}</div>
                  <p className="text-xs text-muted-foreground">
                    Lotes já vendidos
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Valor Total</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatCurrency(dashboardStats.totalValue)}</div>
                  <p className="text-xs text-muted-foreground">
                    Valor total dos lotes
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Lots Table */}
            <Card>
              <CardHeader>
                <div className="flex flex-col space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                    <div>
                      <CardTitle>Lotes Cadastrados</CardTitle>
                      <CardDescription>
                        Lista de todos os lotes disponíveis para negociação
                      </CardDescription>
                    </div>
                    <div className="flex flex-wrap gap-2 items-center">
                      <div className="relative w-64">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          placeholder="Buscar por quadra ou lote..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                      <Select value={empreendimentoFilter} onValueChange={setEmpreendimentoFilter}>
                        <SelectTrigger className="w-[180px]">
                          <Building2 className="mr-2 h-4 w-4" />
                          <SelectValue placeholder="Empreendimento" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todos Empreendimentos</SelectItem>
                          {empreendimentos.map((empreendimento) => (
                            <SelectItem key={empreendimento.id} value={empreendimento.id}>
                              {empreendimento.nome}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Select value={quadraFilter} onValueChange={setQuadraFilter}>
                        <SelectTrigger className="w-[140px]">
                          <Grid3X3 className="mr-2 h-4 w-4" />
                          <SelectValue placeholder="Quadra" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todas Quadras</SelectItem>
                          {quadras
                            .filter(quadra => 
                              empreendimentoFilter === "all" || quadra.empreendimento === empreendimentoFilter
                            )
                            .map((quadra) => (
                              <SelectItem key={quadra.id} value={quadra.nome}>
                                {quadra.nome}
                              </SelectItem>
                            ))
                          }
                        </SelectContent>
                      </Select>
                      <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-[140px]">
                          <Filter className="mr-2 h-4 w-4" />
                          <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todos Status</SelectItem>
                          <SelectItem value="DISPONÍVEL">Disponível</SelectItem>
                          <SelectItem value="RESERVADO">Reservado</SelectItem>
                          <SelectItem value="EM PROPOSTA">Em Proposta</SelectItem>
                          <SelectItem value="VENDIDO">Vendido</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                  <span className="ml-2 text-muted-foreground">Carregando lotes...</span>
                </div>
              ) : (
                <>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Empreendimento</TableHead>
                        <TableHead>Quadra</TableHead>
                        <TableHead>Lt</TableHead>
                        <TableHead>Área (m²)</TableHead>
                        <TableHead>Valor (R$)</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredLots.map((lot) => (
                        <TableRow 
                          key={lot.id}
                          className={`cursor-pointer hover:bg-muted/50 transition-colors ${
                            selectedLot?.id === lot.id ? 'bg-muted' : ''
                          }`}
                          onClick={() => handleLotClick(lot)}
                        >
                          <TableCell className="font-medium">{getEmpreendimentoNome(lot.empreendimento)}</TableCell>
                          <TableCell className="font-medium">{lot.quadra}</TableCell>
                          <TableCell>{lot.lote}</TableCell>
                          <TableCell>{lot.area.toLocaleString('pt-BR')}</TableCell>
                          <TableCell className="font-medium">{formatCurrency(lot.valor)}</TableCell>
                          <TableCell>
                            {(() => {
                              const daysLeft = getReservationDaysLeft ? getReservationDaysLeft(lot) : null;
                              
                              if (lot.status === 'RESERVADO' && daysLeft !== null) {
                                return (
                                  <div className="flex items-center gap-2">
                                    {getStatusBadge(lot.status)}
                                    {daysLeft <= 2 ? (
                                      <Badge variant="destructive" className="flex items-center gap-1 text-xs">
                                        <AlertTriangle className="h-3 w-3" />
                                        {daysLeft}d
                                      </Badge>
                                    ) : daysLeft <= 5 ? (
                                      <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-yellow-200 flex items-center gap-1 text-xs">
                                        <Clock className="h-3 w-3" />
                                        {daysLeft}d
                                      </Badge>
                                    ) : (
                                      <Badge variant="outline" className="flex items-center gap-1 text-xs">
                                        <Clock className="h-3 w-3" />
                                        {daysLeft}d
                                      </Badge>
                                    )}
                                  </div>
                                );
                              }
                              
                              return getStatusBadge(lot.status);
                            })()}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center justify-center gap-2" onClick={(e) => e.stopPropagation()}>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => handleEdit(lot)}
                                    >
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Editar Lote</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => handleDelete(lot)}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Excluir Lote</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  {filteredLots.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      Nenhum lote encontrado com os filtros selecionados.
                    </div>
                  )}
                </>
              )}
            </CardContent>
            </Card>

            {/* Lot Details Modal */}
            <Dialog open={!!selectedLot} onOpenChange={(open) => !open && setSelectedLot(null)}>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    Detalhes do Lote {selectedLot?.quadra}-{selectedLot?.lote}
                    {selectedLot && getStatusBadge(selectedLot.status)}
                  </DialogTitle>
                  <DialogDescription>
                    Informações detalhadas do lote selecionado
                  </DialogDescription>
                </DialogHeader>
                {selectedLot && (
                  <div className="grid gap-6 md:grid-cols-2">
                    {/* Left Column - Basic Info */}
                    <div className="space-y-4">
                      <h4 className="font-medium text-muted-foreground">Informações Básicas</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Empreendimento</p>
                          <p className="font-medium">{getEmpreendimentoNome(selectedLot.empreendimento)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Quadra</p>
                          <p className="font-medium">{selectedLot.quadra}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Lote</p>
                          <p className="font-medium">{selectedLot.lote}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Área</p>
                          <p className="font-medium">{selectedLot.area.toLocaleString('pt-BR')} m²</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Valor</p>
                          <p className="font-medium">{formatCurrency(selectedLot.valor)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Entrada</p>
                          <p className="font-medium">{formatCurrency(selectedLot.entrada)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Valor por m²</p>
                          <p className="font-medium">{formatCurrency(selectedLot.valor / selectedLot.area)}</p>
                        </div>
                      </div>
                    </div>

                    {/* Right Column - Additional Info */}
                    <div className="space-y-4">
                      <h4 className="font-medium text-muted-foreground">Informações Adicionais</h4>
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm text-muted-foreground">Data de Cadastro</p>
                          <p className="text-sm">{new Date(selectedLot.createdAt).toLocaleDateString('pt-BR', {
                            day: '2-digit',
                            month: 'long',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Última Atualização</p>
                          <p className="text-sm">{new Date(selectedLot.updatedAt).toLocaleDateString('pt-BR', {
                            day: '2-digit',
                            month: 'long',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}</p>
                        </div>
                        {selectedLot.reservedAt && (
                          <div>
                            <p className="text-sm text-muted-foreground">Data da Reserva</p>
                            <p className="text-sm">{new Date(selectedLot.reservedAt).toLocaleDateString('pt-BR', {
                              day: '2-digit',
                              month: 'long',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}</p>
                          </div>
                        )}
                        {selectedLot.observacoes && (
                          <div>
                            <p className="text-sm text-muted-foreground">Observações</p>
                            <p className="text-sm mt-1 p-3 bg-muted rounded-md">{selectedLot.observacoes}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
                <DialogFooter>
                  <Button 
                    onClick={() => selectedLot && handleEdit(selectedLot)}
                    className="flex items-center gap-2"
                  >
                    <Edit className="h-4 w-4" />
                    Editar Lote
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => setSelectedLot(null)}
                  >
                    Fechar
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

          </div>
        </main>
      </div>
    </div>
    </TooltipProvider>
    </AuthGuard>
  );
}