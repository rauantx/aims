// Importa o framework Express para criar o servidor web
const express = require('express');
// Importa o cliente do Prisma para conectar com o banco de dados
const { PrismaClient } = require('@prisma/client');

//Chamada da biblioteca externa CORS
/*
CORS (Cross-Origin Resource Sharing) 
é um mecanismo de segurança dos navegadores
que controla quem pode acessar sua API.
*/
const cors = require('cors');

// Cria uma instância do Express (nosso servidor)
const app = express();
// Cria uma instância do Prisma (nosso banco de dados)
const prisma = new PrismaClient();

// Middlewares - funções que processam as requisições antes de chegar nas rotas
app.use(express.json()); // Permite receber dados no formato JSON
app.use(express.urlencoded({extended: true})); // Permite receber dados de formulários HTML
app.use(express.text()); // Permite receber texto puro

// ATIVA O CORS
app.use(cors());

// Rota POST - Criar aluno
app.post('/alunos', async (requisicao, resposta) => {
    try {
        // Prisma.create() - insere um novo registro no banco de dados
        // requisicao.body contém os dados enviados pelo cliente
        const novoAluno = await prisma.aluno.create({
            data: {
                email: requisicao.body.email,    // Pega o email do corpo da requisição
                nome: requisicao.body.nome,      // Pega o nome do corpo da requisição
                matricula: requisicao.body.matricula // Pega a matrícula do corpo da requisição
            }
        });
        
        // Envia resposta de sucesso com os dados do aluno criado
        resposta.json({
            message: "Cadastrado com sucesso",
            aluno: novoAluno
        });
    } catch (error) {
        // Se algo der errado, mostra o erro no console
        console.error(error);
        // Envia resposta de erro status 500 (erro interno do servidor)
        resposta.status(500).json({ error: 'Erro ao criar aluno' });
    }
});

// Rota GET - Listar todos os alunos
app.get('/alunos', async (requisicao, resposta) => {
    try {
        // findMany() - busca TODOS os registros da tabela aluno
        const todosAlunos = await prisma.aluno.findMany();
        // Envia a lista de alunos como resposta
        resposta.json(todosAlunos);
    } catch (error) {
        console.error(error);
        resposta.status(500).json({ error: 'Erro ao buscar alunos' + error });
    }
});

// Rota GET - Buscar aluno por ID específico
// :id significa que é um parâmetro na URL (ex: /aluno/1, /aluno/2, etc.)
app.get('/aluno/:id', async (requisicao, resposta) => {
    try {
        // requisicao.params.id - pega o valor do :id na URL
        // parseInt() - converte o texto para número inteiro
        const id = parseInt(requisicao.params.id);
        
        // findUnique() - busca UM ÚNICO registro que corresponde ao filtro
        const alunoSelecionado = await prisma.aluno.findUnique({
            where: { id } // Filtra pelo id (igual a: where: { id: id })
        });
        
        // Se não encontrar o aluno (retornou null)
        if (!alunoSelecionado) {
            // status(404) - "Não encontrado"
            return resposta.status(404).json({ error: 'Aluno não encontrado' });
        }
        
        // Se encontrou, envia os dados do aluno
        resposta.json(alunoSelecionado);
    } catch (error) {
        console.error(error);
        resposta.status(500).json({ error: 'Erro ao buscar aluno' });
    }
});

// Rota PUT - Atualizar aluno completo
app.put('/aluno/:id', async (requisicao, resposta) => {
    try {
        const id = parseInt(requisicao.params.id);
        
        // update() - atualiza um registro existente
        const alunoAtualizado = await prisma.aluno.update({
            where: { id }, // Encontra o aluno pelo id
            data: { // Dados que serão atualizados
                nome: requisicao.body.nome,
                email: requisicao.body.email,
                matricula: requisicao.body.matricula
            }
        });
        
        resposta.json({
            message: "Aluno atualizado com sucesso",
            aluno: alunoAtualizado
        });
    } catch (error) {
        console.error(error);
        // Código P2025 é erro do Prisma quando o registro não existe
        if (error.code === 'P2025') {
            return resposta.status(404).json({ error: 'Aluno não encontrado' });
        }
        resposta.status(500).json({ error: 'Erro ao atualizar aluno' });
    }
});

// Rota DELETE - Deletar aluno
app.delete('/aluno/:id', async (requisicao, resposta) => {
    try {
        const id = parseInt(requisicao.params.id);
        
        // delete() - remove um registro do banco de dados
        await prisma.aluno.delete({
            where: { id } // Remove o aluno com este id específico
        });
        
        resposta.json({ message: "Aluno deletado com sucesso" });
    } catch (error) {
        console.error(error);
        // Se tentar deletar um aluno que não existe
        if (error.code === 'P2025') {
            return resposta.status(404).json({ error: 'Aluno não encontrado' });
        }
        resposta.status(500).json({ error: 'Erro ao deletar aluno' });
    }
});

// Função para fechar a conexão com o banco de dados de forma segura
const gracefulShutdown = async () => {
    // $disconnect() - método do Prisma para fechar a conexão com o banco
    await prisma.$disconnect();
    process.exit(0); // Encerra o processo com sucesso (código 0)
};

// Event listeners - capturam sinais de encerramento do sistema
// SIGINT: quando pressiona Ctrl+C no terminal
// SIGTERM: quando o sistema pede para o programa encerrar
process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);

// Inicia o servidor na porta 3000
// listen() - faz o servidor "ouvir" e aguardar requisições
app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});

