import { Segment } from '@/api/segment';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define the initial state
interface SegmentsState {
  segments: Segment[];
}

const initialState: SegmentsState = {
  segments: [],
};

// Create the slice
const segmentsSlice = createSlice({
  name: 'segments',
  initialState,
  reducers: {
    setSegments: (state, action: PayloadAction<Segment[]>) => {
      state.segments = action.payload;
    },
    addNewSegment: (state, action: PayloadAction<Segment>) => {
      state.segments = [...state.segments, action.payload];
    },
  },
});

export const { setSegments, addNewSegment } = segmentsSlice.actions;

export default segmentsSlice.reducer;
