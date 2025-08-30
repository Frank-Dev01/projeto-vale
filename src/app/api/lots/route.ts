import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

interface LotData {
  empreendimento: string;
  quadra: string;
  lote: string;
  valor: number;
  status: 'DISPONÍVEL' | 'RESERVADO';
}

export async function GET(request: NextRequest) {
  try {
    // Extrair parâmetros da query string
    const { searchParams } = new URL(request.url);
    
    // Parâmetros de filtro
    const status = searchParams.get('status')?.toUpperCase() as 'DISPONÍVEL' | 'RESERVADO' | undefined;
    const empreendimento = searchParams.get('empreendimento')?.trim();
    const quadra = searchParams.get('quadra')?.trim();
    const lote = searchParams.get('lote')?.trim();
    
    // Validação dos parâmetros de entrada
    if (status && !['DISPONÍVEL', 'RESERVADO'].includes(status)) {
      return NextResponse.json(
        { error: 'Parâmetro "status" inválido. Use "DISPONÍVEL" ou "RESERVADO"' },
        { status: 400 }
      );
    }
    
    // Validar tamanho dos parâmetros para prevenir ataques
    const maxLength = 100;
    if (empreendimento && empreendimento.length > maxLength) {
      return NextResponse.json(
        { error: 'Parâmetro "empreendimento" muito longo' },
        { status: 400 }
      );
    }
    
    if (quadra && quadra.length > maxLength) {
      return NextResponse.json(
        { error: 'Parâmetro "quadra" muito longo' },
        { status: 400 }
      );
    }
    
    if (lote && lote.length > maxLength) {
      return NextResponse.json(
        { error: 'Parâmetro "lote" muito longo' },
        { status: 400 }
      );
    }
    
    // Inicializar Prisma Client
    const prisma = new PrismaClient();
    
    // Construir a query WHERE dinamicamente
    let whereClause: any = {};
    
    if (status) {
      whereClause.status = status;
    }
    
    if (empreendimento) {
      whereClause.empreendimento = {
        contains: empreendimento,
        mode: 'insensitive' as const
      };
    }
    
    if (quadra) {
      whereClause.quadra = {
        contains: quadra,
        mode: 'insensitive' as const
      };
    }
    
    if (lote) {
      whereClause.lote = {
        contains: lote,
        mode: 'insensitive' as const
      };
    }
    
    // Buscar lotes no banco de dados com os filtros
    let lots: any[] = [];
    try {
      lots = await prisma.lote.findMany({
        where: whereClause,
        select: {
          empreendimento: true,
          quadra: true,
          lote: true,
          valor: true,
          status: true
        },
        orderBy: [
          { empreendimento: 'asc' },
          { quadra: 'asc' },
          { lote: 'asc' }
        ],
        // Limitar resultados para prevenir sobrecarga
        take: 1000
      });
    } catch (dbError) {
      console.error('Erro ao consultar banco de dados:', dbError);
      // Retornar array vazio em caso de erro na consulta
      lots = [];
    } finally {
      await prisma.$disconnect();
    }
    
    // Formatar os dados de resposta
    const formattedData: LotData[] = lots.map(lot => ({
      empreendimento: lot.empreendimento || '',
      quadra: lot.quadra || '',
      lote: lot.lote || '',
      valor: Number(lot.valor) || 0,
      status: (lot.status as 'DISPONÍVEL' | 'RESERVADO') || 'DISPONÍVEL'
    }));
    
    // Adicionar headers de segurança
    const response = NextResponse.json({
      data: formattedData,
      metadata: {
        total: formattedData.length,
        filters: {
          status: status || 'TODOS',
          empreendimento: empreendimento || 'TODOS',
          quadra: quadra || 'TODOS',
          lote: lote || 'TODOS'
        },
        timestamp: new Date().toISOString()
      }
    });
    
    // Headers de segurança
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-XSS-Protection', '1; mode=block');
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    
    return response;
    
  } catch (error) {
    console.error('Erro na API de lotes:', error);
    
    // Retornar erro genérico para não expor detalhes internos
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}