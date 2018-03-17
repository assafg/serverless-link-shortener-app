import React, { Component } from 'react';
import { Button, Form, FormGroup, FormControl, ControlLabel, HelpBlock } from 'react-bootstrap';
import { isUri } from 'valid-url';
import './Home.css';

const SHORTEN_LINK_URL = 'https://h95amy1d6d.execute-api.eu-central-1.amazonaws.com/dev/link';

class Home extends Component {
    constructor(props, context) {
        super(props, context);

        this.handleChange = this.handleChange.bind(this);

        this.state = {
            value: '',
        };
    }

    handleChange(e) {
        this.setState({ value: e.target.value });
    }

    login() {
        this.props.auth.login();
    }

    shortenUrl() {
        const token = localStorage.getItem('id_token');

        fetch(SHORTEN_LINK_URL, {
            body: JSON.stringify({ url: this.state.value }),
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                this.setState({ shortUrl: data.shortUrl });
            })
            .catch(e => {
                console.log('error', e);
            });
    }

    getValidationState() {
        const length = this.state.value.length;
        const url = this.state.value;
        if (isUri(url)) return 'success';
        else if (length > 3) return 'warning';
        else if (length > 0) return 'error';
        return null;
    }

    renderShortenForm() {
        const { shortUrl } = this.state;
        return (
            <Form>
                <FormGroup controlId="formBasicText" validationState={this.getValidationState()}>
                    <ControlLabel>Shorten a URL</ControlLabel>
                    <FormControl
                        type="text"
                        value={this.state.value}
                        placeholder="Enter URL"
                        onChange={this.handleChange}
                    />
                    <FormControl.Feedback />
                    <HelpBlock>Should be a valid url</HelpBlock>
                    <Button onClick={() => this.shortenUrl()}>Go!</Button>
                </FormGroup>
                { shortUrl &&
                    <div className="result">
                        <span>{`https://${shortUrl}`}</span>
                    </div>
                }
            </Form>
        );
    }
    render() {
        const { isAuthenticated } = this.props.auth;
        return (
            <div className="container">
                {isAuthenticated() && this.renderShortenForm()}
                {!isAuthenticated() && (
                    <h4>
                        You are not logged in! Please{' '}
                        <a
                            style={{
                                cursor: 'pointer',
                            }}
                            onClick={this.login.bind(this)}
                        >
                            Log In
                        </a>{' '}
                        to continue.
                    </h4>
                )}
            </div>
        );
    }
}

export default Home;
