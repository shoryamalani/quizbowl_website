// import { configureStore,getDefaultMiddleware } from '@reduxjs/toolkit'
// import gameSlice from '../features/game/gameSlice'
// import {
//   persistReducer,
//   FLUSH,
//   REHYDRATE,
//   PAUSE,
//   PERSIST,
//   PURGE,
//   REGISTER,
// } from 'redux-persist'
// // import storage from 'redux-persist/lib/storage'
import AsyncStorage from '@react-native-async-storage/async-storage'


// const persistConfig = {
//   key: 'root',
//   version: 1,
//   storage: AsyncStorage,
// }

// export const persistedReducer = persistReducer(persistConfig, {
//   game: gameSlice,
// })

// const store =  configureStore({
//   reducer: persistedReducer,
//   middleware: getDefaultMiddleware({
//     serializableCheck: {
//       ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
//     },
//   }),
  
//   // enhancers: [devToolsEnhancer()],

// })


// export default store;
// make a persisted store and persist the game slice with redux-toolkit

import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import {combineReducers} from 'redux';
// import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web
import gameSlice from '../features/game/gameSlice';
const persistConfig = {
  key: 'root',
  version: 1,
  storage: AsyncStorage
}

const rootReducer = combineReducers({
  game: gameSlice,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);
const store =  configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware({
    serializableCheck: {
      ignoredActions: ['persist/PERSIST'],
    },
  }),
  
  // enhancers: [devToolsEnhancer()],

})


export default store;