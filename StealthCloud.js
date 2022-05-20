const express = require("express");
const https = require('https');
const bodyParser = require('body-parser');
const multer  = require('multer')
const querystring = require('querystring');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config({path:__dirname+'/.env'});
const util = require('util');
const { encrypt, decrypt } = require('./CryptoJs');
const ipAddress = Object.values(require('os').networkInterfaces()).reduce((r, list) => r.concat(list.reduce((rr, i) => rr.concat(i.family==='IPv4' && !i.internal && i.address || []), [])), []).toString().split(',')[0]
const readDir = util.promisify(fs.readdir);
const makeDir = util.promisify(fs.mkdir);
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);
const deleteFile = util.promisify(fs.unlink);
const exists = util.promisify(fs.exists);

const crypto = require('crypto');
const authAPI = {
    generateSalt: () => crypto.randomBytes(16).toString('hex'),
    generateJSONWebTokenSecret: () => crypto.randomBytes(64).toString('hex'),
    hashPasswordWithSalt: ({password, salt}) => crypto.pbkdf2Sync(password, salt, 100000, 64, `sha512`).toString(`hex`),
    hashPasswordToJSON: (password) => {
        const salt = authAPI.generateSalt()
        const hash = authAPI.hashPasswordWithSalt({password, salt})
        return JSON.stringify({hash, salt})
    }
}

async function readJSON(jsonFile){
    const json = await readFile(jsonFile, 'utf8')
    const data = JSON.parse(json)
    return data
}

const server = express();
const uploadPath = './data';
const staticPath = __dirname + '/public';
const upload = multer({ dest: uploadPath })
const dataRoot = ``
const dataPath = `${__dirname}/${dataRoot}data`
async function loadDataPath(){
    const dataPathExists = await exists(dataPath)
    if(!dataPathExists) await makeDir(dataPath)
}
loadDataPath()

server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
server.use(express.static(staticPath));

server.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, HTTP");
    next();
});

const middleware = {
    authenticateToken: async (req, res, next) => {
        const authHeader = req.headers['authorization']
        const token = authHeader && authHeader.split(' ')[1]
        if (token == null) return res.send({err: "invalid token"})
        const adminPath = `${__dirname}/${dataRoot}auth.json`
        const adminJSON = await readFile(adminPath, 'utf8')
        const adminData = JSON.parse(adminJSON)
        if(adminData[req.params.namespace]){
            const server_secret = decrypt(token, adminData[req.params.namespace])
            if (server_secret === "VkX1+kOSx++1BjjqMy9i875zT0tKNUEXHqAvQ"){
                const namespaceRoot = `${__dirname}/${dataRoot}data/${req.params.namespace}`
                const namespaceRootExists = await exists(namespaceRoot)
                if(!namespaceRootExists) await makeDir(namespaceRoot)
                if(req){
                    if(req.body){
                        if(req.body.text){
                            req.body.text = decrypt(req.body.text, adminData[req.params.namespace])
                        }
                    }
                }
                next()
            } else {
                return res.send({err: "invalid token"}) 
            }
        } else { 
            return res.send({err: "invalid token"}) 
        }
    }
}

const templateAPI = {
    interoplateTemplate: (template, props) => {
        const defaults = {
            title: `Stealth Jet`,
            head: ``,
            main: ``
        }
        const values = { ...defaults, ...props}
        let result = template
        for(key in values){
            result = result.replace(`{${key}}`, values[key])
        }
        return result
    },
    loadTemplate: async (templateName, props) => {
        const template = await readFile(`${__dirname}/templates/${templateName}.html`, 'utf8')
        return templateAPI.interoplateTemplate(template, props)
    }
}

server.get('/salt', async (req, res) => {
    const template = await templateAPI.loadTemplate('fullscreen',  {
        title: 'Salt',
        main: `${authAPI.generateSalt()}`,
        head: ``
    })
    res.send(template)
})

server.post('/:namespace/checkToken', middleware.authenticateToken, async (req, res) => {
    res.send({success: 'true'})
})

server.post('/:namespace/signin', middleware.authenticateToken, async (req, res) => {
    res.send({success: 'true'})
})

server.post('/:namespace/create/:id', middleware.authenticateToken, async (req, res) => {
    const { id, namespace } = req.params
    const fileLocation = `${__dirname}/${dataRoot}data/${namespace}/${id}`
    const fileExists = await exists(fileLocation)
    if(fileExists){
        res.send('File already exists');
    } else {
        await writeFile(fileLocation, req.body.text, 'utf8')
        res.send(`${id}`)
    }
})

server.post('/:namespace/read/:id', middleware.authenticateToken, async (req, res) => {
    const { id, namespace } = req.params
    const fileLocation = `${__dirname}/${dataRoot}data/${namespace}/${id}`
    const fileExists = await exists(fileLocation)
    if(fileExists){
        const file = await readFile(fileLocation, 'utf8')
        res.send(file);
    } else {
        res.send(`File doesn't exist`)
    }
})

server.post('/:namespace/update/:id', middleware.authenticateToken, async (req, res) => {
    const { id, namespace } = req.params
    const fileLocation = `${__dirname}/${dataRoot}data/${namespace}/${id}`
    const fileExists = await exists(fileLocation)
    if(fileExists){
        await writeFile(fileLocation, req.body.text, 'utf8')
        res.send(id)
    } else {
        res.send(`File doesn't exist`)
    }
})

server.post('/:namespace/delete/:id', middleware.authenticateToken, async (req, res) => {
    const { id, namespace } = req.params
    const fileLocation = `${__dirname}/${dataRoot}data/${namespace}/${id}`
    const fileExists = await exists(fileLocation)
    if(fileExists){
        await deleteFile(fileLocation)
        res.send(`${id}`)
    } else {
        res.send(`File doesn't exist`)
    }
})

server.get('/:namespace/ids', middleware.authenticateToken, async (req, res) => {
    const { namespace } = req.params
    const ids = await readDir(`${__dirname}/${dataRoot}data/${namespace}`)
    res.send(ids)
})

server.get(`/`, async (req, res) => {
    const template = await templateAPI.loadTemplate('fullscreen',{
        main: `
            <div style="text-align: center; width: 100%; margin: 20px 0px;">
                <a href="https://StealthJet.io"><img src="/images/StealthCloud.svg" width="200" style="margin:auto;"/></a>
                <br/>
                <a class='button' href="https://github.com/StealthJet/StealthJet">Unlock</a>
            </div>
        `
    })
    res.send(template)
})

const PORT = 8080;
server.listen(PORT, function() {
    console.log(`☁ STEALTHCLOUD IS IN THE SKY ☁`)
    console.log(`☁ ☁ http://127.0.0.1:${PORT}/ ☁ ☁`)
});
