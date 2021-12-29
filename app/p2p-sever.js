const Websocket = require('ws');
const P2P_PORT = process.env.P2P_PORT || 5001;
const peers = process.env.PEERS ? process.env.PEERS.split(','):[];

const MESSAGES_TYPES = { 
    chain: 'CHAIN',
    transaction: 'TRANSACTION'
}

class P2pServer{
    constructor(blockchain, transactionPool) {
        this.blockchain = blockchain;
        this.transactionPool = transactionPool;
        this.socktes = [];
    }

    listen(){
        const server = new Websocket.Server({port: P2P_PORT});
        server.on('connection', socket =>  this.connectSocket(socket));
        this.connectToPeers();
        console.log(`Listening for peer-to-peer conections on port: ${P2P_PORT}`);
    }
    

    connectToPeers(){
        peers.forEach(peer => {
            const socket = new Websocket(peer);
            socket.on('open', () => this.connectSocket(socket));
        });
       
    }

    connectSocket(socket){
        this.socktes.push(socket);
        console.log('Socket connected.');

        this.messageHandler(socket);
        this.sendChain(socket);
        
    }

    messageHandler(socket){
        socket.on('message', message =>{
            const data = JSON.parse(message);
            switch(data.type){
                case MESSAGES_TYPES.chain:
                    this.blockchain.replaceChain(data.chain);
                    break;
                case MESSAGES_TYPES.transaction:
                    this.transactionPool.updateOrAddTransaction(data.transaction);
                    break;

            }
            
        })
    }

    sendChain(socket){
        socket.send(JSON.stringify(
            {
                type: MESSAGES_TYPES.chain, 
                chain:this.blockchain.chain
            }));
    }

    sendTransaction(socket, transaction){
        socket.send(JSON.stringify(
            {   
                type: MESSAGES_TYPES.transaction,
                transaction
            }));
    }

    syncChains(){
        this.socktes.forEach(socket => {
            this.sendChain(socket);
        });
    }

    broadcastTransaction(transaction){
        this.socktes.forEach(socket => {
            this.sendTransaction(socket, transaction);
        })
    }
}

module.exports = P2pServer;