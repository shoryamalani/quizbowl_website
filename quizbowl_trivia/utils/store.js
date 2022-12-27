import { configureStore } from '@reduxjs/toolkit'
import gameSlice from '../features/game/gameSlice'
export default configureStore({
  reducer: {
    game: gameSlice,
  },
})