const { json } = require("body-parser");
const { response } = require("express");

module.exports = (app) => {
  /*RESPONSAVEL POR CARREGAR OS DADOS DO PRODUTO*/
  const listarSecao = (req, res) => {
    app
      .db("secao")
      .then((secao) => {
        if (secao) {
          res.status(200).send(secao);
        }
      })
      .catch((err) => {
        if (err) {
          res.status(400).send("Algo de errado aconteceu.", err);
        }
      });
  };
  const listarGrupo = (req, res) => {
    app
      .db("grupo")
      .then((grupo) => {
        if (grupo) {
          res.status(200).send(grupo);
        }
      })
      .catch((err) => {
        if (err) {
          res.status(400).send("Algo de errado aconteceu.", err);
        }
      });
  };

  const listarSubGrupo = async (req, res) => {
    try {
      const reuslt = await app.db("subGrupo");
      res.json(reuslt);
    } catch (error) {
      res.status(500).send({ error: "Verifique os dados.", error });
    }
  };

  /*RESPONSAVEL POR SALVAR OS DADOS DO PRODUTO*/
  const salvarSecao = (req, res) => {
    const secao = req.body;
    app
      .db("secao")
      .insert(secao)
      .then((_) => res.status(200).send("Sucesso."))
      .catch((err) => res.status(400).send(err));
  };

  const salvarGrupo = (req, res) => {
    const grupo = req.body;
    app
      .db("grupo")
      .insert(grupo)
      .then((_) => res.status(200).send("Sucesso."))
      .catch((err) => res.status(400).send(err));
  };

  const salvarSubGrupo = (req, res) => {
    const subGrupo = req.body;
    app
      .db("subGrupo")
      .insert(subGrupo)
      .then((_) => res.status(200).send("Sucesso."))
      .catch((err) => res.status(400).send(err));
  };

  const deletar_SECAO = (req, res) => {
    const codigo = req.params.id;
    //console.log('Produots: ',produtos)

    app
      .db("secao")
      .where({ codigo: codigo })
      .del()
      .then((_) => {
        res.status(200).send("Sucesso.");
      })
      .catch((err) => {
        res.status(400).send("Verifique as informações. ", err);
      });
  };

  const atualizarSecao = (req, res) => {
    const codigo = req.params.id;
    const secao = req.body;
    //console.log('Produots: ',produtos)

    app
      .db("secao")
      .where({ codigo: codigo })
      .update(secao)
      .then((_) => {
        res.status(200).send("Sucesso.");
      })
      .catch((err) => {
        res.status(400).send("Verifique as informações. ", err);
      });
  };

  const deletar_GRUPO = (req, res) => {
    const codigo = req.params.id;

    //console.log('Produots: ',produtos)
    app
      .db("grupo")
      .where({ id: codigo })
      .del()
      .then((_) => {
        res.status(200).send("Sucesso.");
      })
      .catch((err) => {
        res.status(400).send("Verifique as informações. ", err);
      });
  };
  const atualizarGrupo = (req, res) => {
    const codigo = req.params.id;
    const grupo = req.body;
    //console.log('Produots: ',produtos)

    app
      .db("grupo")
      .where({ id: codigo })
      .update(grupo)
      .then((_) => {
        res.status(200).send("Sucesso.");
      })
      .catch((err) => {
        res.status(400).send("Verifique as informações. ", err);
      });
  };

  const atualizarSubGrupo = (req, res) => {
    const codigo = req.params.id;
    //console.log('Produots: ',produtos)
    app
      .db("subGrupo")
      .where({ id: codigo })
      .update(req.body)
      .then((_) => {
        res.status(200).send("Sucesso.");
      })
      .catch((err) => {
        res.status(500).send({ error: "Verifique as informações. ", err });
      });
  };

  const deletar_SUBGRUPO = (req, res) => {
    const codigo = req.params.id;
    //console.log('Produots: ',produtos)
    app
      .db("subGrupo")
      .where({ id: codigo })
      .del()
      .then((_) => {
        res.status(200).send("Sucesso.");
      })
      .catch((err) => {
        res.status(500).send({ error: "Verifique as informações. ", err });
      });
  };

  const consultaSubGrupoPorGrupo = (req, res) => {
    const codigo = req.params.id;
    app
      .db("subgrupo")
      .where({ grupoId: codigo })
      .then((subgrupo) => {
        if (subgrupo) {
          res.status(200).send(subgrupo.reverse());
        }
      })
      .catch((err) => {
        if (err) {
          res.status(400).send("Algo de errado aconteceu.", err);
        }
      });
  };

  /*FILTRAR OS DADOS*/

  const consulta_SECAO = (req, res) => {
    const descricao = req.params.id;
    app
      .db("secao")
      .where('descricao', 'like', `%${descricao}%`)
      .then((subgrupo) => {
        if (subgrupo) {
          res.status(200).send(subgrupo);
        }
      })
      .catch((err) => {
        if (err) {
          res.status(400).send("Algo de errado aconteceu.", err);
        }
      });
  };
  const consulta_GRUPO = (req, res) => {
    const descricao = req.params.id;
    app
      .db("grupo")
      .where('descricao', 'like', `%${descricao}%`)
      .then((subgrupo) => {
        if (subgrupo) {
          res.status(200).send(subgrupo);
        }
      })
      .catch((err) => {
        if (err) {
          res.status(400).send("Algo de errado aconteceu.", err);
        }
      });
  };


  const consulta_SUBGRUPO = (req, res) => {
    const descricao = req.params.id;
    app
      .db("subGrupo")
      .where('descricao', 'like', `%${descricao}%`)
      .then((subgrupo) => {
        if (subgrupo) {
          res.status(200).send(subgrupo);
        }
      })
      .catch((err) => {
        if (err) {
          res.status(400).send("Algo de errado aconteceu.", err);
        }
      });
  };



  return {
    listarSecao,
    listarGrupo,
    listarSubGrupo,
    salvarSecao,
    salvarGrupo,
    salvarSubGrupo,
    atualizarSecao,
    atualizarGrupo,
    atualizarSubGrupo,
    consultaSubGrupoPorGrupo,
    deletar_SECAO,
    deletar_GRUPO,
    deletar_SUBGRUPO,

    consulta_SECAO,
    consulta_GRUPO,
    consulta_SUBGRUPO
  };
};
