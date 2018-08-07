import React from 'react';

const UserContext = React.createContext();

export class UserProvider extends React.Component {
  constructor(props) {
    super(props);

    this.changeEmail = (newEmail) => this.setState((state) => ({...state, email: newEmail}));
    this.updateJwt = (newJwt) => this.setState((state) => ({...state, jwt: newJwt}));

    this.state = {
      email: 'the email',
      jwt: 'the jwt',
      changeEmail: this.changeEmail,
      updateJwt: this.updateJwt
    };
  }

  render() {
    const { children } = this.props;
    return (
      <UserContext.Provider value={this.state}>
        {children}
      </UserContext.Provider>
    );
  }
}

export const UserConsumer = UserContext.Consumer;
