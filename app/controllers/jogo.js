module.exports.jogo = function(application, req, res){
    
    if (req.session.autorizado !== true){
        res.send("Usuário precisa fazer login");
        return;
    }

    var msg = 'N'; //Testará se há erros antes de entrar no jogo
    if (req.query.msg != ''){
        msg = req.query.msg;
    }
    
    var connection = application.config.dbConnection;
    var JogoDAO = new application.app.models.jogoDAO(connection);

    JogoDAO.iniciaJogo(res, req.session.usuario, req.session.casa, msg);

    
}

module.exports.suditos = function(application, req, res){
    if (req.session.autorizado !== true){
        res.send("Usuário precisa fazer login");
        return;
    }
    res.render("aldeoes", {validacao:{}});
}

module.exports.pergaminhos = function(application, req, res){
    if (req.session.autorizado !== true){
        res.send("Usuário precisa fazer login");
        return;
    }

    var connection = application.config.dbConnection;
    var JogoDAO = new application.app.models.jogoDAO(connection);

    var usuario = req.session.usuario;

    JogoDAO.getAcoes(usuario, res);

    
}

module.exports.ordenar_acao_sudito = function(application, req, res){
    if (req.session.autorizado !== true){
        res.send("Usuário precisa fazer login");
        return;
    }
    var dadosForm = req.body;

    req.assert('acao', 'Ação deve ser informada').notEmpty();
    req.assert('quantidade', 'quantidade deve ser informada').notEmpty();

    var erros = req.validationErrors();

    if (erros){
        res.redirect('jogo?msg=A'); //comando_invalido vai testar se há erros no formulário
        return;
    }

    console.log(dadosForm);
    
    var connection = application.config.dbConnection;
    var JogoDAO = new application.app.models.jogoDAO(connection);

    dadosForm.usuario = req.session.usuario;
    JogoDAO.acao(dadosForm);

    res.redirect('jogo?msg=B');
}

module.exports.revogar_acao = function(application, req, res){
    var _id = req.query.id_acao;

    var connection = application.config.dbConnection;
    var JogoDAO = new application.app.models.jogoDAO(connection);

    JogoDAO.revogarAcao(_id, res);
}

module.exports.sair = function(application, req, res){
    
    req.session.destroy( function(error, result){
        res.render("index", {validacao:{}});
    });
    
}

