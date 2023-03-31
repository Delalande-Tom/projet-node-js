const restDBConfig = require('./restDBConfig.js')
const jwt = require("jsonwebtoken");
const restDB = restDBConfig.restDB
const secret = 'secretDeFou'


/**
 * verify user existence
 */
async function verify (payload, next) {
    const users = await restDB.get(`https://restdbtest-6339.restdb.io/rest/utilisateurs?q={"name":"${payload.name}"}`)
    for (let i = 0; i<users.data.length;i++){
        if (users.data[i].name === payload.name) {
            next(null, users.data[i])
        } else {
            next(null, false)
        }
    }
}

/**
 * create a user
 */
async function create (req,res){
    try{
        var recette = await restDB.post('https://restdbtest-6339.restdb.io/rest/utilisateurs', {name: req.body.name, password: req.body.password})
        res.send(recette.statusText)
        return;
    }catch(error){
        res.send(error.response.statusText)
        return;
    }
}

/**
 * Connect a user ans give a jwt token
 */
async function connexion (req, res) {
    try{
        const user = await restDB.get(`https://restdbtest-6339.restdb.io/rest/utilisateurs?q={"name":"${req.data.name}"}`)
        if(!user.data.length ||req.data.password !== user.data[0].password){
            res.sendStatus(401)
            return;
        }
        const userJwt = jwt.sign({ name: user.data[0].name }, secret)

        res.json({ jwt: userJwt })
        return;
    }
    catch (error){
        res.send(error.response.statusText)
        return;
    }
}


module.exports = {
    create: create,
    connexion: connexion,
    verify: verify,
    secret: secret,
}
