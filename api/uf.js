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
                await app.db("PAIS").transacting(trans).insert(req.body);
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
            await app.db.transaction(async (trans) => {
                await app.db("MUNICIPIO").transacting(trans).insert(req.body);
                res.status(200).send({
                    sucesso: "MUNICIPIO cadastrada com sucesso.",
                });
            });
        } catch (err) {
            res.status(500).send({
                error: "FALHA ao cadsatrar MUNICIPIO.",
                motivo: err,
            });
        }
    };

    //LISTAR UF
    const listar_UF = async (req, res) => {
        try {
            const { page = 1, limite = 12 } = req.query;

            const query = await app.db
                .select("*")
                .table("UF")
                .limit(limite)
                .offset((page - 1) * limite);

            const [count] = await app.db("UF").count();
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
    };

    //LISTAR PAIS
    const listar_PAIS = async (req, res) => {
        try {
            const { page = 1, limite = 12 } = req.query;

            const query = await app.db
                .select("*")
                .table("PAIS")
                .limit(limite)
                .offset((page - 1) * limite);

            const [count] = await app.db("PAIS").count();
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
            const { page = 1, limite = 12 } = req.query;

            const query = await app.db
                .select("*")
                .table("MUNICIPIO")
                .limit(limite)
                .offset((page - 1) * limite);

            const [count] = await app.db("MUNICIPIO").count();
            const totalPage = Math.ceil(count["count(*)"] / limite);
            const pageAtual = parseInt(page);

            res.json({
                Total: count["count(*)"],
                Paginas: totalPage,
                PaginaAtual: pageAtual,
                MUNICIPIO: query,
            });
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
    };
};
