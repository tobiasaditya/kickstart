import React, { Component } from "react";
import { Button, Table } from "semantic-ui-react";
import Layout from "../../../components/Layout";
import RequestRow from "../../../components/RequestRow";
import Campaign from "../../../ethereum/campaign";
import { Link } from "../../../routes";
class RequestIndex extends Component {
    static async getInitialProps(props) {
        const campaign = Campaign(props.query.address)
        const requestCount = await campaign.methods.getRequestCount().call()
        const approversCount = await campaign.methods.approversCount().call()
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
            requestCount: requestCount,
            approversCount: approversCount
        }
    }

    renderRows() {
        return this.props.requests.map((request, index) => {
            return <RequestRow
                request={request}
                key={index}
                id={index}
                address={this.props.address}
                approversCount={this.props.approversCount}></RequestRow>
        })
    }
    render() {
        const { Header, Row, HeaderCell, Body } = Table
        return (
            <Layout>
                <h3>Request List</h3>
                <Link route={`/campaigns/${this.props.address}/request/new`}>
                    <a>
                        <Button primary floated="right" style={{ marginBottom: 10 }}>Add Request</Button>
                    </a>
                </Link>
                <Table>
                    <Header>
                        <Row>
                            <HeaderCell>ID</HeaderCell>
                            <HeaderCell>Description</HeaderCell>
                            <HeaderCell>Amount</HeaderCell>
                            <HeaderCell>Recepient</HeaderCell>
                            <HeaderCell>Approval Count</HeaderCell>
                            <HeaderCell>Approve</HeaderCell>
                            <HeaderCell>Finilaze</HeaderCell>
                        </Row>
                    </Header>

                    <Body>
                        {this.renderRows()}
                    </Body>

                </Table>
                <div>Found {this.props.requestCount} requests</div>
            </Layout>

        )
    }
}

export default RequestIndex