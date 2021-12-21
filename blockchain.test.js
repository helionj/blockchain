const Blockchain = require('./blockchain');
const Block = require ('./block');

describe( 'Blockchain',  () => {

    let bc;

    beforeEach(()=> {
       bc = new Blockchain();
    })
    it('sets the `data` to match the input', () => {
        expect(bc.chain[0]).toEqual(Block.genesis());
    });

    it('add a new block', () => {
        const data = 'foo';
        bc.addBlock(data);
        expect(bc.chain[bc.chain.length-1].data).toEqual(data);
    });
});