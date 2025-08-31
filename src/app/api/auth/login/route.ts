import { NextRequest, NextResponse } from "next/server";

// Hardcoded users for demonstration
// In a real application, this would come from a database
const users = [
  {
    id: "admin-1",
    identifier: "12345", // CRECI
    password: "123456",
    role: "admin" as const,
    name: "Administrador"
  },
  {
    id: "user-1",
    identifier: "joao.silva@email.com", // Email
    password: "123456",
    role: "user" as const,
    name: "João Silva"
  },
  {
    id: "user-2",
    identifier: "maria.santos@email.com", // Email
    password: "123456",
    role: "user" as const,
    name: "Maria Santos"
  }
];

export async function POST(request: NextRequest) {
  try {
    const { identifier, password } = await request.json();

    if (!identifier || !password) {
      return NextResponse.json(
        { error: "Identificador e senha são obrigatórios" },
        { status: 400 }
      );
    }

    // Find user by identifier (could be CRECI or email)
    const user = users.find(u => u.identifier === identifier);

    if (!user) {
      return NextResponse.json(
        { error: "Usuário não encontrado" },
        { status: 401 }
      );
    }

    if (user.password !== password) {
      return NextResponse.json(
        { error: "Senha incorreta" },
        { status: 401 }
      );
    }

    // Return user data without password
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json({
      user: userWithoutPassword,
      message: "Login realizado com sucesso"
    });

  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}