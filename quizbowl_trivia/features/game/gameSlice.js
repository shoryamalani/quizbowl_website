import { createSlice, current } from '@reduxjs/toolkit'

export const gameSlice = createSlice({
  name: 'game',
  initialState: {
    points: 0,
    gameQuestions: [],
    currentQuestion: 0,
    speechSpeed: 0.5,
    colorsToUse: {
      neutral: ['#FFC917', '#21EBE4'],
      correct: ['#FFC917', '#03f215'],
      incorrect: ['#FFC917', 'red'],
    },
    currentColor: ['#FFC917', '#21EBE4'],
    previousAnswer: [],
    pointsPerQuestion: [],
    showQuestion: false,
    currentQuestionText: '',
    runQuestion: true,
    showBuzzer: false,
    currentWordInSentence: 0,
    currentSentence: 0,
    isUpdating: false,
  },
  reducers: {
    // increment: (state) => {
    //   // Redux Toolkit allows us to write "mutating" logic in reducers. It
    //   // doesn't actually mutate the state because it uses the Immer library,
    //   // which detects changes to a "draft state" and produces a brand new
    //   // immutable state based off those changes
    //   state.points += 1
    // },
    // decrement: (state) => {
    //   state.points -= 1
    // },
    setGameQuestions: (state, action) => {
      state.gameQuestions = action.payload
    },
    setQuestionUserAnswer: (state, action) => {
      state.gameQuestions[state.currentQuestion].userAnswer = action.payload
    },
    incrementPointsByAmount: (state, action) => {
      state.points += action.payload
      state.pointsPerQuestion.push(action.payload)
      state.gameQuestions[state.currentQuestion].points = action.payload
    },
    resetGame: (state) => {
      state.points = 0
      state.gameQuestions = []
      state.currentQuestion = 0
      state.speechSpeed = 0.5
      state.colorsToUse = {
        neutral: ['#FFC917', '#21EBE4'],
        correct: ['#FFC917', '#03f215'],
        incorrect: ['#FFC917', 'red'],
      }
      state.currentColor = ['#FFC917', '#21EBE4']
      state.previousAnswer = []
      state.pointsPerQuestion = []
      state.showQuestion = false
      state.currentQuestionText = ''
      state.runQuestion = true
      state.showBuzzer = false
      state.currentWordInSentence = 0
      state.currentSentence = 0
      state.isUpdating = false
      
    },
    incrementQuestion: (state) => {
      state.currentQuestion += 1
      state.currentWordInSentence = 0
      state.currentSentence = 0
    },
    setSpeechSpeed: (state, action) => {
      state.speechSpeed = action.payload
    },
    addAnswer: (state, action) => {
      state.previousAnswer.push(action.payload)
    },
    setShowQuestion: (state) => {
      state.showQuestion = true
    },
    setCurrentColor: (state, action) => {
      if (action.payload === 'correct') {
        state.currentColor = state.colorsToUse.correct
      }
      else if (action.payload === 'incorrect') {
        state.currentColor = state.colorsToUse.incorrect
      }
      else {
        state.currentColor = state.colorsToUse.neutral
      }
    },
    setCurrentQuestionText: (state, action) => {
      state.currentQuestionText = action.payload
    },
    setRunQuestion: (state, action) => {
      state.runQuestion = action.payload
    },
    setShowBuzzer: (state, action) => {
      state.showBuzzer = action.payload
    },
    incrementSentence: (state) => {
      state.currentSentence += 1
    },
    incrementWordInSentence: (state) => {
      console.log(state.currentWordInSentence)
      state.currentWordInSentence += 1
    },
    resetWordInSentence: (state) => {
      state.currentWordInSentence = 0
    },
    setIsUpdating: (state, action) => {
      state.isUpdating = action.payload
    }
  },
})

// Action creators are generated for each case reducer function
export const { setGameQuestions,incrementPointsByAmount,incrementQuestion,resetGame,setSpeechSpeed,addAnswer,setShowQuestion, setCurrentColor,setCurrentQuestionText, setRunQuestion, setShowBuzzer,incrementSentence,incrementWordInSentence,resetWordInSentence,setIsUpdating,setQuestionUserAnswer } = gameSlice.actions

export default gameSlice.reducer