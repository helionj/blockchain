const TransactionPool = require ('./transaction-pool');
const Transaction = require ('./transaction');
const Wallet = require('./index');
const { intFromLE } = require('elliptic/lib/elliptic/utils');

describe('TransactionPool', ()=> {
    let tp, wallet, transaction;

    beforeEach(() => {
        tp = new TransactionPool();
        wallet = new Wallet();
        transaction = Transaction. newTransaction(wallet, 'r4nd-jeras34', 30);
        tp.updateOrAddTransaction(transaction);
       

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


})