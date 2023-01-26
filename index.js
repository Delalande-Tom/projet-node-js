const express = require('express')
const app = express()
const axios = require('axios')
const passport = require('passport')
const jwt = require('jsonwebtoken')
const passportJWT = require('passport-jwt')
const restDB = axios.create({
    headers:
        {
            'cache-control': 'no-cache',
            'x-apikey': '63ce63d3969f06502871b11b',
            'content-type': 'application/json'
        },
    json: true
})
const urlEncodedParser = express.urlencoded({ extended: false })
const secret = 'secretDeFou'
const ExtractJwt = passportJWT.ExtractJwt
const JwtStrategy = passportJWT.Strategy
const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: secret
}
passport.use(
    new JwtStrategy(jwtOptions, async function(payload, next) {
        const users = await restDB.get(`https://restdbtest-6339.restdb.io/rest/utilisateurs?q={"name":"${payload.name}"}`)
        for (let i = 0; i<users.data.length;i++){
            console.log(users.data[i])
            if (users.data[i].name === payload.name) {
                next(null, users.data[i])
            } else {
                next(null, false)
            }
        }


    })
)

app.use(passport.initialize())

app.get('/recettes', async function (req, res) {
    var recettes = await restDB.get('https://restdbtest-6339.restdb.io/rest/recettes')
    res.send(recettes.data)

})

app.post('/user/create',urlEncodedParser, async function (req, res) {
    console.log(req.body)
    try{
        var recette = await restDB.post('https://restdbtest-6339.restdb.io/rest/utilisateurs', {name: req.body.name, password: req.body.password})
        res.send(recette.statusText)
    }catch(error){
        res.send(error.response.statusText)
    }
})


app.post('/recettes/create',urlEncodedParser, passport.authenticate('jwt', { session: false }), async function (req, res) {
    
    try{
        var recette = await restDB.put('https://restdbtest-6339.restdb.io/rest/recettes/' + req.body.id, {name: req.body.name})
        console.log(recette)
        res.send(recette.statusText)
    }catch(error){
        var recette = await restDB.post('https://restdbtest-6339.restdb.io/rest/recettes', {name: req.body.name})
        res.send(recette.statusText)
    }
});

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


/*app.post('/recettes/create', async function (req, res) {

    if(req.body.id){
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
            var recette = await restDB.put('https://restdbtest-6339.restdb.io/rest/recettes/'+req.body.id, req.body.data)
            res.send(recette.data)
            return;
        }
        catch (error){
            errorCatcheur(error,res)
            return;
        }
    }
});*/

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
app.post('*',async function (req, res) {
    res.sendStatus(404)
})



app.listen(3000, function() {
    console.log('Example app listening on port 3000!')
})

function errorCatcheur(error, res){
    console.log(error)
    res.send(error.response.statusText)
}


