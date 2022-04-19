const { json } = require("body-parser");
const { response } = require("express");

module.exports = (app) => {
  /*RESPONSAVEL POR CARREGAR OS DADOS DO PRODUTO*/
  const listar = (req, res) => {
    app
      .db("produtos")
      .join("produtos_valores", "produtos_valores.produtoId", "produtos.Id")
      .then((produtos) => {
        if (produtos) {
          res.status(200).send(produtos.reverse());
        }
      })
      .catch((err) => {
        if (err) {
          res.status(400).send("Algo de errado aconteceu.", err);
        }
      });
  };

  const listarFotos = async (req, res) => {
    try {
      const { page = 1 } = req.query;
      const limite = 10;
      const query = await app.db
        .select(
          "produtos_fotos.id as id",
          "produtos.id as codigo",
          "produtos.descricao as descricao",
          "url"
        )
        .table("produtos_fotos")
        .join("produtos", "produtos.id", "=", "produtosId")
        .limit(10)
        .offset((page - 1) * limite);

      const [count] = await app.db("produtos_fotos").count();
      const totalPage = Math.ceil(count["count(*)"] / limite);
      const pageAtual = parseInt(page);
      res.json({
        Total: count["count(*)"],
        Paginas: totalPage,
        PaginaAtual: pageAtual,
        Fotos: query,
      });
    } catch (error) {
      console.log(error);
    }
  };

  /*RESPONSAVEL POR SALVAR OS DADOS DO PRODUTO*/
  const salvar = async (req, res) => {
    try {
      const {
        descricao,
        secaoId,
        grupoId,
        subGrupoId,
        status,
        preco,
        estoque,
        custoNota,
        custoReposicao,
        custoContabil,
        lojaId,
        url,
      } = req.body;

      const dadosProdutos = {
        descricao,
        secaoId,
        grupoId,
        subGrupoId,
        status,
      };

      const id = await app.db("produtos").insert(dadosProdutos);
      const dadosPreco = {
        preco,
        estoque,
        custoNota,
        custoReposicao,
        custoContabil,
        produtosId: id[0],
        lojaId,
        status,
      };

      const dadosFoto = {
        url,
        produtosId: id[0],
      };

      if (id) {
        app
          .db("produtos_valores")
          .insert(dadosPreco)
          .then((_) => res.status(200).send("Sucesso."))
          .catch((err) =>
            res.status(500).json({
              error: "Falha ao registrar o valores .",
              codigo: err,
            })
          );

        if (url) {
          app
            .db("produtos_fotos")
            .insert(dadosFoto)
            .then((_) => res.status(200).json({ sucesso: "Sucesso." }))
            .catch((err) => res.status(400).json({ error: err }));
        }
      } else {
        res.status(500).send("ERROR: Dados não registrado, verifique o ID.");
      }
    } catch (error) {
      res.status(500).json({
        mensagem: "ERROR: Dados não registrado, verifique o ID.",
        error: error,
      });      
    }
  };

  const salvarProdutoValores = (req, res) => {
    const produtos = req.body;
    /*app.db("produto_valores")
            .insert(produtos)
            .then((_) => res.status(200).send("Sucesso."))
            .catch((err) => res.status(400).send(err));*/
  };

  const salvarOferta = (req, res) => {
    const oferta = req.body;
    app
      .db("oferta")
      .insert(oferta)
      .then((_) => res.status(200).send("Sucesso."))
      .catch((err) => res.status(400).send(err));
  };

  const salvarOfertaItems = (req, res) => {
    const ofertaItem = req.body;
    app
      .db("oferta_item")
      .insert(ofertaItem)
      .then((_) => res.status(200).send("Sucesso."))
      .catch((err) => res.status(400).send(err));
  };

  const salvarFoto = (req, res) => {
    const registro = req.body;
    app
      .db("produtos_fotos")
      .insert(registro)
      .then((_) => res.status(200).send("Sucesso."))
      .catch((err) => res.status(400).send(err));
  };

  const atualizar = (req, res) => {
    const codigo = req.params.id;
    const produtos = req.body;
    //console.log('Produots: ',produtos)

    app
      .db("produtos")
      .where({ codigo: codigo })
      .update(produtos)
      .then((_) => {
        res.status(200).send("Sucesso.");
      })
      .catch((err) => {
        res.status(400).send("Verifique as informações. ", err);
      });
  };

  const atualizarOferta = (req, res) => {
    const id = req.params.id;
    const oferta = req.body;

    app
      .db("oferta")
      .where({ id: id })
      .update(oferta)
      .then((_) => {
        res.status(200).send("Sucesso.");
      })
      .catch((err) => {
        res.status(400).send("Verifique as informações. ", err);
      });
  };

  const atualizarImg = (req, res) => {
    const { codigo, url } = req.query;
    const registro = req.body;

    app
      .db("produtos_fotos")
      .where({ produtoId: codigo })
      .where({ url: url })
      .update(registro)
      .then((response) => {
        if (response > 0) {
          return res.status(200).send("Sucesso.");
        } else {
          return res.status(500).json({
            mensagem:
              "ERRO AO SALVAR O REGISTRO: Verifique os dados passado pelo paramentro.",
          });
        }
      })
      .catch((err) => {
        return res.status(500);
      });
  };

  /*RESPONSAVEL PELA PAGINAÇÃO DOS PRODUTOS*/
  const listaTodosComPagina = async (req, res) => {
    try {
      const { page = 1 } = req.query;
      const limite = 10;
      const query = await app.db
        .select(
          "produtos.id",
          "produtos.descricao",
          "secao.descricao as secao",
          "grupo.descricao as grupo",
          "subGrupo.descricao as subGrupo",
          "produtos_valores.custoNota",
          "produtos_valores.custoReposicao",
          "produtos_valores.custoContabil",
          "produtos_valores.preco",
          "produtos_valores.estoque"
        )
        .table("produtos")        
        .join("produtos_valores", "produtos_valores.produtosId", "produtos.Id")
        .join("secao", "secao.id", "produtos.secaoId")
        .join("grupo", "grupo.id", "produtos.grupoId")
        .join("subGrupo", "subGrupo.id", "produtos.subGrupoId")
        .limit(limite)
        .offset((page - 1) * limite);

      const [count] = await app.db("produtos").count();
      const totalPage = Math.ceil(count["count(*)"] / limite);
      const pageAtual = parseInt(page);
      res.json({
        Total: count["count(*)"],
        Paginas: totalPage,
        PaginaAtual: pageAtual,
        Produtos: query,
      });
    } catch (error) {
      console.log(error);
    }
  };

  /*RESPONSAVEL PELA PAGINAÇÃO DOS PRODUTOS*/
  const listaProdutosEmOfertaItens = async (req, res) => {
    try {
      const { page = 1, limite = 12 } = req.query;
      const query = await app.db
        .select(
          "produtos.id as codigo",
          "produtos.descricao as  descricao",
          "oferta.dataInicial as dataInicial",
          "oferta_item.precoOferta as preco",
          "oferta.dataFinal as dataFinal",
          "produtos_fotos.url as url"
        )
        .table("oferta_item")
        .join("oferta", "ofertaId", "=", "oferta.id")
        .join("produtos", "produtosId", "=", "produtos.id")
        .leftJoin(
          "produtos_fotos",
          "produtos_fotos.produtosId",
          "=",
          "oferta_item.produtosId"
        )

        .where("oferta_item.produtosId", "!=", "")
        .limit(limite)
        .offset((page - 1) * limite);

      const [count] = await app.db("oferta_item").count();
      const totalPage = Math.ceil(count["count(*)"] / limite);
      const pageAtual = parseInt(page);
      res.json({
        Total: count["count(*)"],
        Paginas: totalPage,
        PaginaAtual: pageAtual,
        Oferta: query,
      });
    } catch (error) {
      console.log(error);
    }
  };
  /*RESPONSAVEL PELA PAGINAÇÃO DOS PRODUTOS*/
  const listaProdutosEmOferta = async (req, res) => {
    try {
      const { page = 1 } = req.query;
      const limite = 6;
      const query = await app
        .db("oferta")
        .limit(limite)
        .offset((page - 1) * limite);

      const [count] = await app.db("oferta").count();
      const totalPage = Math.ceil(count["count(*)"] / limite);
      const pageAtual = parseInt(page);
      res.json({
        Total: count["count(*)"],
        Paginas: totalPage,
        PaginaAtual: pageAtual,
        Produtos: query,
      });
    } catch (error) {
      console.log(error);
    }
  };

  /*RESPONSAVEL POR VERIFICAR SE EXISTE NAS LOJAS*/

  /*RESPONSAVEL POR VERIFICAR SE EXISTE NAS LOJAS*/
  const filtrar_PRODUTOSCASTRADOS = async (req, res) => {
    //const  codigo = req.params.id;
    const { id, descricao, marca, referencia, ean } = req.query;

    try {
      if (id) {
        const result = await app.db
          .select(
            "produtos.id",
            "produtos.descricao",
            "secao.descricao as secao",
            "grupo.descricao as grupo",
            "subGrupo.descricao as subGrupo",
            "produtos_valores.custoNota",
            "produtos_valores.custoReposicao",
            "produtos_valores.custoContabil",
            "produtos_valores.preco",
            "produtos_valores.estoque"
          )
          .table("produtos")
          .where("produtos.id", "=", id)
          .join(
            "produtos_valores",
            "produtos_valores.produtosId",
            "produtos.Id"
          )
          .join("secao", "secao.id", "produtos.secaoId")
          .join("grupo", "grupo.id", "produtos.grupoId")
          .join("subGrupo", "subGrupo.id", "produtos.subGrupoId");

        if (result.length > 0) {
          res.json(result);
        } else {
          res.json({ mensagem: "Produto não encontrado." });
        }
      }

      if (descricao) {
        const result = await app.db
          .select(
            "produtos.id",
            "produtos.descricao",
            "secao.descricao as secao",
            "grupo.descricao as grupo",
            "subGrupo.descricao as subGrupo",
            "produtos_valores.custoNota",
            "produtos_valores.custoReposicao",
            "produtos_valores.custoContabil",
            "produtos_valores.preco",
            "produtos_valores.estoque"
          )
          .table("produtos")
          .where("produtos.descricao", "like", `%${descricao}%`)
          .join(
            "produtos_valores",
            "produtos_valores.produtosId",
            "produtos.Id"
          )
          .join("secao", "secao.id", "produtos.secaoId")
          .join("grupo", "grupo.id", "produtos.grupoId")
          .join("subGrupo", "subGrupo.id", "produtos.subGrupoId");

        if (result.length > 0) {
          res.json(result);
        } else {
          res.json({ mensagem: "Produto não encontrado." });
        }
      }
    } catch (error) {
      res.status(500).send({ error: "Falha ao consultar produtos", error });
    }
  };

  /*RESPONSAVEL POR VERIFICAR SE EXISTE NAS LOJAS*/
  const listarSelect = (req, res) => {
    const codigo = req.params.id;

    app.db
      .select(
        "produtosxloja.id",
        "produtos.codigo as codigoProduto",
        "produtos.descricao",
        "produtos.marca",
        "produtos.ean",
        "produtos.referencia",
        "estoque",
        "produtosxloja.ultCusto",
        "valores",
        "loja.codigo as loja"
      )
      .table("produtosxloja")
      .join("produtos", "produtos.codigo", "produtosxloja.produtosFk")
      .join("loja", "loja.id", "produtosxloja.lojaFk")
      .where("produtos.codigo", codigo)
      .then((produtos) => {
        if (produtos) {
          res.send(produtos);
        }
      })
      .catch((err) => res.status(400).send(err));
  };

  /*RESPONSAVEL POR VERIFICAR AS ULTIMAS COMPRAS*/
  const listaUltCompra = (req, res) => {
    const codigo = req.params.id;

    app.db
      .select(
        "fornecedor.razaoSocial as fornecedor",
        app.db.raw('DATE_FORMAT(dtEntrada, "%d/%m/%Y") as dtEntrada'),
        "docsEntrada as documento",
        "produtosxcompras.qtd",
        "custoNota",
        "custoReposicao",
        "loja.codigo as loja"
      )
      .table("produtosxcompras")
      .join("produtos", "produtos.codigo", "produtosxcompras.produtosFk")
      .join("fornecedor", "fornecedor.id", "produtosxcompras.fornecedorFk")
      .join("loja", "loja.id", "produtosxcompras.lojaFk")
      .where("produtos.codigo", codigo)
      .orderBy(app.db.raw('DATE_FORMAT(dtEntrada, "%Y-%m-%d")'), "desc")
      .limit(10)
      .then((produtos) => {
        if (produtos) {
          res.send(produtos);
        }
      })
      .catch((err) => res.status(400).send(err));
  };

  /*PERMISSAO DO USUARIO*/
  const permissao = (req, res) => {
    const codigo = req.params.id;

    app.db
      .select(
        "usuariosxpermissoes.id",
        "usuarios.id as IdUser",
        "usuarios.email",
        "permissao.descricao"
      )
      .table("usuariosxpermissoes")
      .join("usuarios", "usuarios.id", "usuariosxpermissoes.usuarioFk")
      .join("permissao", "permissao.id", "usuariosxpermissoes.permissaoFK")
      .where("usuarios.email", codigo)
      .then((permissao) => {
        if (permissao) {
          res.send(permissao);
        }
      })
      .catch((err) => res.status(400).send(err));
  };

  /*RESPONSAVEL POR CONSULTA PRODUTO PELO CODIGO*/
  const consultarCodigo = (req, res) => {
    const codigo = req.params.id;
    app.db
      .select("")
      .table("produtos")
      .where("produtos.codigo", codigo)
      .then((produtos) => {
        if (produtos) {
          res.send(produtos);
        }
      })
      .catch((err) => res.status(400).send(err));
  };

  const imagemProdutos = (req, res) => {
    const codigo = req.params.id;

    app.db
      .select("imgProdutos.url")
      .table("imgProdutos")
      .join("produtos", "produtos.codigo", "imgProdutos.produtosFK")
      .where("imgProdutos.produtosFK", codigo)
      .then((produtos) => {
        if (produtos) {
          //console.log( JSON.stringify(produtos))
          res.send(produtos);
        }
      })
      .catch((err) => res.status(400).send(err));
  };

  const imagemProdutosTodos = (req, res) => {
    const codigo = req.params.id;

    app.db
      .select("imgProdutos.url")
      .table("imgProdutos")
      .join("produtos", "produtos.codigo", "imgProdutos.produtosFK")
      .then((produtos) => {
        if (produtos) {
          //console.log( JSON.stringify(produtos))
          res.send(produtos);
        }
      })
      .catch((err) => res.status(400).send(err));
  };

  return {
    listar,
    listarFotos,
    listaProdutosEmOferta,
    listaProdutosEmOfertaItens,
    salvar,
    salvarProdutoValores,
    salvarFoto,
    salvarOferta,
    salvarOfertaItems,
    atualizar,
    atualizarImg,
    atualizarOferta,
    consultarCodigo,
    listaTodosComPagina,
    listarSelect,
    permissao,
    filtrar_PRODUTOSCASTRADOS,
    imagemProdutos,
    imagemProdutosTodos,
    listaUltCompra,
  };
};
