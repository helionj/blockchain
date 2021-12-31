const TransactionPool = require ('./transaction-pool');
const Transaction = require ('./transaction');
const Wallet = require('./index');
const Blockchain = require('../blockchain');

describe('TransactionPool', ()=> {
    let tp, wallet, transaction, bc;

    beforeEach(() => {
        tp = new TransactionPool();
        wallet = new Wallet();
        bc = new Blockchain();
        transaction = wallet.createTransaction('r4nd-jeras34', 30, bc, tp)
    });

    it('add a transaction to the pool', () => {
        expect(tp.transactions.find(t => t.id === transaction.id)).toEqual(transaction);
    });

    it('updates transaction in the pool', () => {
        const oldTransaction = JSON.stringify(transaction);
        const newTransaction = transaction.update(wallet, 'foo-4ddr-335', 40);
        tp.updateOrAddTransaction(newTransaction);

        expect(JSON.stringify(tp.transactions.find(t => t.id === newTransaction.id))).not.toEqual(oldTransaction);
    });

    it('clear the pool', () => {
        tp.clear();
        expect(tp.transactions).toEqual([]);
    })

    describe('mixing valid and corrupt transactions', () => {
        let validTransactions = [];
        beforeEach(()=> {
            validTransactions = [...tp.transactions];
            for(let i = 0; i < 6; i++){
                wallet = new Wallet();
                transaction = wallet.createTransaction('rnd-457-3yz', 30, bc, tp);
                if(i%2 ==0){
                    transaction.input.amount = 9999;
                }else{
                    validTransactions.push(transaction);
                }
            }
        });

        it('shows the difference between valid and corrupt transactions', () =>{
            expect(JSON.stringify(tp.transactions)).not.toEqual(JSON.stringify(validTransactions));
        });

        it('grabs valid transactions', () => {
            expect(tp.validTransactions()).toEqual(validTransactions);
        });
    })


})