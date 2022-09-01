const assert = require('assert');
const ganace = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganace.provider());

const compiledFactory = require("../ethereum/build/CampaignFactory.json");
const compiledCampaign = require("../ethereum/build/Campaign.json");

let factory;
let accounts;
let campaignAddress;
let campaign;

beforeEach(async () => {
    accounts = await web3.eth.getAccounts()
    //Deploy factory
    factory = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
        .deploy({ data: compiledFactory.bytecode })
        .send({ from: accounts[0], gas: "1000000" })

    await factory.methods.createCampaign('100').send({ from: accounts[0], gas: "1000000" })

    campaignAddress = (await factory.methods.getDeployedCampaigns().call())[0]

    campaign = await new web3.eth.Contract(JSON.parse(compiledCampaign.interface), campaignAddress)
}
)


describe("Campaigns", () => {
    it("deployed factory and campaign", () => {
        assert.ok(factory.options.address);
        assert.ok(campaign.options.address)
    })
    it("correct manager", async () => {
        const manager = await campaign.methods.manager().call();
        assert.equal(manager, accounts[0])
    })
    it("able to contribute", async () => {
        await campaign.methods.contribute().send({ from: accounts[1], value: "200" })

        const isContributor = await campaign.methods.approvers(accounts[1]).call();
        assert.ok(isContributor);
    })
    it("required amount to contribute", async () => {
        try {
            await campaign.methods.contribute().send({ from: accounts[1], value: "0" });
            assert(false)
        } catch (err) {
            assert(err)
        }
    })
    it("create request", async () => {
        await campaign.methods.createRequest("Testingg", "100", accounts[1]).send({ from: accounts[0], gas: "1000000" })

        const requests = await campaign.methods.requests(0).call()
        assert.equal(requests.description, "Testingg")
    })
    it("process request", async () => {
        let initBalance = await web3.eth.getBalance(accounts[1])
        initBalance = web3.utils.fromWei(initBalance, 'ether')
        initBalance = parseFloat(initBalance)

        // 0 contribute
        await campaign.methods.contribute().send({ from: accounts[0], value: web3.utils.toWei('10', 'ether') });
        // 0 create request payment to be send to 1
        await campaign.methods.createRequest("A", web3.utils.toWei('5', 'ether'), accounts[1]).send({ from: accounts[0], gas: "1000000" })
        // 0 (as contributor) approve request
        await campaign.methods.approveRequest(0).send({ from: accounts[0], gas: "1000000" })
        // 0 (as manager) finilized request
        await campaign.methods.finalizeRequest(0).send({ from: accounts[0], gas: "1000000" })


        //Get 1 balance
        let finalBalance = await web3.eth.getBalance(accounts[1])
        finalBalance = web3.utils.fromWei(finalBalance, 'ether')
        finalBalance = parseFloat(finalBalance)
        console.log(initBalance)
        console.log(finalBalance)
        assert.ok(finalBalance > initBalance)
    })
})
