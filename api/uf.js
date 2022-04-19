module.exports = (app) => {
  //CADASTRAR UF
  const cadastrar_UF = async (req, res) => {
    try {
      await app.db.transaction(async (trans) => {
        await app.db("uf").transacting(trans).insert(req.body);
        res.status(200).send({
          sucesso: "UF cadastrada com sucesso.",
        });
      });
    } catch (err) {
      res.status(500).send({
        error: "FALHA ao cadsatrar UF.",
        motivo: err,
      });
    }
  };

  //CADASTRAR PAIS
  const cadastrar_PAIS = async (req, res) => {
    try {
      await app.db.transaction(async (trans) => {
        await app.db("pais").transacting(trans).insert(req.body);
        res.status(200).send({
          sucesso: "PAIS cadastrada com sucesso.",
        });
      });
    } catch (err) {
      res.status(500).send({
        error: "FALHA ao cadsatrar PAIS.",
        motivo: err,
      });
    }
  };

  //CADASTRAR PAIS
  const cadastrar_MUNICIPIO = async (req, res) => {
    try {
      const codigo = req.params.id;
      const resultUf = await app.db
        .select("*")
        .table("uf")
        .where({ codigoIBGE: codigo });

      const dadosMunicipio = {
        nome: req.body.nome,
        codigoIBGE: req.body.codigoIBGE,
        ufId: resultUf[0].id,
      };

      if (resultUf.length > 0) {
        await app.db.transaction(async (trans) => {
          await app.db("municipio").transacting(trans).insert(dadosMunicipio);
          res.status(200).send({
            sucesso: "MUNICIPIO cadastrada com sucesso.",
          });
        });
      } else {
        res.status(202).send({
          error: "UF não localizada.",
          motivo: err,
        });
      }
    } catch (err) {
      res.status(500).send({
        error: "FALHA ao cadsatrar MUNICIPIO.",
        motivo: err,
      });
    }
  };

  //LISTAR UF
  /*
  const listar_UF = async (req, res) => {
    try {
      const { page = 1, limite = 12 } = req.query;

      const query = await app.db
        .select("*")
        .table("uf")
        .limit(limite)
        .offset((page - 1) * limite);

      const [count] = await app.db("uf").count();
      const totalPage = Math.ceil(count["count(*)"] / limite);
      const pageAtual = parseInt(page);

      res.json({
        Total: count["count(*)"],
        Paginas: totalPage,
        PaginaAtual: pageAtual,
        UF: query,
      });
    } catch (error) {
      res.json({
        mensagem: "Verifique, ocorreu erro ao UF os dados",
        motivo: error,
      });
    }
  };*/

  const listar_UF = async (req, res) => {
    try {
      const query = await app.db.select("*").table("uf");

      res.json(query);
    } catch (error) {
      res.json({
        mensagem: "Verifique, ocorreu erro ao UF os dados",
        motivo: error,
      });
    }
  };

  //LISTAR PAIS
  const listar_PAIS = async (req, res) => {
    try {
      const { page = 1, limite = 12 } = req.query;

      const query = await app.db
        .select("*")
        .table("pais")
        .limit(limite)
        .offset((page - 1) * limite);

      const [count] = await app.db("pais").count();
      const totalPage = Math.ceil(count["count(*)"] / limite);
      const pageAtual = parseInt(page);

      res.json({
        Total: count["count(*)"],
        Paginas: totalPage,
        PaginaAtual: pageAtual,
        PAIS: query,
      });
    } catch (error) {
      res.json({
        mensagem: "Verifique, ocorreu erro ao PAIS os dados",
        motivo: error,
      });
    }
  };
  //LISTAR MUNICIPIO
  const listar_MUNICIPIO = async (req, res) => {
    try {
      const query = await app.db.select("*").table("municipio");
      res.json(query);
    } catch (error) {
      res.json({
        mensagem: "Verifique, ocorreu erro ao MUNICIPIO os dados",
        motivo: error,
      });
    }
  };

  //LISTAR MUNICIPIO
  const filtrar_MUNICIPIO = async (req, res) => {
    try {
      const idM = req.params.id;
      const query = await app.db
        .select("municipio.id", "municipio.nome", "municipio.codigoIBGE")
        .table("municipio")        
        .where({ "ufId": idM });

      res.json(query);
    } catch (error) {
      res.json({
        mensagem: "Verifique, ocorreu erro ao MUNICIPIO os dados",
        motivo: error,
      });
    }
  };
  //LISTAR CNAE

  return {
    cadastrar_UF,
    cadastrar_PAIS,
    cadastrar_MUNICIPIO,
    listar_UF,
    listar_PAIS,
    listar_MUNICIPIO,
    filtrar_MUNICIPIO,
  };
};
