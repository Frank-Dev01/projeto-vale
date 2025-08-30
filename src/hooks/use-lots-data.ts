import { useState, useEffect, useMemo } from 'react';

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
  reservedAt?: string; // Data quando o lote foi reservado
  reservedBy?: string; // ID do usuário que reservou o lote
}

// Dados mockados movidos para fora do hook para evitar problemas de inicialização
const mockLotsData: Lot[] = [
  {
    id: "1",
    empreendimento: "1",
    quadra: "A",
    lote: "01",
    area: 450,
    valor: 850000,
    entrada: 85000,
    status: "DISPONÍVEL",
    observacoes: "Lote na quadra A, próximo à entrada principal. Excelente localização com fácil acesso. Topografia plana e toda infraestrutura disponível.",
    createdAt: "2024-01-10T10:00:00Z",
    updatedAt: "2024-01-10T10:00:00Z"
  },
  {
    id: "2",
    empreendimento: "1",
    quadra: "B",
    lote: "05",
    area: 320,
    valor: 1200000,
    entrada: 120000,
    status: "RESERVADO",
    reservedAt: "2024-01-12T14:30:00Z", // Data da reserva
    reservedBy: "user1", // ID do usuário que reservou
    observacoes: "Lote com vista para o parque. Área residencial tranquila, ideal para construção de sobrado. Próximo a escolas e comércio.",
    createdAt: "2024-01-12T14:30:00Z",
    updatedAt: "2024-01-15T16:20:00Z"
  },
  {
    id: "3",
    empreendimento: "1",
    quadra: "C",
    lote: "12",
    area: 280,
    valor: 950000,
    entrada: 95000,
    status: "DISPONÍVEL",
    observacoes: "Lote em área residencial tranquila. Medidas 14x20m. Muro em todo o perímetro e portão de acesso.",
    createdAt: "2024-01-08T09:15:00Z",
    updatedAt: "2024-01-15T16:20:00Z"
  },
  {
    id: "4",
    empreendimento: "1",
    quadra: "A",
    lote: "08",
    area: 380,
    valor: 1100000,
    entrada: 110000,
    status: "VENDIDO",
    observacoes: "Lote comercial com grande frente para via principal. Excelente para comércio ou prestação de serviços. Alto fluxo de veículos.",
    createdAt: "2024-01-05T11:20:00Z",
    updatedAt: "2024-01-20T10:30:00Z"
  },
  {
    id: "5",
    empreendimento: "1",
    quadra: "D",
    lote: "03",
    area: 420,
    valor: 1350000,
    entrada: 135000,
    status: "DISPONÍVEL",
    observacoes: "Lote de esquina com grande frente. Medidas 21x20m. Possui duas frentes, sendo uma para rua principal. Excelente potencial.",
    createdAt: "2024-01-15T15:45:00Z",
    updatedAt: "2024-01-15T15:45:00Z"
  },
  {
    id: "6",
    empreendimento: "1",
    quadra: "B",
    lote: "10",
    area: 350,
    valor: 980000,
    entrada: 98000,
    status: "RESERVADO",
    reservedAt: "2024-01-18T09:30:00Z", // Data da reserva
    reservedBy: "user2", // ID do usuário que reservou
    observacoes: "Lote com topografia plana. Área bem arborizada e cercada. Próximo a áreas de lazer e transporte público.",
    createdAt: "2024-01-18T09:30:00Z",
    updatedAt: "2024-01-18T09:30:00Z"
  },
  {
    id: "7",
    empreendimento: "1",
    quadra: "C",
    lote: "08",
    area: 300,
    valor: 890000,
    entrada: 89000,
    status: "RESERVADO",
    reservedAt: "2024-01-20T11:15:00Z", // Data da reserva
    reservedBy: "user1", // ID do usuário que reservou (mesmo usuário do lote 2)
    observacoes: "Lote com localização privilegiada. Próximo à área de lazer e com fácil acesso. Topografia plana.",
    createdAt: "2024-01-20T11:15:00Z",
    updatedAt: "2024-01-20T11:15:00Z"
  },
  {
    id: "8",
    empreendimento: "1",
    quadra: "A",
    lote: "15",
    area: 400,
    valor: 1150000,
    entrada: 115000,
    status: "EM PROPOSTA",
    reservedAt: "2024-01-22T16:45:00Z", // Data da proposta
    reservedBy: "user1", // ID do usuário que fez a proposta
    observacoes: "Lote em área nobre, com vista panorâmica. Excelente para construção de casa padrão alto.",
    createdAt: "2024-01-22T16:45:00Z",
    updatedAt: "2024-01-22T16:45:00Z"
  },
  {
    id: "9",
    empreendimento: "1",
    quadra: "D",
    lote: "07",
    area: 360,
    valor: 920000,
    entrada: 92000,
    status: "EM PROPOSTA",
    reservedAt: "2024-01-25T09:20:00Z", // Data da proposta
    reservedBy: "user1", // ID do usuário que fez a proposta
    observacoes: "Lote com topografia suave, ideal para construção de sobrado. Próximo a escolas e comércio local.",
    createdAt: "2024-01-25T09:20:00Z",
    updatedAt: "2024-01-25T09:20:00Z"
  }
];

