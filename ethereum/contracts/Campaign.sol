pragma solidity ^0.4.17;

contract CampaignFactory {
    address[] public deployedCampaigns;

    function createCampaign(uint256 minimum) public {
        address newCampaign = new Campaign(minimum, msg.sender);
        deployedCampaigns.push(newCampaign);
    }

    function getDeployedCampaigns() public view returns (address[]) {
        return deployedCampaigns;
    }
}

contract Campaign {
    struct Request {
        string description;
        uint256 amount;
        address recipient;
        bool complete;
        mapping(address => bool) approvals;
        uint256 approvalCount;
    }

    address public manager;
    uint256 public minimumContribution;
    mapping(address => bool) public approvers;
    uint256 public approversCount;
    Request[] public requests;

    modifier restricted() {
        require(msg.sender == manager);
        _;
    }

    constructor(uint256 minimum, address creator) public {
        manager = creator;
        minimumContribution = minimum;
    }

    function contribute() public payable {
        require(msg.value > minimumContribution);
        approvers[msg.sender] = true;
        approversCount++;
    }

    function createRequest(
        string description,
        uint256 value,
        address recipient
    ) public restricted {
        Request memory newRequest = Request({
            description: description,
            amount: value,
            recipient: recipient,
            complete: false,
            approvalCount: 0
        });

        requests.push(newRequest);
    }

    function approveRequest(uint256 index) public {
        Request storage selectedRequest = requests[index];
        //Check if user is an approvers
        require(approvers[msg.sender]);
        //Check if user has/hasn't approved the request
        require(!selectedRequest.approvals[msg.sender]);

        selectedRequest.approvals[msg.sender] = true;
        selectedRequest.approvalCount++;
    }

    function finalizeRequest(uint256 index) public restricted {
        Request storage selectedRequest = requests[index];
        //Cegah finalized request yang udah complete
        require(!selectedRequest.complete);
        //Cek udah berapa persent YES approvals
        require(selectedRequest.approvalCount > (approversCount / 2));

        //Send to recipient
        selectedRequest.recipient.transfer(selectedRequest.amount);
        selectedRequest.complete = true;
    }
}
