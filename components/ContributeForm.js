import { Router } from "../routes"
import React, { Component } from "react";
import { Button, Form, Input, Message } from "semantic-ui-react";
import Campaign from "../ethereum/campaign";
import web3 from "../ethereum/web3";

class ContributeForm extends Component {
    state = {
        value: "",
        loading: false,
        errorMessage: ""
    }

    onSubmit = async (event) => {
        event.preventDefault()
        const campaign = Campaign(this.props.address)
        this.setState({ loading: true, errorMessage: "" })
        try {
            const accounts = await web3.eth.getAccounts()
            await campaign.methods.contribute().send({ from: accounts[0], value: web3.utils.toWei(this.state.value, "ether") })
            Router.replaceRoute(`/campaigns/${this.props.address}`)

        } catch (err) {
            // console.log(err)
            this.setState({ errorMessage: err.message })
        }
        this.setState({ loading: false })
    }

    render() {
        return (
            <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
                <Form.Field>
                    <label>Amount to contribute</label>
                    <Input
                        placeholder='100'
                        labelPosition='right'
                        label="ether"
                        value={this.state.value}
                        onChange={(event) => { this.setState({ value: event.target.value }) }}
                    />
                </Form.Field>
                <Message error header="Oops!" content={this.state.errorMessage}></Message>
                <Button primary type='submit' loading={this.state.loading}>Contribute!</Button>
            </Form>
        )
    }
}

export default ContributeForm