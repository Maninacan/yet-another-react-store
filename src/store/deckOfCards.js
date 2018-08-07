import React from 'react';
import { drawCardsApi, getDeckOfCardsApi } from '../api/deckOfCardsApi';

const DeckOfCardsContext = React.createContext();

export class DeckOfCardsProvider extends React.Component {
  constructor(props) {
    super(props);

    this.getDeckOfCardsStart = () => this.setState((state) => ({...state, getDeckOfCardsPending: true}));
    this.getDeckOfCardsSuccess = (data) => this.setState((state) => ({...state, deckOfCardsData: data}));
    this.getDeckOfCardsFail = (errorMessage) => this.setState((state) => ({...state, getDeckOfCardsErrorMessage: errorMessage}));
    this.getDeckOfCardsEnd = () => this.setState((state) => ({...state, getDeckOfCardsPending: false}));

    this.getDeckOfCardsErrorHandler = () => {
      return (error) => {
        this.getDeckOfCardsFail(error.message);
        this.getDeckOfCardsEnd();
      }
    }

    this.getDeckOfCards = () => {
      this.getDeckOfCardsStart();
      getDeckOfCardsApi()
        .then((response) => {
          return drawCardsApi(response.data.deck_id, 26)
            .then((response) => {
              this.getDeckOfCardsSuccess(response.data);
              this.getDeckOfCardsEnd();
            })
            .catch(this.getDeckOfCardsErrorHandler());
        })
        .catch(this.getDeckOfCardsErrorHandler());
    }
    this.state = {
      getDeckOfCardsPending: false,
      deckOfCardsData: null,
      getDeckOfCardsErrorMessage: null,
      getDeckOfCards: this.getDeckOfCards
    };
  }

  render() {
    const { children } = this.props;
    return (
      <DeckOfCardsContext.Provider value={this.state}>
        {children}
      </DeckOfCardsContext.Provider>
    );
  }
}

export const DeckOfCardsConsumer = DeckOfCardsContext.Consumer;
