import React, { Component } from 'react';
import AuthService from './AuthService';

export default function withAuth(AuthComponent) {
  const Auth = new AuthService('http://localhost:3000/api');
  return class AuthWrapped extends Component {
    constructor() {
      super();
      this.state = {
        user: null,
      };
    }

    componentWillMount() {
      if (!Auth.loggedIn()) {
        this.props.history.replace('/login');
      } else {
        try {
          const userData = Auth.getUserdata();
          console.log('userData', userData);
          this.setState({
            user: userData,
          });
        } catch (err) {
          Auth.logout();
          this.props.history.replace('/login');
        }
      }
    }

    render() {
      if (this.state.user) {
        return (
          <AuthComponent history={this.props.history} user={this.state.user} />
        );
      }
      return null;
    }
  };
}
