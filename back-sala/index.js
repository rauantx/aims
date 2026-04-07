const express = require("express");
const { PrismaClient } = require("@prisma/client");
const cors = require("cors");

const app = express();
const prisma = new PrismaClient();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.text());
app.use(cors());

/*
========================================
ROTA DE TESTE
========================================
*/
app.get("/", (req, res) => {
  res.json({ message: "API do projeto AIMS funcionando" });
});

/*
========================================
LOGIN
========================================
*/
app.post("/login", async (req, res) => {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({
        error: "Email e senha são obrigatórios",
      });
    }

    const usuario = await prisma.usuario.findUnique({
      where: { email },
    });

    if (!usuario || usuario.senha !== senha) {
      return res.status(401).json({
        error: "Email ou senha inválidos",
      });
    }

    res.json({
      message: "Login realizado com sucesso",
      usuario: {
        id: usuario.id,
        email: usuario.email,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao realizar login" });
  }
});

/*
========================================
ROTAS DE MOTOS
========================================
*/

// Criar moto
app.post("/motos", async (req, res) => {
  try {
    const { nome, marca, preco, imagem } = req.body;

    if (!nome || !marca || preco === undefined) {
      return res.status(400).json({
        error: "Nome, marca e preço são obrigatórios",
      });
    }

    const novaMoto = await prisma.moto.create({
      data: {
        nome,
        marca,
        preco: Number(preco),
        imagem,
      },
    });

    res.status(201).json({
      message: "Moto cadastrada com sucesso",
      moto: novaMoto,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao criar moto" });
  }
});

// Listar motos
app.get("/motos", async (req, res) => {
  try {
    const motos = await prisma.moto.findMany();
    res.json(motos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar motos" });
  }
});

// Buscar moto por ID
app.get("/motos/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    const moto = await prisma.moto.findUnique({
      where: { id },
    });

    if (!moto) {
      return res.status(404).json({ error: "Moto não encontrada" });
    }

    res.json(moto);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar moto" });
  }
});

// Atualizar moto
app.put("/motos/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { nome, marca, preco, imagem } = req.body;

    const motoAtualizada = await prisma.moto.update({
      where: { id },
      data: {
        nome,
        marca,
        preco: preco !== undefined ? Number(preco) : undefined,
        imagem,
      },
    });

    res.json({
      message: "Moto atualizada com sucesso",
      moto: motoAtualizada,
    });
  } catch (error) {
    console.error(error);

    if (error.code === "P2025") {
      return res.status(404).json({ error: "Moto não encontrada" });
    }

    res.status(500).json({ error: "Erro ao atualizar moto" });
  }
});

// Deletar moto
app.delete("/motos/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    await prisma.moto.delete({
      where: { id },
    });

    res.json({ message: "Moto deletada com sucesso" });
  } catch (error) {
    console.error(error);

    if (error.code === "P2025") {
      return res.status(404).json({ error: "Moto não encontrada" });
    }

    res.status(500).json({ error: "Erro ao deletar moto" });
  }
});

/*
========================================
ROTAS DE USUÁRIOS
========================================
*/

// Criar usuário
app.post("/usuarios", async (req, res) => {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({
        error: "Email e senha são obrigatórios",
      });
    }

    const novoUsuario = await prisma.usuario.create({
      data: {
        email,
        senha,
      },
    });

    res.status(201).json({
      message: "Usuário criado com sucesso",
      usuario: novoUsuario,
    });
  } catch (error) {
    console.error(error);

    if (error.code === "P2002") {
      return res.status(400).json({ error: "Email já cadastrado" });
    }

    res.status(500).json({ error: "Erro ao criar usuário" });
  }
});

// Listar usuários
app.get("/usuarios", async (req, res) => {
  try {
    const usuarios = await prisma.usuario.findMany();
    res.json(usuarios);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar usuários" });
  }
});

/*
========================================
ROTAS DE COMPRAS
========================================
*/

// Criar compra
app.post("/compras", async (req, res) => {
  try {
    const { usuarioId, motoId, formaPagamento } = req.body;

    if (!usuarioId || !motoId || !formaPagamento) {
      return res.status(400).json({
        error: "usuarioId, motoId e formaPagamento são obrigatórios",
      });
    }

    const compra = await prisma.compra.create({
      data: {
        usuarioId: Number(usuarioId),
        motoId: Number(motoId),
        formaPagamento,
      },
    });

    res.status(201).json({
      message: "Compra registrada com sucesso",
      compra,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao registrar compra" });
  }
});

// Listar compras
app.get("/compras", async (req, res) => {
  try {
    const compras = await prisma.compra.findMany({
      include: {
        usuario: true,
        moto: true,
      },
    });

    res.json(compras);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar compras" });
  }
});

// Buscar compra por ID
app.get("/compras/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    const compra = await prisma.compra.findUnique({
      where: { id },
      include: {
        usuario: true,
        moto: true,
      },
    });

    if (!compra) {
      return res.status(404).json({ error: "Compra não encontrada" });
    }

    res.json(compra);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar compra" });
  }
});

/*
========================================
ENCERRAMENTO SEGURO
========================================
*/
const gracefulShutdown = async () => {
  await prisma.$disconnect();
  process.exit(0);
};

process.on("SIGINT", gracefulShutdown);
process.on("SIGTERM", gracefulShutdown);

app.listen(3000, () => {
  console.log("Servidor rodando na porta 3000");
});
