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

})


app.post('recettes/create', async function (req, res) {
    if(req.body.id == undefined){
        try{
            var recette = await restDB.post('https://restdbtest-6339.restdb.io/rest/recettes', req.body)
            res.send(recette.data)
            return;
        }
        catch (error){
            errorCatcheur(error,res)
            return;
        }
    }else {
        try{
            var recette = await restDB.put('https://restdbtest-6339.restdb.io/rest/recettes/'+req.body.id, req.body)
            res.send(recette.data)
            return;
        }
        catch (error){
            errorCatcheur(error,res)
            return;
        }
    }
});

app.delete('/recettes/delete/:id', async function (req, res) {
    try{
        var recette = await restDB.delete('https://restdbtest-6339.restdb.io/rest/recettes/'+req.params.id)
        res.send(recette.statusText)
        return;
    }
    catch (error){
        errorCatcheur(error,res)
        return;
    }
});

app.get('/recette/:id', async function (req, res) {
    try{
        var recette = await restDB.get('https://restdbtest-6339.restdb.io/rest/recettes/'+req.params.id)
        res.send(recette.data)
        return;
    }
    catch (error){
        errorCatcheur(error,res)
        return;
    }

})
app.get('*',async function (req, res) {
    res.sendStatus(404)
})

app.listen(3000, function() {
    console.log('Example app listening on port 3000!')
})

function errorCatcheur(error, res){
    console.log(error)
    res.send(error.response.statusText)
}