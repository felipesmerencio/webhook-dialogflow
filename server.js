
const express = require('express');
const app = express();

//... your code here ...

let bodyParser = require('body-parser')
app.use( bodyParser.json() ); // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
    extended: true
}));

app.use(express.static('public'));

app.get('/', function(request, response){
    response.send("Plataforma Merêncio Tecnologia");
});

const mysql = require("mysql");
const MYSQL_HOST = process.env.MYSQL_HOST;
const MYSQL_USER = process.env.MYSQL_USER;
const MYSQL_PASS = process.env.MYSQL_PASS;
const MYSQL_DB = process.env.MYSQL_DB;
                                
app.post("/petshop",function(request, response){

    let intentName = request.body.queryResult.intent.displayName;

    if(intentName === "agendamento"){

        
        let nome = request.body.queryResult.parameters['nome-cliente'];
        let fone = request.body.queryResult.parameters['fone-cliente'];

        let sql_query = "insert into clientes values ('" + nome + "','" + fone + "')";

        let connection = mysql.createConnection({
            host: MYSQL_HOST,
            user: MYSQL_USER,
            password: MYSQL_PASS,
            database: MYSQL_DB
        });
        connection.connect();

        connection.query(sql_query, function(error, results, fields){
            if (error) throw error;
            connection.end()
            response.json({"fulfillmentText":"Seus dados foram salvos com sucesso, quer agendar agora ?"})
        })
    }
})

var port = process.env.PORT || 3000;
app.listen(port, function () {
    console.log('Umbler listening on port %s', port);
});