const restDBConfig = require('./restDBConfig.js')
const restDB = restDBConfig.restDB

/**
 * Get All recettes
 */
async function getAll (req, res) {
    var recettes = await restDB.get('https://restdbtest-6339.restdb.io/rest/recettes')
    res.send(recettes.data)
}

/**
 * Create or modify a recette
 */
async function create (req, res) {
    if(req.body.name==null || req.body.price == null || req.body.category == null ||req.body.dificulty == null|| req.body.dificulty<1 || req.body.dificulty>5){
        res.sendStatus(400)
        return;
    }
    try{
        var recette = await restDB.put('https://restdbtest-6339.restdb.io/rest/recettes/' + req.body.id, {name: req.body.name, price: req.body.price, category: req.body.category, dificulty: req.body.dificulty})
        console.log(recette)
        res.send(recette.statusText)
        return;
    }catch(error){
        var recette = await restDB.post('https://restdbtest-6339.restdb.io/rest/recettes', {name: req.body.name, price: req.body.price, category: req.body.category, dificulty: req.body.dificulty})
        res.send(recette.statusText)
        return;
    }
}

/**
 * Delete a recette
 */
async function deleted (req, res) {
    try{
        var recette = await restDB.delete('https://restdbtest-6339.restdb.io/rest/recettes/'+req.params.id)
        res.send(recette.statusText)
        return;
    }
    catch (error){
        res.send(error.response.statusText)
        return;
    }
}

/**
 * get a recette
 */
async function get (req, res) {
    try{
        var recette = await restDB.get('https://restdbtest-6339.restdb.io/rest/recettes/'+req.params.id)
        res.send(recette.data)
        return;
    }
    catch (error){
        res.send(error.response.statusText)
        return;
    }

}


module.exports = {
    getAll: getAll,
    createOrModify: create,
    delete: deleted,
    get: get
}