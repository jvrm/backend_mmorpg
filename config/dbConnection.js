/* IMPORTAR O MONGODB */
var mongo = require ('mongodb');

var connMongoDB = function(){
    console.log("Entrou no servidor");
    var db = new mongo.Db(
        'got',
        new mongo.Server(
            'localhost', //string contendo o endereço do Servidor
            27017, //Porta de conexão
            {} // Configurações do Servidor
        ),
        {} //Configurações Adicionais
    );
    return db;
}

module.exports = function(){
    return connMongoDB;
}