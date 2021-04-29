var ObjectID = require('mongodb').ObjectId;

function jogoDAO(connection){
    this._connection = connection();
}

jogoDAO.prototype.gerarParametros = function(usuario){
    this._connection.open(function(error, mongoclient){
        mongoclient.collection("jogo", function(error, collection){
            collection.insert({
                usuario: usuario,
                moeda: 15,
                suditos: 10,
                temor: Math.floor(Math.random() * 1000),
                sabedoria: Math.floor(Math.random() * 1000),
                comercio: Math.floor(Math.random() * 1000),
                magia: Math.floor(Math.random() * 1000)
            }); // recebe o arquivo json para inserir diretamente no banco

            mongoclient.close(); //Fecha a conexão com o banco
        }); //ele espera 2 parametros (collection, callback)
    });
}

jogoDAO.prototype.iniciaJogo = function(res, usuario, casa, msg){
    
    this._connection.open(function(error, mongoclient){
        mongoclient.collection("jogo", function(error, collection){
            collection.find({usuario : usuario}).toArray(function(error, result){
                
                res.render('jogo', {casa : casa, jogo: result[0], msg : msg} );
                
            });
            mongoclient.close();
        });
    });

}

jogoDAO.prototype.acao = function(acao){
    this._connection.open(function(error, mongoclient){
        mongoclient.collection("acao", function(error, collection){
            
            var date = new Date();
            
            var tempo = null;
        
            switch(parseInt(acao.acao)){
                case 1: tempo = 1 * 60 * 60000; break;
                case 2: tempo = 2 * 60 * 60000; break;
                case 3: tempo = 5 * 60 * 60000; break;
                case 4: tempo = 5 * 60 * 60000; break;
            }

            acao.acao_termina_em = date.getTime() + tempo//GetTime() retorna em milissegundos o interalo entre 01/01/1970 até o instante que a função foi executada
            collection.insert(acao); // recebe o arquivo json para inserir diretamente no banco

            mongoclient.collection("jogo", function(error, collection){

                var moedas = null;
                switch(parseInt(acao.acao)){
                    case 1: moedas = -2 * acao.quantidade; break;
                    case 2: moedas = -3 * acao.quantidade; break;
                    case 3: moedas = -1 * acao.quantidade; break;
                    case 4: moedas = -1 * acao.quantidade; break;
                }            
                collection.update(
                    {usuario : acao.usuario},
                    { $inc: {moeda: moedas}} //$inc incrementa no valor ao invés de setar
                    
                )});

            mongoclient.close(); //Fecha a conexão com o banco
        }); //ele espera 2 parametros (collection, callback)
    });
}

jogoDAO.prototype.getAcoes = function(usuario, res){
    this._connection.open(function(error, mongoclient){
        mongoclient.collection("acao", function(error, collection){

            var date = new Date();
            var momento_atual = date.getTime();
            collection.find({usuario : usuario, acao_termina_em: {$gt:momento_atual}}).toArray(function(error, result){
                console.log(usuario);

                res.render("pergaminhos", {acoes: result});
            
            });
        

            mongoclient.close();
        }) 
    });
}

jogoDAO.prototype.revogarAcao = function(_id, res){
    this._connection.open(function(error, mongoclient){
        mongoclient.collection("acao", function(error, collection){

            collection.remove(
                {_id: ObjectID(_id)},
                function(err, result){
                    res.redirect("jogo?msg=D");
                }
            )

            mongoclient.close();
        }) 
    });
}

module.exports = function(){
    return jogoDAO;
}

