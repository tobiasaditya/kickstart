import React, { Component } from "react";
import { Button } from "semantic-ui-react";
import Layout from "../../../components/Layout";
import { Link } from "../../../routes";
class RequestIndex extends Component {
    static async getInitialProps(props) {
        return {
            address: props.query.address
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