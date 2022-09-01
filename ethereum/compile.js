const path = require("path");
const fs = require("fs-extra");
const solc = require("solc");

const buildPath = path.resolve(__dirname, "build");

//Delete build folder
fs.removeSync(buildPath);

const campaignPath = path.resolve(__dirname, "contracts", "Campaign.sol")

const source = fs.readFileSync(campaignPath, "utf8");

const output = solc.compile(source, 1).contracts;

//Make new build dir (check if exist, if not, make a new one)
fs.ensureDirSync(buildPath);

for (let contract in output) {
    fs.outputJsonSync(
        path.resolve(buildPath, contract.replace(":", "") + ".json"),
        output[contract]
    )
}