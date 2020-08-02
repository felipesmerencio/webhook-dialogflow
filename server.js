
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

// Google Calendar

const {google} = require('googleapis');
const calendarId = "" //remove credentials
const serviceAccount = {
    // remove credentials
    "type": "service_account",
    "project_id": "",
    "private_key_id": "",
    "private_key": "",
    "client_email": "",
    "client_id": "",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": ""
}
  
const timeZoneOffset = '-03:00';

const serviceAccountAuth = new google.auth.JWT({
    email: serviceAccount.client_email,
    key: serviceAccount.private_key,
    scopes: 'https://www.googleapis.com/auth/calendar'
});

const calendar = google.calendar('v3');




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
    } else if (intentName === "agendamento - yes"){

        let cliente = request.body.queryResult.outputContexts[1].parameters['nome-cliente'];
        let fone = request.body.queryResult.outputContexts[1].parameters['fone-cliente'];

        let tipo    = request.body.queryResult.parameters['tipo'];
        let servico = request.body.queryResult.parameters['servico']; 
        let data    = request.body.queryResult.parameters['data'];
        let hora    = request.body.queryResult.parameters['hora'];

        const dateTimeStart = new Date(Date.parse(data.split('T')[0] + 'T' + hora.split('T')[1].split('-')[0] + timeZoneOffset));
        const dateTimeEnd = new Date(new Date(dateTimeStart).setHours(dateTimeStart.getHours() + 1));
        const agendamentoString = formatData(new Date(data.split('T')[0]))+ " as "+hora.split('T')[1].split('-')[0];

        return criarEventoCalendario(dateTimeStart, dateTimeEnd, servico,tipo,cliente, fone).then(() => {
            let mensagem = `Excelente, seu serviço esta agendado para ${agendamentoString} `;
            console.log(mensagem);
            response.json({"fulfillmentText":mensagem});
        }).catch(() => {
            let mensagem = `Desculpe, não temos mais vaga para ${agendamentoString}.`;
            console.log(mensagem);
            response.json({"fulfillmentText":mensagem});
        });        
    }
})

function criarEventoCalendario(dateTimeStart, dateTimeEnd, servico,tipo,cliente, fone) {
    return new Promise((resolve, reject) => {
      calendar.events.list({
        auth: serviceAccountAuth, // List events for time period
        calendarId: calendarId,
        timeMin: dateTimeStart.toISOString(),
        timeMax: dateTimeEnd.toISOString()
      }, (err, calendarResponse) => {
        // Check if there is a event already on the Calendar
        if (err || calendarResponse.data.items.length > 0) {
          reject(err || new Error('Requisição conflita com outros agendamentos'));
        } else {
          // Create event for the requested time period
          calendar.events.insert({ auth: serviceAccountAuth,
            calendarId: calendarId,
            resource: {summary: servico +' - '+ tipo +' ', description: 'Sr(a) '+cliente+' agendou '+servico+' para seu '+tipo+'. Segue o telefone para contato' + fone +'.',
              start: {dateTime: dateTimeStart},
              end: {dateTime: dateTimeEnd}}
          }, (err, event) => {
            err ? reject(err) : resolve(event);
          }
          );
        }
      });
    });
}

function formatData(date) {
    var nomeMes = [
      "Janeiro", "Fevereiro", "Março",
      "Abril", "Maio", "Junho", "Julho",
      "Agosto", "Setembro", "Outubro",
      "Novembro", "Dezembro"
    ];
  
    var dia = date.getDate();
    var mesIndex = date.getMonth();
    var ano = date.getFullYear();
  
    return dia + ' ' + nomeMes[mesIndex] + ' ' + ano;
}

var port = process.env.PORT || 3000;
app.listen(port, function () {
    console.log('Umbler listening on port %s', port);
});