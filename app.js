/* importar as configurações do servidor */
var app = require('./config/server');

console.log(app.app.controllers.cadastro);

/* parametrizar a porta de escuta */
app.listen(80, function(){
	console.log(app);
})