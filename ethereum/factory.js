import web3 from './web3';
import CampaignFactory from "./build/CampaignFactory.json";

const instance = new web3.eth.Contract(JSON.parse(CampaignFactory.interface), '0xC4Ce3B068035591905727396AdF3E25bAbec5909');

export default instance;