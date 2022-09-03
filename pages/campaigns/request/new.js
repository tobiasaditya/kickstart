import React, { Component } from "react";
import { Button, Form, Input, Message } from "semantic-ui-react";
import Layout from "../../../components/Layout";
import Campaign from "../../../ethereum/campaign";
import web3 from "../../../ethereum/web3";
import { Router, Link } from "../../../routes";

class RequestNew extends Component {
    state = {
        description: "",
        value: "",
        recepient: "",
        loading: false,
        errorMessage: ""
    }
    static async getInitialProps(props) {
        return {
            address: props.query.address
        }
    }

    onSubmit = async (event) => {
        event.preventDefault()
        const campaign = Campaign(this.props.address)
        this.setState({ loading: true, errorMessage: "" })
        try {
            const accounts = await web3.eth.getAccounts()
            await campaign.methods
                .createRequest(this.state.description, web3.utils.toWei(this.state.value, "ether"), this.state.recepient)
                .send({ from: accounts[0] })
            Router.pushRoute(`/campaigns/${this.props.address}/request`)

        } catch (err) {
            console.log(err)
            this.setState({ errorMessage: err.message })
        }
        this.setState({ loading: false })
    }

    render() {
        return (
            <Layout>
                <Link route={`/campaigns/${this.props.address}/request`}>
                    <a>
                        Back
                    </a>
                </Link>
                <h3>Create request</h3>
                <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
                    <Form.Field>
                        <label>Description</label>
                        <Input
                            value={this.state.description}
                            onChange={(event) => { this.setState({ description: event.target.value }) }}
                        />
                    </Form.Field>

                    <Form.Field>
                        <label>Value</label>
                        <Input
                            labelPosition='right'
                            label="ether"
                            value={this.state.value}
                            onChange={(event) => { this.setState({ value: event.target.value }) }}
                        />
                    </Form.Field>

                    <Form.Field>
                        <label>Recepient Address</label>
                        <Input
                            value={this.state.recepient}
                            onChange={(event) => { this.setState({ recepient: event.target.value }) }}
                        />
                    </Form.Field>

                    <Message error header="Oops!" content={this.state.errorMessage}></Message>
                    <Button primary type='submit' loading={this.state.loading}>Contribute!</Button>
                </Form>
            </Layout>
        )
    }
}

export default RequestNew