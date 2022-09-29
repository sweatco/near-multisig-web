import { TypedUseSelectorHook, useDispatch, useSelector, useStore } from 'react-redux'

import type { RootState } from '../reducers'
import type { AppDispatch } from '../utils/configureStore'

export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
export const useAppStore = () => useStore<RootState>()
