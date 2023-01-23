const express = require('express')
const app = express()
const axios = require('axios')
const restDB = axios.create({
    headers:
        {
            'cache-control': 'no-cache',
            'x-apikey': '63ce63d3969f06502871b11b',
            'content-type': 'application/json'
        },
    json: true
})

app.get('/recettes', async function (req, res) {


    var recettes = await restDB.get('https://restdbtest-6339.restdb.io/rest/recettes')
    res.send(recettes.data)
    console.log(recettes.data)

})

app.listen(3000, function() {
    console.log('Example app listening on port 3000!')
})