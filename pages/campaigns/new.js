import React, { Component } from "react";
import { Button, Form, Input, Message } from "semantic-ui-react";
import Layout from "../../components/Layout"
import factory from "../../ethereum/factory"
import web3 from "../../ethereum/web3"
import { Router } from "../../routes"
class CampaignNew extends Component {

    state = {
        minimumContribution: "",
        errorMessage: "",
        loading: false
    }

    onSubmit = async (event) => {
        event.preventDefault()
        this.setState({ loading: true, errorMessage: "" })
        try {
            const accounts = await web3.eth.getAccounts()
            await factory.methods.createCampaign(this.state.minimumContribution).send({ from: accounts[0] })
            Router.pushRoute("/") //Only route to home if success
        } catch (err) {
            this.setState({ errorMessage: err.message })
        }
        this.setState({ loading: false })

    }

    render() {
        return (
            <Layout>
                <h1>This is a new campaign</h1>
                <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
                    <Form.Field>
                        <label>Minimum Contribution</label>
                        <Input
                            placeholder='0'
                            labelPosition='right'
                            label="wei"
                            value={this.state.minimumContribution}
                            onChange={(event) => { this.setState({ minimumContribution: event.target.value }) }}
                        />
                    </Form.Field>
                    <Message error header="Oops!" content={this.state.errorMessage}></Message>
                    <Button primary type='submit' loading={this.state.loading}>Submit</Button>
                </Form>
            </Layout>
        )
    }
}

export default CampaignNew