import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist'; // {{ edit_1 }}
import storage from 'redux-persist/lib/storage'; // {{ edit_2 }}
import appReducer from './slice/app';
import segmentReducer from './slice/segment';

const persistConfig = {
  key: 'root',
  storage,
};

const persistedReducer = persistReducer(
  persistConfig,
  combineReducers({
    app: appReducer,
    segment: segmentReducer
  })
);

const store = configureStore({
  reducer: persistedReducer,
});

const persistor = persistStore(store);

export { store, persistor };

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
