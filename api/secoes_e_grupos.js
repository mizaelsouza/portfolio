const { json } = require("body-parser");
const { response } = require("express");

module.exports = (app) => {
    /*RESPONSAVEL POR CARREGAR OS DADOS DO PRODUTO*/
    const listarSecao = (req, res) => {
        app.db("secao")
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
        app.db("grupo")
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

    const listarSubGrupo = (req, res) => {
        app.db("subGrupo")
            .then((subGrupo) => {
                if (grupo) {
                    res.status(200).send(subGrupo);
                }
            })
            .catch((err) => {
                if (err) {
                    res.status(400).send("Algo de errado aconteceu.", err);
                }
            });
    };

    /*RESPONSAVEL POR SALVAR OS DADOS DO PRODUTO*/
    const salvarSecao = (req, res) => {
        const secao = req.body;
        app.db("secao")
            .insert(secao)
            .then((_) => res.status(200).send("Sucesso."))
            .catch((err) => res.status(400).send(err));
    };

    const salvarGrupo = (req, res) => {
        const grupo = req.body;
        app.db("grupo")
            .insert(grupo)
            .then((_) => res.status(200).send("Sucesso."))
            .catch((err) => res.status(400).send(err));
    };

    const salvarSubGrupo = (req, res) => {
        const subGrupo = req.body;
        app.db("subGrupo")
            .insert(subGrupo)
            .then((_) => res.status(200).send("Sucesso."))
            .catch((err) => res.status(400).send(err));
    };

    const atualizarSecao = (req, res) => {
        const codigo = req.params.id;
        const secao = req.body;
        //console.log('Produots: ',produtos)

        app.db("secao")
            .where({ codigo: codigo })
            .update(secao)
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

        app.db("grupo")
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
        const subGrupo = req.body;
        //console.log('Produots: ',produtos)

        app.db("subGrupo")
            .where({ codigo: codigo })
            .update(subGrupo)
            .then((_) => {
                res.status(200).send("Sucesso.");
            })
            .catch((err) => {
                res.status(400).send("Verifique as informações. ", err);
            });
    };

    const consultaSubGrupoPorGrupo = (req, res) => {
        const codigo = req.params.id;
        app.db("subgrupo")
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
    };
};
