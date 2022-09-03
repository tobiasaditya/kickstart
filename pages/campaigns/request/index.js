import React, { Component } from "react";
import { Button } from "semantic-ui-react";
import Layout from "../../../components/Layout";
import Campaign from "../../../ethereum/campaign";
import { Link } from "../../../routes";
class RequestIndex extends Component {
    static async getInitialProps(props) {
        const campaign = Campaign(props.query.address)
        const requestCount = await campaign.methods.getRequestCount().call()
        console.log(requestCount)
        //Call all request using 1 request!
        const requests = await Promise.all(
            Array(parseInt(requestCount)).fill().map((element, index) => {
                return campaign.methods.requests(index).call()
            })
        )

        console.log(requests)

        return {
            address: props.query.address,
            requests: requests,
            requestCount: requestCount
        }
    }
    render() {
        return (
            <Layout>
                <h3>Request List</h3>
                <Link route={`/campaigns/${this.props.address}/request/new`}>
                    <a>
                        <Button primary>Add Request</Button>
                    </a>
                </Link>
            </Layout>

        )
    }
}

export default RequestIndex