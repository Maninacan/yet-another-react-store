import React from 'react';

import { StoreConsumer } from '../store/';

const MainContent = () => {
  return (
    <StoreConsumer>
      {({account, deckOfCards, user}) => {
        console.log('account: ', account, 'deckOfCards: ', deckOfCards);
        const { fetchData, fetchDataPending, data, changeAccountStuff, accountStuff } = account;
        const { getDeckOfCards, getDeckOfCardsPending, deckOfCardsData } = deckOfCards;
        const { changeEmail, updateJwt, email, jwt } = user;
        return (
          <div>
            <li><button onClick={() => getDeckOfCards()}>get deck of cards</button></li>
            <li>getDeckOfCardsPending: {getDeckOfCardsPending ? 'true' : 'false'}</li>
            <li>{deckOfCardsData && JSON.stringify(deckOfCardsData)}</li>
            <li><button onClick={() => fetchData('25')}>fetch data</button></li>
            <li>fetchDataPending: {fetchDataPending ? 'true' : 'false'}</li>
            <li>{data}</li>
            <li><button onClick={() => changeEmail(Math.random() + '')}>ChangeEmail</button></li>
            <li>{email}</li>
            <li><button onClick={() => updateJwt(Math.random() + '')}>UpdateJwt</button></li>
            <li>{jwt}</li>
            <li><button onClick={() => changeAccountStuff(Math.random() + '')}>ChangeAccountStuff</button></li>
            <li>{accountStuff}</li>
          </div>
        );
      }}
    </StoreConsumer>
  );
};

export default MainContent;
