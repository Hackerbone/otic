const express = require('express');
const bodyParser = require('body-parser');
require('./db.js')();
const port = process.env.PORT || 4000;

const app = express();

app.use(bodyParser.json());

app.get('/webhook/:key', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    let genreToSend = req.params.key;
    res.send(JSON.stringify(shows[genreToSend],null,4));
})

app.get('/all', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify(shows,null,4));
})

app.get('/genres', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify(genres,null,4));
})


function setResponse(obj ,genre) {
    var response = {
        "fulfillmentText" : `Here are some ${genre} shows`,
        "fulfillmentMessages": []
    };
    const temp = {
        "text": {
            "text": [
                `Sure , here are some popular ${genre} tv shows :`
            ]
        }
    }
    response.fulfillmentMessages.push(temp);
    
    obj.shows.map((item) => {
        response.fulfillmentMessages.push({
       
            "payload": {
              "richContent": [
                [
                  {
                    "type": "info",
                    "subtitle": item.overview,
                    "title": item.name
                  }
                ]
              ]
            }
          },
        )//push
    })
    return response;
}

function setGenreResponse(){
    var response = {
        "fulfillmentText" : `Here are all the genres : `,
        "fulfillmentMessages": []
    };
    const temp = {
        "text": {
            "text": [
                `Here are all the genres :`
            ]
        }
    }
    response.fulfillmentMessages.push(temp);

    genres.genres.forEach(item=>{
        response.fulfillmentMessages.push({
       
            "payload": {
              "richContent": [
                [
                  {
                    "type": "info",
                    "title": item.name
                  }
                ]
              ]
            }
          },
        )//push
    })

    return response;
}


app.post('/webhook', (req, res) => {
    console.log("Got a post request");
    if (!req.body) return res.sendStatus(400);
    res.setHeader('Content-Type', 'application/json');
    console.log("Post req is :");
    console.log(req.body);

    if(req.body.queryResult.action !== 'getGenres'){
        console.log("Parameters : " + req.body.queryResult.parameters['genre']);
        var genreToSend = req.body.queryResult.parameters['genre'];
        for (var genreType in shows) {
            if (genreToSend === genreType) {

        const resp = setResponse(eval(`shows.${genreType}`), genreType);
                console.log(resp);
                return res.json(resp);

            }
        }
    }
    else{
        const response = setGenreResponse();
        res.json(response);
    }
})

app.listen(port, () => console.log('Server started on port ' + port));