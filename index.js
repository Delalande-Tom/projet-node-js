/** Requires **/
const express = require('express')
const app = express()
const axios = require('axios')
const passport = require('passport')
const jwt = require('jsonwebtoken')
const passportJWT = require('passport-jwt')

/** Config of axios requests **/
const restDB = axios.create({
    headers:
        {
            'cache-control': 'no-cache',
            'x-apikey': '63ce63d3969f06502871b11b',
            'content-type': 'application/json'
        },
    json: true
})
/** UrlParser for post method **/
const urlEncodedParser = express.urlencoded({ extended: false })
/** JWT **/
const secret = 'secretDeFou'
const ExtractJwt = passportJWT.ExtractJwt
const JwtStrategy = passportJWT.Strategy
const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: secret
}
/**
 * Generate the token to compare with an existing token
 */
passport.use(
    new JwtStrategy(jwtOptions, async function(payload, next) {
        const users = await restDB.get(`https://restdbtest-6339.restdb.io/rest/utilisateurs?q={"name":"${payload.name}"}`)
        for (let i = 0; i<users.data.length;i++){
            if (users.data[i].name === payload.name) {
                next(null, users.data[i])
            } else {
                next(null, false)
            }
        }


    })
)

/**
 * Initialise the passport at the start of the server
 */
app.use(passport.initialize())

/**
 * Route to get all recettes
 */
app.get('/recettes', async function (req, res) {
    var recettes = await restDB.get('https://restdbtest-6339.restdb.io/rest/recettes')
    res.send(recettes.data)

})

/**
 * Route to crate a user
 */
app.post('/user/create',urlEncodedParser, async function (req, res) {
    console.log(req.body)
    try{
        var recette = await restDB.post('https://restdbtest-6339.restdb.io/rest/utilisateurs', {name: req.body.name, password: req.body.password})
        res.send(recette.statusText)
    }catch(error){
        res.send(error.response.statusText)
    }
})

/**
 * Route to modified or create a new recette
 * To modified we have to use an existing id, if the id doesn't exist we create it
 */
app.post('/recettes/create',urlEncodedParser,passport.authenticate('jwt', { session: false }), async function (req, res) {
    
    try{
        var recette = await restDB.put('https://restdbtest-6339.restdb.io/rest/recettes/' + req.body.id, {name: req.body.name})
        console.log(recette)
        res.send(recette.statusText)
    }catch(error){
        var recette = await restDB.post('https://restdbtest-6339.restdb.io/rest/recettes', {name: req.body.name})
        res.send(recette.statusText)
    }
});

/**
 * Route to generate a jwt token
 */
app.post('/recettes/connexion',urlEncodedParser, async function (req, res) {
    try{
        const user = await restDB.get(`https://restdbtest-6339.restdb.io/rest/utilisateurs?q={"name":"${req.body.name}"}`)
        if(!user.data.length ||req.body.password !== user.data[0].password){
            res.sendStatus(401)
            return;
        }
        const userJwt = jwt.sign({ name: user.data[0].name }, secret)

        res.json({ jwt: userJwt })
        return;
    }
    catch (error){
        errorCatcheur(error,res)
        return;
    }
})

/**
 * Route to delete a specified recette from an id
 */
app.delete('/recettes/delete/:id', passport.authenticate('jwt', { session: false }), async function (req, res) {
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

/**
 * Route to get a specified recette from an id
 */
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
/**
 * Route taken if the route is not a defined route
 */
app.all('*',async function (req, res) {
    res.sendStatus(404)
})



/** Listener of the server on port 3000 **/
app.listen(3000, function() {
    console.log('Example app listening on port 3000!')
})

/**
 * Error catcheur for all errrors
 * @param error catched error
 * @param res resolution
 */
function errorCatcheur(error, res){
    res.send(error.response.statusText)
}


