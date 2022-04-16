const aws = require("aws-sdk");
const fs = require("fs");
const path = require("path");
const { promisify } = require("util");

module.exports = (app) => {
  const s3 = new aws.S3();
  /*Metodo que ira inserir os dados no banco*/
  /*   const salvarMidia = (req, res) => {
        const produtos = req.body;
        app.db("midia_digital")
            .insert(produtos)
            .then((_) => res.status(200).send("Sucesso."))
            .catch((err) => res.status(400).send(err));
    };*/
  const salvarMidia = (req, res) => {
      
    if (req.file.originalname === undefined || req.file.originalname === "") {
        console.log('vazio')
    }
      /*const {
        originalname: nome = "",
        key: chave = "",
        size = "",
        location: fundoUrl = "",
      } = req.file;

      const { descricao, status = 1 } = req.body;

      const dadosMidia = {
        descricao,
        fundoUrl,
        status,
        nome,
        chave,
        size,
      };

      if (process.env.STORAGE_TYPE === "local") {
        dadosMidia.fundoUrl = `${process.env.APP_URL}${chave}`;
      }
      app
        .db("midia_digital")
        .insert(dadosMidia)
        .then((_) => res.status(200).send("Sucesso."))
        .catch((err) => res.status(400).send(err));
    } else {
      const dadosMidia = {
        descricao,       
        status: 1
      };
    
      app
        .db("midia_digital")
        .insert(dadosMidia)
        .then((_) => res.status(200).send("Sucesso."))
        .catch((err) => res.status(400).send(err));
    }*/
  };

  const salvarMidiaProdutos = (req, res) => {
    const varios = req.body;
    varios.map((item) => {
      app
        .db("midia_digital_produtos")
        .insert([item])
        .then((_) => res.status(200).send("Sucesso."))
        .catch((error) => {
          if (error.code === "ER_DUP_ENTRY") {
            res.status(202).json({
              mensagem: "FALHA ao cadastrar os produtos na midia.",
            });
          }

          if (error.code === "ER_NO_REFERENCED_ROW_2") {
            res.status(202).json({
              mensagem: "FALHA produto informado não esta cadastrado.",
            });
          } else {
            res.status(500).json({
              mensagem: "FALHA ao cadastrar os produtos na midia.",
              error: error,
            });
          }
        });
    });
  };

  const listarMidia = async (req, res) => {
    try {
      const { page = 1 } = req.query;
      const limite = 6;
      const query = await app.db
        .select("*")
        .table("midia_digital")
        .orderBy("midia_digital.id")
        .limit(6)
        .offset((page - 1) * limite);

      const [count] = await app.db("midia_digital").count();
      const totalPage = Math.ceil(count["count(*)"] / limite);
      const pageAtual = parseInt(page);

      res.json({
        Total: count["count(*)"],
        Paginas: totalPage,
        PaginaAtual: pageAtual,
        midia: query,
      });
    } catch (error) {
      res.json({
        mensagem: "Verifique, ocorreu erro ao listarMidia os dados",
        motivo: error,
      });
    }
  };

  const listarMidiaProdutos = async (req, res) => {
    try {
      const { page = 1, limite = 12, midia } = req.query;

      if (midia === undefined || midia === null || midia === "")
        return res.status(202).send({ error: "Midia não informada." });

      const query = await app.db
        .select(
          "midia_digital.descricao",
          "produtos.descricao as produto",
          "produtos_valores.preco as preco",
          "produtos_fotos.url"
        )
        .table("midia_digital_produtos")
        .join("midia_digital", "midia_digital.id", "=", "midiaId")
        .join("produtos", "produtos.id", "=", "produtosId")
        .join(
          "produtos_valores",
          "produtos_valores.produtosId",
          "=",
          "produtos.id"
        )
        .leftJoin(
          "produtos_fotos",
          "produtos_fotos.produtosId",
          "=",
          "produtos.id"
        )
        .where({ midiaId: midia })
        .where("midia_digital_produtos.produtosId", "!=", "")
        .limit(limite)
        .offset((page - 1) * limite);

      const [count] = await app
        .db("midia_digital_produtos")
        .count()
        .where("midia_digital_produtos.produtosId", "!=", "");
      const totalPage = Math.ceil(count["count(*)"] / limite);
      const pageAtual = parseInt(page);

      res.json({
        Total: count["count(*)"],
        Paginas: totalPage,
        PaginaAtual: pageAtual,
        midiaProdutos: query,
      });
    } catch (error) {
      res.json({
        mensagem: "Verifique, ocorreu erro ao listarMidiaProdutos os dados",
        motivo: error,
      });
    }
  };

  const midiaAtualizar = (req, res) => {
    const id = req.params.id;
    const {
      originalname: nome,
      key: chave,
      size,
      location: fundoUrl = "",
    } = req.file;
    const { descricao, status = 1 } = req.body;

    const dadosMidia = {
      descricao,
      fundoUrl,
      status,
      nome,
      chave,
      size,
    };

    if (descricao === undefined || descricao === null || descricao === "")
      return res.status(202).send({ error: "Descrição - Campo obrigatório" });

    if (fundoUrl === undefined || fundoUrl === null || fundoUrl === "")
      return res.status(202).send({ error: "fundoUrl - Campo obrigatório" });

    if (status === undefined || status === null || status === "")
      return res.status(202).send({ error: "Status - Campo obrigatório" });

    app
      .db("midia_digital")
      .where({ id: id })
      .update(dadosMidia)
      .then((_) => {
        res.status(200).send("Sucesso.");
      })
      .catch((err) => {
        res.status(400).json({
          mensagem: "Verifique as informações. ",
          motivo: err.sqlMessage,
        });
      });
  };

  const deletar = async (req, res) => {
    const id = req.params.id;
    const { key } = req.query;

    if (process.env.STORAGE_TYPE === "s3") {
      const result = await app.db("midia_digital").where("id", id).del();
      if (result === 1) {
        s3.deleteObject({
          Bucket: "saci-web",
          Key: key,
        }).promise();
        res.status(200).send("Sucesso.");
      } else {
        res.status(500).send("Falha ao deletar registro.");
      }
    } else {
      const result = await app.db("midia_digital").where("id", id).del();

      if (result === 1) {
        promisify(fs.unlink)(
          path.resolve(__dirname, "..", "temp", "upload", key)
        );
        res.status(200).send("Sucesso.");
      } else {
        res.status(500).send("Falha ao deletar registro.");
      }
    }
  };

  const midiaProdutosatualizar = (req, res) => {
    const id = req.params.id;
    const { midiaId, produtoFotoId } = req.body;

    if (midiaId === undefined || midiaId === null || midiaId === "")
      return res.status(202).send({ error: "midiaId - Campo obrigatório" });

    if (
      produtoFotoId === undefined ||
      produtoFotoId === null ||
      produtoFotoId === ""
    )
      return res
        .status(202)
        .send({ error: "produtoFotoId - Campo obrigatório" });

    app
      .db("midia_digital_produtos")
      .where({ id: id })
      .update({ midiaId, produtoFotoId })
      .then((_) => {
        res.status(200).send("Sucesso.");
      })
      .catch((err) => {
        res.status(400).json({
          mensagem: "Verifique as informações. ",
          motivo: err.sqlMessage,
        });
      });
  };

  return {
    salvarMidia,
    salvarMidiaProdutos,
    midiaAtualizar,
    midiaProdutosatualizar,
    listarMidia,
    listarMidiaProdutos,
    deletar,
  };
};
