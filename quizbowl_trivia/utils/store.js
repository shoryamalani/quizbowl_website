import { configureStore } from '@reduxjs/toolkit'
import gameSlice from '../features/game/gameSlice'
import { devToolsEnhancer } from 'redux-devtools-extension';

export default configureStore({
  reducer: {
    game: gameSlice, 
  },
  
  // enhancers: [devToolsEnhancer()],

})