import React, { Component } from "react";
import { Card } from "semantic-ui-react";
import Layout from "../../components/Layout";
import Campaign from "../../ethereum/campaign";
import web3 from "../../ethereum/web3";
class CampaignShow extends Component {
    static async getInitialProps(props) {
        console.log(props)
        const campaign = Campaign(props.query.address)
        const summary = await campaign.methods.getSummary().call()
        console.log(summary)
        return {
            minimumContribution: summary['0'],
            balance: summary['1'],
            requestCount: summary['2'],
            approversCount: summary['3'],
            manager: summary['4']
        }

    }
    renderCards() {
        const { balance, manager, minimumContribution, requestCount, approversCount } = this.props;

        const items = [
            {
                header: manager,
                meta: "Address of Manager",
                description: "User who create this campaign and can create request",
                style: { overflowWrap: 'break-word' }
            },
            {
                header: minimumContribution,
                meta: "Minimum Contribution (wei)",
                description: "Minimum amount of wei to become a contributor",
            },
            {
                header: requestCount,
                meta: "Number of request",
                description: "A request tries to withdraw money and made by manager.",
            },
            {
                header: approversCount,
                meta: "Number of approvers",
                description: "Total count of people who has contributed to this campaign",
            },
            {
                header: web3.utils.fromWei(balance, 'ether'),
                meta: "Balance (ether)",
                description: "Current campaign balance",
            }
        ]
        return <Card.Group items={items}></Card.Group>
    }
    render() {
        return (
            <Layout>
                <h3>Campaign Details</h3>
                {this.renderCards()}
            </Layout>
        )
    }
}

export default CampaignShow