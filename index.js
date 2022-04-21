const express = require('express')
const app = express()
const port = 8080
const swaggerUi = require('swagger-ui-express')
const yamljs = require('yamljs')
const swaggerDocument = yamljs.load('./docs/swagger.yaml');

app.use(express.json())

const movies = [
    {id: 1, name: "The Internship", year: 1999},
    {id: 2, name: "Hangover", year: 2010},
    {id: 3, name: "Titanic", year: 1996},
    {id: 4, name: "Harry Potter and the Philosopher's Stone", year: 2005},
    {id: 5, name: "Inception", year: 2018},
    {id: 6, name: "Fyre", year: 2020},
    {id: 7, name: "The Danish Girl", year: 2019},
    {id: 8, name: "The Notebook", year: 2009},
]

app.get('/movies', (req, res) => {
    res.send(movies)
})

app.get('/movies/:id', (req, res) => {

    if (typeof movies[req.params.id - 1] === 'undefined') {
        return res.status(404).send({error: "Movie not found"})
    }
    res.send(movies[req.params.id - 1])
})

app.post('/movies', (req, res) => {
    if (!req.body.name || !req.body.year) {
        return res.status(400).send({ error: 'One or all params are missing'})
    }
    let movie = {
        id: movies.length + 1,
        year: req.body.year,
        name: req.body.name
    }

    movies.push(movie)

    res.status(201)
        .location(`${getBaseUrl(req)}/movies/${movies.length}`)
        .send(movie)
})

app.delete('/movies/:id', (req, res) => {
    if (typeof movies[req.params.id - 1] === 'undefined') {
        return res.status(404).send({error: "Movie not found"})
    }

    movies.splice(req.params.id - 1, 1)

    res.status(204).send({error: "No content"})
})

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

app.listen(port, () => { 
    console.log(`API up at: http://localhost:${port}`)
})

function getBaseUrl(req) {
    return req.connection && req.connection.encrypted
        ? 'https' : 'http' + `://${req.headers.host}`
}