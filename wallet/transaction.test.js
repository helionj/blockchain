const Transaction = require('./transaction');
const Wallet = require('./index');
const { INITIAL_BALANCE } = require('../config');

describe('Transaction', () => {
    let transaction, wallet, amount, recipient;

    beforeEach(() => {
        wallet = new Wallet();
        amount = 50;
        recipient = 'r3c1p13nt';
        transaction = Transaction.newTransaction(wallet, recipient, amount);
    });

    it('outputs the "amount" subtracted from the wallet balance', ()=> {
        expect(transaction.outputs.find(output => output.address === wallet.publicKey).amount)
            .toEqual(wallet.balance - amount);
    });

    it('outputs the "amount" added to the recipient', ()=> {
        expect(transaction.outputs.find(output => output.address === recipient).amount)
            .toEqual(amount);
    });

    it('input the balance of wallet', ()=> {
        expect(transaction.input.amount).toEqual(wallet.balance);
    });

    it('validates a valid transaction', () => {
        expect(Transaction.verifyTransaction(transaction)).toBe(true);
    });

    it('invalid a corrupt transaction', () => {
        transaction.outputs[0].amount=50000;
        expect(Transaction.verifyTransaction(transaction)).toBe(false);
    });



    describe('Transacting  with a amount that exceeds the balance', () => {
        beforeEach(() => {
            amount = 50000;
            transaction = Transaction.newTransaction(wallet, recipient, amount);
        });

        it('Does not create the transaction', () => {
            expect(transaction).toEqual(undefined);
        });
    });

    describe('And updating a transaction', () => {
        let nexAmount, nextRecipient;

        beforeEach(() => {
            nextAmount = 20;
            nextRecipient = '3a00fade'
            transaction = transaction.update(wallet, nextRecipient, nextAmount);
        })

        it('subtracts the next amount from the senders  output', () => {
            expect(transaction.outputs.find(output => output.address === wallet.publicKey).amount)
                .toEqual(wallet.balance - amount - nextAmount);
        });

        it('outputs an amount for the next recipient', () => {
            expect(transaction.outputs.find(output => output.address === nextRecipient).amount)
                .toEqual(nextAmount);
        });
    })
})

