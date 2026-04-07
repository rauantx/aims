# trabalho-lab-software

# API AIMS

## Base URL

http://localhost:3000

## POST /login

Body:
{
"email": "string",
"senha": "string"
}

Resposta:
{
"message": "Login realizado com sucesso",
"usuario": {
"id": 1,
"email": "teste@gmail.com"
}
}

## GET /motos

Retorna lista de motos

## POST /compras

Body:
{
"usuarioId": 1,
"motoId": 1,
"formaPagamento": "pix"
}
