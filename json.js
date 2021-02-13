const fs = require('fs');

var obj = {
    "richContent" : [
        []
    ]
}


const genres = fs.readFileSync('genres.json');
const genres_list = JSON.parse(genres);

genres_list.genres.map((item)=>{
    console.log(item.name);
    let lowerName = item.name.toLowerCase();
    obj.richContent[0].push(
        {
            "event": {
              "languageCode": "en-US",
              "parameters": {
                "genre": lowerName
              },
              "name": `${lowerName}-trigger`
            },
            "type": "list",
            "title": item.name
        }
    )
}) 

console.log(obj.richContent[0])

fs.writeFile('list.json',JSON.stringify(obj),()=>{console.log("written file")})