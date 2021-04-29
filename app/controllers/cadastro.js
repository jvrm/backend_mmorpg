module.exports.cadastro = function(application, req, res){
    res.render('cadastro', {validacao: {}, dadosForm: {}});
}

module.exports.cadastrar = function(application, req, res){
    var dadosForm = req.body;

    req.assert('nome', 'Nome não pode ser vazio').notEmpty();
    req.assert('usuario', 'Usuário não pode ser vazio').notEmpty();
    req.assert('senha', 'Senha não pode ser vazio').notEmpty();
    req.assert('casa', 'Casa não pode ser vazio').notEmpty();

    var erros = req.validationErrors();

    if (erros){
        res.render('cadastro', {validacao: erros, dadosForm : dadosForm});
        return;
    }

    var connection = application.config.dbConnection; //Carrega a função de carregamento mas não executa, passando por parâmetro para o model
    console.log(connection);

    var UsuariosDAO = new application.app.models.usuariosDAO(connection);
    var JogoDAO = new application.app.models.jogoDAO(connection);
    UsuariosDAO.inserirUsuario(dadosForm);
    JogoDAO.gerarParametros(dadosForm.usuario);
    

    res.send("Vamos Cadastrar");
}