const express = require('express')
const ParalelRequestService = require('./services/ParalelRequestService');
const app = express()
const port =  process.env.PORT || 3000
const host =  process.env.HOST || '0.0.0.0'

app.get('/', async (req, res) => {

    const paralelRequest = new ParalelRequestService();
    const json = await paralelRequest.getAll()

    res.json(json)
})

app.listen(port, host, () => {
  console.log(`Listening at http://${host}:${port}`)
})
