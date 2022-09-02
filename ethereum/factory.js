import web3 from './web3';
import CampaignFactory from "./build/CampaignFactory.json";
//Old Contract
// const instance = new web3.eth.Contract(JSON.parse(CampaignFactory.interface), '0xC4Ce3B068035591905727396AdF3E25bAbec5909');
//New contract (with function summary and get approval count)
const instance = new web3.eth.Contract(JSON.parse(CampaignFactory.interface), '0x95C6D23afE31cf0F31542749D03656410E665b29');

export default instance;