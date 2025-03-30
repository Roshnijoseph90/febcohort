import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  userData:{},
  isUserAuth:false,
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    saveuser:(state,action)=>{
        state.isUserAuth=true;
        state.userData=action.payload;
    },
    clearuser:(state)=>{
        state.isUserAuth=false;
        state.userData = {}

    }
  },
})
export const {saveuser,clearuser } = userSlice.actions

export default userSlice.reducer