export function useLotsData() {
  const [lots, setLots] = useState<Lot[]>(mockLotsData); // Carregar dados imediatamente
  const [isLoading, setIsLoading] = useState(false); // Começar com loading false
  const [error, setError] = useState<string | null>(null);

  // Função para verificar e atualizar lotes reservados expirados
  const checkExpiredReservations = useMemo(() => () => {
    const now = new Date();
    const updatedLots = lots.map(lot => {
      if (lot.status === 'RESERVADO' && lot.reservedAt) {
        const reservedDate = new Date(lot.reservedAt);
        const expirationDate = new Date(reservedDate.getTime() + (10 * 24 * 60 * 60 * 1000)); // 10 dias
        
        if (now > expirationDate) {
          // Se passou 10 dias e ainda está RESERVADO, voltar para DISPONÍVEL
          return {
            ...lot,
            status: 'DISPONÍVEL',
            reservedAt: undefined,
            updatedAt: new Date().toISOString()
          };
        }
      }
      return lot;
    });
    
    setLots(updatedLots);
    return updatedLots;
  }, [lots]);

  // Função para calcular dias restantes de reserva
  const getReservationDaysLeft = useMemo(() => (lot: Lot) => {
    if (lot.status !== 'RESERVADO' || !lot.reservedAt) {
      return null;
    }
    
    const reservedDate = new Date(lot.reservedAt);
    const expirationDate = new Date(reservedDate.getTime() + (10 * 24 * 60 * 60 * 1000)); // 10 dias
    const now = new Date();
    
    const diffTime = expirationDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return Math.max(0, diffDays);
  }, []);

  // Otimização: carregamento rápido com cache
  useEffect(() => {
    const loadLots = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Simular carregamento assíncrono rápido para melhor UX
        // await new Promise(resolve => setTimeout(resolve, 10));
        
        setLots(mockLotsData);
        setIsLoading(false); // Garantir que loading seja false
      } catch (err) {
        setError('Erro ao carregar os lotes');
        console.error('Erro ao carregar lotes:', err);
        setIsLoading(false); // Garantir que loading seja false mesmo em caso de erro
      } finally {
        setIsLoading(false);
      }
    };

    loadLots();
  }, []); // Removido mockLotsData das dependências pois agora é uma constante

  // Verificar reservas expiradas a cada minuto
  useEffect(() => {
    const interval = setInterval(() => {
      checkExpiredReservations();
    }, 60000); // Verificar a cada minuto

    return () => clearInterval(interval);
  }, [checkExpiredReservations]);

  // Otimização: funções de manipulação memoizadas
  const addLot = useMemo(() => (newLot: Lot) => {
    setLots(prev => [...prev, newLot]);
  }, []);

  const updateLot = useMemo(() => (id: string, updatedLot: Partial<Lot>) => {
    setLots(prev => prev.map(lot => {
      if (lot.id === id) {
        const updated = { ...lot, ...updatedLot, updatedAt: new Date().toISOString() };
        
        // Se o status mudou para RESERVADO, adicionar data de reserva e usuário
        if (updatedLot.status === 'RESERVADO' && lot.status !== 'RESERVADO') {
          updated.reservedAt = new Date().toISOString();
          updated.reservedBy = updatedLot.reservedBy || 'user1'; // Usuário padrão para demonstração
        }
        
        // Se o status mudou de RESERVADO para outro, limpar data de reserva e usuário
        if (updatedLot.status !== 'RESERVADO' && lot.status === 'RESERVADO') {
          updated.reservedAt = undefined;
          updated.reservedBy = undefined;
        }
        
        return updated;
      }
      return lot;
    }));
  }, []);

  const deleteLot = useMemo(() => (id: string) => {
    setLots(prev => prev.filter(lot => lot.id !== id));
  }, []);

  // Otimização: estatísticas calculadas
  const stats = useMemo(() => {
    const total = lots.length;
    const available = lots.filter(lot => lot.status === 'DISPONÍVEL').length;
    const reserved = lots.filter(lot => lot.status === 'RESERVADO').length;
    const sold = lots.filter(lot => lot.status === 'VENDIDO').length;
    const inProposal = lots.filter(lot => lot.status === 'EM PROPOSTA').length;
    const totalValue = lots.reduce((sum, lot) => sum + lot.valor, 0);

    return { total, available, reserved, sold, inProposal, totalValue };
  }, [lots]);

  return {
    lots,
    isLoading,
    error,
    addLot,
    updateLot,
    deleteLot,
    stats,
    getReservationDaysLeft,
    checkExpiredReservations
  };
}