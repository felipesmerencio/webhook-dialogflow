
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
const calendarId = "u47r190pfe06qp51j1ktp3fc5g@group.calendar.google.com"
const serviceAccount = {
    "type": "service_account",
    "project_id": "petshop-gggr",
    "private_key_id": "e7356b0b8c011499c1fc1d6e49e94345cb4e3e67",
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCbvUgIt7VIA78n\nURMYSmuXVsWqQjVKF4Bfast+yCAw09cfxtdhJbcljUNik0K0HOkk7jG6KC2p+gJQ\n5gD4hpN9Jhb1PbHvhDiA+/I8RVjDvr4b5qw0QvTGQ9KA9FYHCfZ/rk0LOfbOL+G9\n69koKdMLG/yGTb2dl/ERgD4+H0q7geu33WzUCv/9AUc8w4inMcDwc1ODi8x1Z74C\n7VIj1mK11RoMQe1qyyxn/dRwD0LJL3DVCMxVRar4GDHmaVEfVC0YwbEbz2g+Cg9E\neh54u6Diou6zf+bn6JGBvnjfrIQ6h1Ja3HlEeAwk/iNKGtdde8Nv6kzl4kpdSGKr\n0P5szFmzAgMBAAECggEAP9BDo1rO+3aZjT0hs1rPEiBadwSQ/E576d0DC+xpkEhF\nBf6+Qs6m6EqlOU94zf9oopq9IneTGmpYJ5jO/gZ6iZWhY5SHg8psMqHJpFuP3wkZ\nsaoHlpR24oRozTEQzOqOp8ueQwLZt6uT9nOcs+HLWWp6wvc4wkm/W/ntxxugTgrv\nDhkuS43gKu10zlO8PcmfaW2gFY30U2SAggU04h9yRZQRyl8o8WF+/5cagOSklTuO\nAwj+baGmvqBaAVwlnaWt3cUoyzBYn8ox1ejH4qiFIDkxtL+DHnQN+3YyqutScb11\nfo2x6epyUOGdX7SCqFk8OwAbHzNxT4fr8s2i3dnWDQKBgQDIp0rSf23A1yKO/aem\nr758CCRdOUX0BNwRe9UzL6oe8Xjc8UG5WRSVTgLo7rAXTrgx3J5ZLx/0ciq27LKt\ndxE66YvS0LNPEqqlPXg6jOH0146kNsXZkt7kNl4B+mkocRcYwAGPhR/70rwFEw8z\nAv7UNxzdiNxG2+9pag+3kNPtfQKBgQDGsnpHpssruJvVHrIT5YUEolMm3DAQL8AB\n5vLWY35p0sfiWForiCUWBppaOCQaMOupxlokwtHvs2BV0B+UwQpPIjifcUFsMCVT\nv01gT6i7CWTC7ikLMTq7DPrxrqIXYXhax8TfY3gS9Xob4FeQ1yBPHnMRjb4JsUwg\nu1JXjVHK7wKBgGSQY9GoCAvURv+/ZV0HS8LCGeeXItYv8VPZ6nqi8vJbN6YUTEpm\nuQgzdwXjSuIDlBF5butn0O4kof/YFZ0Wxc3u6yMXcia5RklWy4Ecxsp9loH66aIo\nGAnsraT0KewY8eh3otCZefQuJAmvCbkZUTpu/MqTI0NoS09b1tC7h1vJAoGALRk3\nbenqtWq6W/4SlzeCIJIjY2+YrSPZZdUgiw6cE7LW0YYSOU02dbBb+lxBvXwbETbH\nIQ7jDY/eLrwFXwMNrvZqea4AFmk7H64NBu4tsv4n06KwyCyNUwVYM+DaQ4pJAfnT\nsoxmJY93/rnFxkc9uxeDMJnGZ3bJe6howRx/UxsCgYEAvNhOdVCS7V+Mru+LcfxV\nOd5LY+obT4dt0vSwt2VlvS0PPTaPKULP34/rNXyTDGYzcY0VMQWWEa8UjEoCP62u\ntBcO6thKBCxBRhc4s7EAsQXRxgirKSUns2GsvYS59HwuWNoc1fGyhmXABFI2jC1M\ntdfSfmRCOk7B8wIP7DABbx8=\n-----END PRIVATE KEY-----\n",
    "client_email": "petshopcalendar@petshop-gggr.iam.gserviceaccount.com",
    "client_id": "117904912811977112189",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/petshopcalendar%40petshop-gggr.iam.gserviceaccount.com"
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