const sweggerUi = require("swagger-ui-express");
const sweggerDocs = require("../docs/sweggerDocs.json");
const multer = require("multer");
const configMulter = require("./upload/multer");

module.exports = (app) => {
    /*
    USO APENAS EM TESTE
    
    */
    app.post(
        "/api/usuarios/recuperar_senha",
        app.api.authenticar.recuperarsenha,
    );

    /*
    USUARIOS, PERFIL, TRIBUTACAO, CNAE    
    */

    app.route("/api/usuario/cadastro")
        //  .all(app.config.passport.authenticate())
        .post(app.api.usuario.save);
    app.post("/api/usuarios/alterar_senha", app.api.authenticar.altarecaoSenha);
    app.post("/api/usuario/perfil/cadastro", app.api.usuario.cadastrar_perfil);
    app.get("/api/usuario/perfil/cadastro", app.api.usuario.listarPerfil);
    app.post("/api/usuario/login", app.api.authenticar.login);

    app.route("/api/usuario/cadastro/:id")
        .all(app.config.passport.authenticate())
        .put(app.api.usuario.atualizar);

    app.route("/api/usuarios/:id")
        .all(app.config.passport.authenticate())
        .get(app.api.usuario.listarPorEmail);

    app.route("/api/usuarios")
        .all(app.config.passport.authenticate())
        .get(app.api.usuario.listar);

    app.route("/api/cadastro/usuario/perfil")
        .all(app.config.passport.authenticate())
        .post(app.api.usuario.cadastrar_perfil);

    app.route("/api/cadastro/loja")
        .all(app.config.passport.authenticate())
        .get(app.api.loja.listar_LOJA);

    app.route("/api/cadastro/loja")
        .all(app.config.passport.authenticate())
        .post(app.api.loja.cadastrar_LOJA);

    app.route("/api/cadastro/tributacao/regime")
        .all(app.config.passport.authenticate())
        .post(app.api.tributacao.cadastrar_CRT);

    app.route("/api/cadastro/tributacao/cnae")
        .all(app.config.passport.authenticate())
        .post(app.api.tributacao.cadastrar_CNAE);

    /*RECUPERACAO DE SENHA*/
    /*
    MODULOS
    SUBMENU
    PROGRAMAS
*/

    app.route("/api/programas")
        .all(app.config.passport.authenticate())
        .get(app.api.programas.listarModulo);

    /*app.route('/api/usuarios/recuperar_senha')
            .all(app.config.passport.authenticate())
            .post(app.api.authenticar.recuperarsenha)*/

    /*PRODUTOS, GROUPOS, SECOES*/

    app.route("/api/produtos")
        .all(app.config.passport.authenticate())
        .get(app.api.produtos.listaTodosComPagina);

    app.route("/api/produtos/fotos")
        .all(app.config.passport.authenticate())
        .get(app.api.produtos.listarFotos);

    app.route("/api/produtos/cadastro")
        .all(app.config.passport.authenticate())
        .post(app.api.produtos.salvar);

    app.route("/api/produtos/cadastro/valores")
        .all(app.config.passport.authenticate())
        .post(app.api.produtos.salvarProdutoValores);

    app.route("/api/produtos/fotos/cadastro")
        .all(app.config.passport.authenticate())
        .post(app.api.produtos.salvarFoto);

    app.route("/api/produtos/pesquisar")
        .all(app.config.passport.authenticate())
        .post(app.api.produtos.filtrar);

    //GROUPOS
    app.route("/api/grupo")
        .all(app.config.passport.authenticate())
        .get(app.api.secoes_e_grupos.listarGrupo);

    app.route("/api/grupo/cadastro")
        .all(app.config.passport.authenticate())
        .post(app.api.secoes_e_grupos.salvarGrupo);

    app.route("/api/grupo/cadastro/:id")
        .all(app.config.passport.authenticate())
        .put(app.api.secoes_e_grupos.atualizarGrupo);

    //SUBGRUPO
    app.route("/api/subgrupo")
        .all(app.config.passport.authenticate())
        .get(app.api.secoes_e_grupos.listarSubGrupo);

    app.route("/api/subgrupo/:id")
        .all(app.config.passport.authenticate())
        .get(app.api.secoes_e_grupos.consultaSubGrupoPorGrupo);

    app.route("/api/subgrupo/cadastro")
        .all(app.config.passport.authenticate())
        .post(app.api.secoes_e_grupos.salvarSubGrupo);

    //SECAO
    app.route("/api/secao")
        .all(app.config.passport.authenticate())
        .get(app.api.secoes_e_grupos.listarSecao);

    app.route("/api/secao/cadastro")
        .all(app.config.passport.authenticate())
        .post(app.api.secoes_e_grupos.salvarSecao);

    //MIDIA DIGITAL
    app.route("/api/midia")
        .all(app.config.passport.authenticate())
        .get(app.api.midia_Digital.listarMidia);

    app.route("/api/midia/cadastro")
        .all(app.config.passport.authenticate())
        .post(
            multer(configMulter).single("file"),
            app.api.midia_Digital.salvarMidia,
        );

    app.route("/api/midia/cadastro/:id")
        .all(app.config.passport.authenticate())
        .put(
            multer(configMulter).single("file"),
            app.api.midia_Digital.midiaAtualizar,
        );

    app.route("/api/midia/cadastro/:id")
        .all(app.config.passport.authenticate())
        .delete(app.api.midia_Digital.deletar);

    //MIDIA DIGITAL PRODUTOS

    app.route("/api/midia/produtos")
        .all(app.config.passport.authenticate())
        .get(app.api.midia_Digital.listarMidiaProdutos);

    app.route("/api/midia/produtos/cadastro")
        .all(app.config.passport.authenticate())
        .post(app.api.midia_Digital.salvarMidiaProdutos);

    app.route("/api/midia/produtos/cadastro/:id")
        .all(app.config.passport.authenticate())
        .put(app.api.midia_Digital.midiaProdutosatualizar);

    //CADASTRO DE PRODUTOS EM OFERTA

    app.route("/api/produtos/oferta")
        .all(app.config.passport.authenticate())
        .get(app.api.produtos.listaProdutosEmOferta);

    app.route("/api/produtos/oferta")
        .all(app.config.passport.authenticate())
        .post(app.api.produtos.salvarOferta);

    app.route("/api/produtos/oferta/itens")
        .all(app.config.passport.authenticate())
        .get(app.api.produtos.listaProdutosEmOfertaItens);

    app.route("/api/produtos/oferta/itens")
        .all(app.config.passport.authenticate())
        .post(app.api.produtos.salvarOfertaItems);

    app.route("/api/produtos/oferta/:id")
        .all(app.config.passport.authenticate())
        .put(app.api.produtos.atualizarOferta);

    /* 
    =============================
    COLABORADOR
    =============================
    */

    //EVENTO
    app.route("/api/cadastro/colaborador/evento")
        .all(app.config.passport.authenticate())
        .get(app.api.colaborador.listar_EVENTO);

    app.route("/api/cadastro/colaborador/evento")
        .all(app.config.passport.authenticate())
        .post(app.api.colaborador.cadastrar_EVENTO);

    //DEPARTAMENTO
    app.route("/api/cadastro/colaborador/departamento")
        .all(app.config.passport.authenticate())
        .get(app.api.colaborador.listar_DEPARTAMENTO);

    app.route("/api/cadastro/colaborador/departamento")
        .all(app.config.passport.authenticate())
        .post(app.api.colaborador.cadastrar_DEPARTAMENTO);

    //HORARIO
    app.route("/api/cadastro/colaborador/horario")
        .all(app.config.passport.authenticate())
        .get(app.api.colaborador.listar_HORARIO_TRABALHO);

    app.route("/api/cadastro/colaborador/horario")
        .all(app.config.passport.authenticate())
        .post(app.api.colaborador.cadastrar_HORARIO_TRABALHO);

    //FUNCAO
    app.route("/api/cadastro/colaborador/funcao")
        .all(app.config.passport.authenticate())
        .get(app.api.colaborador.listar_FUNCAO);

    app.route("/api/cadastro/colaborador/funcao")
        .all(app.config.passport.authenticate())
        .post(app.api.colaborador.cadastrar_FUNCAO);

    //COLABORADOR
    app.route("/api/cadastro/colaborador")
        .all(app.config.passport.authenticate())
        .get(app.api.colaborador.listar_COLABORADOR);

    app.route("/api/cadastro/colaborador")
        .all(app.config.passport.authenticate())
        .post(app.api.colaborador.cadastrar_COLABORADOR);

  

    /*
    =============================
    CLIENTE
    =============================
    */
    //PESSOAS FISICA
    app.route("/api/cadastro/pessoas/fisica")
        .all(app.config.passport.authenticate())
        .get(app.api.pessoas.listar_CLIENTEPF);

    app.route("/api/cadastro/pessoas/fisica")
        .all(app.config.passport.authenticate())
        .post(app.api.pessoas.cadastrar_CLIENTEPF);

    app.route("/api/cadastro/pessoas/fisica/:id")
        .all(app.config.passport.authenticate())
        .delete(app.api.pessoas.deletar_CLIENTEPFEPJ);

    //PESSOAS JURIDICA
    app.route("/api/cadastro/pessoas/juridica")
        .all(app.config.passport.authenticate())
        .get(app.api.pessoas.listar_CLIENTEPJ);

    app.route("/api/cadastro/pessoas/juridica")
        .all(app.config.passport.authenticate())
        .post(app.api.pessoas.cadastrar_CLIENTEPJ);

    app.route("/api/cadastro/pessoas/juridica/:id")
        .all(app.config.passport.authenticate())
        .delete(app.api.pessoas.deletar_CLIENTEPFEPJ);





    /*
    =============================
        FORNECEDOR
    =============================
    */
    //FORNECEDOR
    app.route("/api/cadastro/fornecedor")
        .all(app.config.passport.authenticate())
        .get(app.api.fornecedor.listar_FORNECEDOR);

    app.route("/api/cadastro/fornecedor")
        .all(app.config.passport.authenticate())
        .post(app.api.fornecedor.cadastrar_FORNECEDOR);

    app.route("/api/cadastro/fornecedor/:id")
        .all(app.config.passport.authenticate())
        .delete(app.api.fornecedor.deletar_FORNECEDOR);

    /*
    =============================
        CONTADOR
    =============================
    */
    //CONTADOR
    app.route("/api/cadastro/contador")
        .all(app.config.passport.authenticate())
        .get(app.api.contador.listar_CONTADOR);

    app.route("/api/cadastro/contador")
        .all(app.config.passport.authenticate())
        .post(app.api.contador.cadastrar_CONTADOR);

    app.route("/api/cadastro/contador/:id")
        .all(app.config.passport.authenticate())
        .delete(app.api.contador.deletar_CONTADOR);
    /*
    =============================
        TRANSPORTADORA
    =============================
    */
    //TRANSPORTADORA
    app.route("/api/cadastro/transportadora")
        .all(app.config.passport.authenticate())
        .get(app.api.transportadora.listar_TRANSPORTADORA);

    app.route("/api/cadastro/transportadora")
        .all(app.config.passport.authenticate())
        .post(app.api.transportadora.cadastrar_TRANSPORTADORA);

    app.route("/api/cadastro/transportadora/:id")
        .all(app.config.passport.authenticate())
        .delete(app.api.transportadora.deletar_TRANSPORTADORA);

    /*
    =============================
        PAIS, UF, MUNICIPIO
    =============================
    */
    //PAIS
    app.route("/api/cadastro/pais")
        .all(app.config.passport.authenticate())
        .get(app.api.uf.listar_PAIS);

    app.route("/api/cadastro/pais")
        .all(app.config.passport.authenticate())
        .post(app.api.uf.cadastrar_PAIS);

    //UF
    app.route("/api/cadastro/uf")
        .all(app.config.passport.authenticate())
        .get(app.api.uf.listar_UF);

    app.route("/api/cadastro/uf")
        .all(app.config.passport.authenticate())
        .post(app.api.uf.cadastrar_UF);
    //MUNICIPIO
    app.route("/api/cadastro/municipio")
        .all(app.config.passport.authenticate())
        .get(app.api.uf.listar_MUNICIPIO);

    app.route("/api/cadastro/municipio")
        .all(app.config.passport.authenticate())
        .post(app.api.uf.cadastrar_MUNICIPIO);
};
