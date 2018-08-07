import { combineProviders, combineConsumers, bindStore } from './storeUtils';

import { AccountProvider, AccountConsumer } from './account';
import { DeckOfCardsProvider, DeckOfCardsConsumer } from './deckOfCards';
import { UserProvider, UserConsumer } from './user';

export const StoreProvider = combineProviders(AccountProvider, DeckOfCardsProvider, UserProvider);
export const StoreConsumer = combineConsumers(
  { name: 'account', Consumer: AccountConsumer },
  { name: 'deckOfCards', Consumer: DeckOfCardsConsumer },
  { name: 'user', Consumer: UserConsumer }
);
export const connectStore = bindStore(StoreConsumer);
