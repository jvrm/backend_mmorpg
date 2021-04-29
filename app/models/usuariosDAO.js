/* IMPORTAR O MÓDULO DO CRYPTO */
var crypto = require("crypto");

function usuariosDAO(connection){
    this._connection = connection();
}

usuariosDAO.prototype.inserirUsuario = function(usuario){
    this._connection.open(function(error, mongoclient){
        mongoclient.collection("usuarios", function(error, collection){

            console.log(usuario);

            var senhacrypto = crypto.createHash("md5").update(usuario.senha).digest("hex") //digest serve para devolver em com o parametro passado na função, nesse caso em hexadecimal

            usuario.senha = senhacrypto

            collection.insert(usuario); // recebe o arquivo json para inserir diretamente no banco

            mongoclient.close(); //Fecha a conexão com o banco
        }); //ele espera 2 parametros (collection, callback)
    });
}

/*usuariosDAO.prototype.autenticar = function(usuario){
    this._connection.open(function(error, mongoclient){
        mongoclient.collection("usuarios", function(error, collection){

            console.log('Entrou: '+ collection);

            collection.find(usuario).toArrray(function(error, result){
                console.log(result);
            }); // recebe o arquivo json para pesquisar diretamente no banco

            mongoclient.close(); //Fecha a conexão com o banco
        }); //ele espera 2 parametros (collection, callback)
    });
}*/

usuariosDAO.prototype.autenticar = function(usuario, req, res){
    this._connection.open(function(error, mongoclient){
        mongoclient.collection("usuarios", function(error, collection){
            
            var senhacrypto = crypto.createHash("md5").update(usuario.senha).digest("hex")
            usuario.senha = senhacrypto;
            collection.find(usuario).toArray(function(error, result){
                
                console.log(typeof(result[0]));

                if (result[0] != undefined){
                    req.session.autorizado = true; //session só estará disponível após configurar o middleware express session

                    req.session.usuario = result[0].usuario;
                    req.session.casa = result[0].casa;
                    
                }
                console.log("casa "+ req.session.casa);
                

                if (req.session.autorizado){
                    res.redirect("jogo");
                }else{
                    res.render("index", {validacao: {}})
                }

            });
            mongoclient.close();
        });
    });
}

module.exports = function(){
    return usuariosDAO;
}

