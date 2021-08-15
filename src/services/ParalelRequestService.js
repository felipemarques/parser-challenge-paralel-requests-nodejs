const axios = require('axios')

function ParalelRequestService() {

    const listOfEndpoints = [
        {'twitter': 'http://codefight.davidbanham.com/twitter'},
        {'facebook': 'http://codefight.davidbanham.com/facebook'},
        {'instagram': 'http://codefight.davidbanham.com/instagram'},
    ]

    const endpointsCopy = listOfEndpoints.slice()

    async function asyncOperation(url) {

        const socialNetwork = Object.keys(url)[0]
        const endpoint = url[socialNetwork]

        let response = null

        try {
            const responseObject = await axios.get(endpoint)
            response = {
                status: responseObject.status,
                data: responseObject.data,
                isAxiosError: false
            }
        } catch (e) {
            
            response = {
                status: e.response.status,
                data: e.response.data,
                isAxiosError: e.isAxiosError
            }
        }

        url[socialNetwork] = response.data

        return url
    }

    function recursiveCallAsyncOperation(p) {
        if (endpointsCopy.length) {
            const url = endpointsCopy.shift()
            return p.then(() => {
                const operationPromise = asyncOperation(url)
                return recursiveCallAsyncOperation(operationPromise)
            })
        }
        return p
    }

    this.getAll = async function() {

        const promises = new Array(listOfEndpoints.length).fill(Promise.resolve())
        const result = await Promise.all(promises.map(recursiveCallAsyncOperation))

        return result;
    }

}

module.exports = ParalelRequestService