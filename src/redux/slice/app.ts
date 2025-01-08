import { createSlice } from '@reduxjs/toolkit';

interface User {
  email: string;
  id: string;
  fullName: string;
}
interface AppState {
  user: User | null;
}

const initialState: AppState = {
  user: null,
};

const appSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action) {
      state.user = action.payload;
    },
    removeUser(state) {
      state.user = null;
    },
  },
});

export const { setUser, removeUser } = appSlice.actions;

export default appSlice.reducer;
