import * as React from "react";
import { Link, Redirect, RouteComponentProps } from 'react-router-dom';
import { RoutePaths } from './Routes';
import AuthService from '../services/Auth';
let authStyle = require('../styles/auth.styl');
let authService = new AuthService();

export class SignIn extends React.Component<RouteComponentProps<any>, any> {
    refs: {
        username: HTMLInputElement;
        password: HTMLInputElement;
    };

    state = {
        initialLoad: true,
        error: null as string
    };

    handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        this.setState({ errors: null, initialLoad: false });
        authService.signIn(this.refs.username.value, this.refs.password.value).then(response => {
            if (!response.is_error) {
                this.props.history.push(RoutePaths.Contacts);
            } else {
                this.setState({ error: response.error_content.error_description });
            }
        });
    }

    render() {
        const search = this.props.location.search;
        const params = new URLSearchParams(search);

        let initialLoadContent = null;
        if (this.state.initialLoad) {
            if (params.get('confirmed')) {
                initialLoadContent = <div className="alert alert-success" role="alert">
                    Your email address has been successfully confirmed.
                    </div>
            }

            if (params.get('expired')) {
                initialLoadContent = <div className="alert alert-info" role="alert">
                    <strong>Sesion Expired</strong> You need to sign in again.
                    </div>
            }

            if (this.props.history.location.state && this.props.history.location.state.signedOut) {
                initialLoadContent = <div className="alert alert-info" role="alert">
                    <strong>Signed Out</strong>
                </div>
            }
        }
        return <div className={authStyle.auth}>
            <form className={authStyle.formAuth} onSubmit={(e) => this.handleSubmit(e)}>
                <h2 className={authStyle.formAuthHeading}>Please sign in</h2>
                {initialLoadContent}
                {this.state.error &&
                    <div className="alert alert-danger" role="alert">
                        {this.state.error}
                    </div>
                }
                <label htmlFor="inputEmail" className="form-control-label sr-only">Email address</label>
                <input type="email" id="inputEmail" ref="username" defaultValue="user@test.com" className="form-control form-control-danger" placeholder="Email address"/>
                <label htmlFor="inputPassword" className="form-control-label sr-only">Password</label>
                <input type="password" id="inputPassword" ref="password" defaultValue="P2ssw0rd!" className="form-control" placeholder="Password" />
                <button className="btn btn-lg btn-primary btn-block" type="submit">Sign in</button>
            </form>
            <div className={authStyle.authEtc}>
                <Link to="/register">Register</Link>
            </div>
        </div>;
    }
}

export class Register extends React.Component<any, any> {
    refs: {
        email: HTMLInputElement;
        password: HTMLInputElement;
    };

    state = {
        registerComplete: false,
        errors: {} as { [key: string]: string }
    };

    handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        this.setState({ errors: {} });
        authService.register(this.refs.email.value, this.refs.password.value).then(response => {
            if (!response.is_error) {
                this.setState({ registerComplete: true })
            } else {
                this.setState({ errors: response.error_content });
            }
        });
    }

    _formGroupClass(field: string) {
        var className = "form-group ";
        if (field) {
            className += " has-danger"
        }
        return className;
    }

    render() {
        if (this.state.registerComplete) {
            return <RegisterComplete email={this.refs.email.value} />
        } else {
            return <div className={authStyle.auth}>
                <form className={authStyle.formAuth} onSubmit={(e) => this.handleSubmit(e)}>
                    <h2 className={authStyle.formAuthHeading}>Please register for access</h2>
                    {this.state.errors.general &&
                        <div className="alert alert-danger" role="alert">
                            {this.state.errors.general}
                        </div>
                    }
                    <div className={this._formGroupClass(this.state.errors.username)}>
                        <label htmlFor="inputEmail">Email address</label>
                        <input type="email" id="inputEmail" ref="email" className="form-control" placeholder="Email address" />
                        <div className="form-control-feedback">{this.state.errors.username}</div>
                    </div>
                    <div className={this._formGroupClass(this.state.errors.password)}>
                        <label htmlFor="inputPassword">Password</label>
                        <input type="password" id="inputPassword" ref="password" className="form-control" placeholder="Password" />
                        <div className="form-control-feedback">{this.state.errors.password}</div>
                    </div>
                    <button className="btn btn-lg btn-primary btn-block" type="submit">Sign up</button>
                </form>
            </div>;
        };
    }
}

interface RegisterCompleteProps {
    email: string;
}

export class RegisterComplete extends React.Component<RegisterCompleteProps, any> {
    render() {
        return <div className={authStyle.auth}>
            <div className="alert alert-success" role="alert">
                <strong>Success!</strong>  Your account has been created.
            </div>
            <p>
                A confirmation email has been sent to {this.props.email}. You will need to follow the provided link to confirm your email address before signing in.
            </p>
            <Link className="btn btn-lg btn-primary btn-block" role="button" to="/">Sign in</Link>
        </div>;
    }
}
