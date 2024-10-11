const https = require('https');
const {HttpsProxyAgent} = require('https-proxy-agent');

const Conection = {};


Conection.open = async ( cabinet, drawer ) => {
    (async () => {

        const proxy = 'http://disrct:area404etstech@10.224.200.26:8080'; 
    
        // Crie um agente de proxy
        const agent = new HttpsProxyAgent(proxy);

        drawer = drawer.toLowerCase();
        let postData = "0"; 
        
        for(let i = 'a'.charCodeAt(0); i <= 'o'.charCodeAt(0); i++){
            if(String.fromCharCode(i) == drawer){
                const index = i - 97;
                postData = (2 ** index).toString();
                console.log(`----------------------------`);
                console.log(`i: ${String.fromCharCode(i)}`);
                console.log(`Drawer: ${drawer}`);
                console.log(`Index: ${index}`);
                console.log(`PostData: ${postData}`);
                console.log(`----------------------------`);
            }
        }

        const req = https.request({
                hostname:'toolmanager-b1304-default-rtdb.firebaseio.com',
                path:`/${cabinet}.json`,
                agent:agent,
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json', // Define o tipo de conteúdo como JSON
                    'Content-Length': Buffer.byteLength(postData)
                }    
            },(res) => {
            let data = '';
    
    
            res.on('data', (chunk) => {
                data += chunk;
            })  ;
    
            res.on('end', () => {
                console.log(data);
            })  ;
        });
    
        req.on('error', (e) => {
            console.log('errinho'+ e);
        })
    
        req.write(postData);
        req.end()
    
    })()
}

module.exports = Conection;