
        /*
            async (Assíncrono): 
            Colocado antes da declaração de uma função, 
            transforma-a automaticamente em uma função assíncrona, 
            que sempre retorna uma Promise.

            As promises em JavaScript representam processos que já estão acontecendo
            
            await (Aguardar): 
            Utilizado apenas dentro de funções async antes de uma Promise. 
            Ele pausa a execução da função até que a Promise seja resolvida, 
            retornando o resultado final.
        */

        const URL = "http://localhost:3000";

        async function buscarAlunos(){
            try{
               const resposta = await fetch(URL + "/alunos");
               const dados = await resposta.json();
               console.log(dados);
               return dados;

            }catch(error){
                alert(error);
            }

        }

        buscarAlunos();        


        async function cadastrarAluno(){
            try{
                const resposta = await fetch(URL + '/alunos', {
                    method: 'POST',
                    headers: {'Content-type': 'application/json'},
                    body: JSON.stringify({
                        nome: "asasadasdasda Matheus",
                        idade: "223",
                        email: "21aaaaaaaa@gmail.com",
                        matricula: "21111"
                    })
                });

                const dados = await resposta.json();
                console.log("dados criados", dados);
                buscarAlunos();
                return dados;

            } catch(error){
                console.log("Erro ao criar produto: " + error);
            }
        }

        cadastrarAluno();



        async function updateAluno(id) {
            try {
                const response = await fetch(`${URL}/aluno/${id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                            nome: "FFFasda Matheus",
                            idade: "1223",
                            email: "121aaaaaaaa@gmail.com",
                            matricula: "121111"
                    })
                });
                
                const updated = await response.json();
                console.log('Aluno atualizado:', updated);

            } catch (error) {
                console.error('Erro ao atualizar:', error);
            }
        }
        //updateAluno(4);



        async function deleteAluno(id) {
            try {
                const response = await fetch(`${URL}/aluno/${id}`, {
                    method: 'DELETE'
                });
                
                const result = await response.json();
                console.log('Produto deletado:', result);
            } catch (error) {
                console.error('Erro ao deletar:', error);
            }
        }
        //deleteAluno(9);

