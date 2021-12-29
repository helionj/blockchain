const { intFromLE } = require('elliptic/lib/elliptic/utils');
const Wallet = require('./index');
const TransactionPool = require('./transaction-pool');

describe('Wallet', () => {
    let wallet, tp;

    beforeEach(()=> {
        wallet = new Wallet();
        tp = new TransactionPool();
    });

    describe('creating a transaction', () => {
        let transaction, sendAmount, recipient;
        beforeEach(()=> {
            sendAmount = 50;
            recipient = 'rw-456-degf';
            transaction = wallet.createTransaction(recipient, sendAmount, tp);
        });

        describe('and doing the same transaction', () => {
            beforeEach(()=> {
                transaction = wallet.createTransaction(recipient, sendAmount, tp);
            });

            it('doubles the "sendAmount" subtracted from the wallet balance', () => {
                expect(transaction.outputs.find(output => output.address === wallet.publicKey).amount)
                    .toEqual(wallet.balance - sendAmount*2);
            })

            it('clones the "sendAmount" for the recipient', () => {
                expect(transaction.outputs.filter(output => output.address === recipient)
                .map(output => output.amount)).toEqual([sendAmount, sendAmount]);
            })
    
        });



    });
})