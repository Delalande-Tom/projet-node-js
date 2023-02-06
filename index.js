/** Requires **/
const express = require('express')
const app = express()
const passport = require('passport')
const passportJWT = require('passport-jwt')
const users = require('./users.js')
const recettes = require('./recettes.js')

/** UrlParser for post method **/
const urlEncodedParser = express.urlencoded({ extended: false })
/** JWT **/
const ExtractJwt = passportJWT.ExtractJwt
const JwtStrategy = passportJWT.Strategy
const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: users.secret
}
/**
 * Generate the token to compare with an existing token
 */
passport.use(new JwtStrategy(jwtOptions, users.verify))

/**
 * Initialise the passport at the start of the server
 */
app.use(passport.initialize())

/**
 * Route to crate a user
 */
app.post('/user/create',urlEncodedParser,users.create)
/**
 * Route to connect, generate a jwt token
 */
app.post('/recettes/connexion',urlEncodedParser, users.connexion)


/**
 * Route to get all recettes
 */
app.get('/recettes', recettes.getAll)

/**
 * Route to get a specified recette from an id
 */
app.get('/recette/:id', recettes.get)

/**
 * Route to modified or create a new recette
 * To modified we have to use an existing id, if the id doesn't exist we create it
 */
app.post('/recettes/create',urlEncodedParser,passport.authenticate('jwt', { session: false }),recettes.createOrModify);

/**
 * Route to delete a specified recette from an id
 */
app.delete('/recettes/delete/:id', passport.authenticate('jwt', { session: false }), recettes.delete);
/**
 * Route to welcome
 */
app.get('/',async function (req, res) {
    res.send('Welcome on the Api, check the doc !\n [URL]')
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


