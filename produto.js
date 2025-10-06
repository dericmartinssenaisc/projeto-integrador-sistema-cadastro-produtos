const { select, input, checkbox } = require('@inquirer/prompts');
const { NOMEM } = require('dns');
const fs = require('fs').promises;

let mensagem = "Bem vindo ao App de Cadastro de Produtos";
let produtos = [];

const carregarProdutos = async () => {
    try {
        const dados = await fs.readFile("produtos.json", "utf-8");
        produtos = JSON.parse(dados);
    } catch (erro) {
        produtos = [];
    }
}

const salvarProdutos = async () => {
    await fs.writeFile("produtos.json", JSON.stringify(produtos, null, 2));
}

const cadastrarProdutos = async () => {
    const nomeProduto = await input({ message: "Informe o nome do Produto:" });

    if (nomeProduto.length == 0) {
        mensagem = "O nome não pode está vazio"
        return;
    }

    const quantidadeProduto = await input({ message: "Informe a Quantidade:", default: 0 })

    if (quantidadeProduto.length == 0 || isNaN(quantidadeProduto) || parseInt(quantidadeProduto) < 0) {
        mensagem = "A quantidade deve ser um número não negativo"
    }

    const precoProduto = await input({ message: "Informe o Preço R$", default: 0 })

    if (precoProduto.length == 0 || isNaN(precoProduto) || parseInt(precoProduto) < 0) {
        mensagem = "A quantidade deve ser um número não negativo"
    }

    produtos.push({
        id: produtos.length + 1,
        nomeProduto: nomeProduto.trim().toUpperCase(),
        quantidadeProduto: parseInt(quantidadeProduto),
        precoProduto: parseFloat(precoProduto),
        dataCriacao: new Date().toLocaleString(),
        dataAtualizacao: new Date().toLocaleString()
    });

    mensagem = "Produto cadastrado com sucesso!!"


}

const listarProdutos = async () => {
    if (produtos.length == 0) {
        mensagem = "Não existem produtos cadastrados!";
        return;
    }

    const choices = produtos.map(produto => ({
        name: `${produto.nomeProduto} - Qdt: ${produto.quantidadeProduto} - R$ ${produto.precoProduto}`,
        value: produto.nomeProduto
    }));

    await select({
        message: `Produtos cadastrados: ${produtos.length}`,
        choices: [...choices]
    })

}

const buscarProduto = async () => {
    if (produtos.length == 0) {
        mensagem = "Não existem produtos cadastrados!";
        return;
    }

    
}



const mostrarMensagem = () => {
    console.clear();

    if (mensagem != "") {
        console.log(mensagem);
        console.log("");
        mensagem = "";
    }
}


const start = async () => {
    await carregarProdutos();

    while (true) {
        mostrarMensagem();
        await salvarProdutos();

        const opcao = await select({
            message: "Menu >",
            choices: [
                {
                    name: "Cadastrar Produto",
                    value: "cadastrar"
                },
                {
                    name: "Listar Produtos",
                    value: "listar"
                },
                {
                    name: "Buscar Produto",
                    value: "buscar"
                },
                {
                    name: "Atualizar Produto",
                    value: "atualizar"
                },
                {
                    name: "Deletar Produto",
                    value: "deletar"
                },
                {
                    name: "Sair",
                    value: "sair"
                }
            ]
        });

        switch (opcao) {
            case "cadastrar":
                await cadastrarProdutos();
                break;
            case "listar":
                await listarProdutos();
                break;
            case "buscar":
                console.log("Buscar Produto pelo nome")
                break;
            case "atualizar":
                console.log("Atualizar Produto")
                break;
            case "deletar":
                console.log("Deletar produto")
                break;
            case "sair":
                console.log('Até a próxima!');
                return;
        }
    }
}

start();
