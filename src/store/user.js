import { Store } from '../storeLib';

export default new Store(
  {email: 'the email', jwt: 'the jwt'},
  (state) => ({
    changeEmail: (newEmail) => ({...state, email: newEmail}),
    updateJwt: (newJwt) => ({...state, jwt: newJwt})
  })
);
