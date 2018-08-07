import React from 'react';
import _get from 'lodash.get';

import { connectStore } from '../storeLib';
import { fetchData } from '../store/account';
import { getDeckOfCards } from '../store/deckOfCards';

const MainContent = (props) => {
  return (
    <div>
      <li><button onClick={() => props.getDeckOfCards()}>get deck of cards</button></li>
      <li>getDeckOfCardsPending: {_get(props, 'deckOfCards.getDeckOfCardsPending') ? 'true' : 'false'}</li>
      <li>{JSON.stringify(_get(props, 'deckOfCards.deckOfCards', {}))}</li>
      <li><button onClick={() => props.fetchData('25')}>fetch data</button></li>
      <li>fetchDataPending: {_get(props, 'account.fetchDataPending') ? 'true' : 'false'}</li>
      <li>{_get(props, 'account.data')}</li>
      <li><button onClick={() => props.changeEmail(Math.random() + '')}>ChangeEmail</button></li>
      <li>{props.user.email}</li>
      <li><button onClick={() => props.updateJwt(Math.random() + '')}>UpdateJwt</button></li>
      <li>{props.user.jwt}</li>
      <li><button onClick={() => props.changeAccountStuff(Math.random() + '')}>ChangeAccountStuff</button></li>
      <li>{props.account.accountStuff}</li>
    </div>
  );
};

const mapStoreToProps = ({user, account, deckOfCards}) => {
  return {user, account, deckOfCards};
};

const mapMethodsToProps = (methods) => {
  return {
    changeEmail: methods.user.changeEmail,
    updateJwt: methods.user.updateJwt,
    changeAccountStuff: methods.account.changeAccountStuff,
    fetchData: (...rest) => fetchData(methods, ...rest),
    getDeckOfCards: () => getDeckOfCards(methods)
  };
};

export default connectStore(mapStoreToProps, mapMethodsToProps)(MainContent)
