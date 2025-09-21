# Redux Toolkit v2 Migration Plan

## Overview
Migrate from @reduxjs/toolkit v1.9.7 to v2.9.0 along with related Redux ecosystem updates.

## Packages to Update
- `@reduxjs/toolkit`: 1.9.7 → 2.9.0
- `react-redux`: 8.1.3 → 9.2.0 (companion update)

## Major Changes in Redux Toolkit v2

### 1. RTK Query Enhancements
- **New Query Features**: Enhanced caching and invalidation
- **Streaming Updates**: Real-time data streaming support
- **Better TypeScript**: Improved type inference for queries

### 2. Immer Updates
- **Immer 10**: Updated to latest Immer version
- **Performance**: Better performance for large state objects
- **TypeScript**: Improved type safety for draft mutations

### 3. createSlice Improvements
- **Selectors**: Built-in selector generation
- **Async Reducers**: Better support for async operations
- **Middleware**: Enhanced middleware integration

### 4. Breaking Changes
- **Node.js**: Requires Node.js 14+
- **TypeScript**: Requires TypeScript 4.7+
- **React-Redux**: Requires React-Redux 8+
- **Some API deprecations**: Removed deprecated APIs

## Current Redux Usage Analysis

### Store Structure:
Based on codebase patterns:
- **Store Configuration**: Standard RTK store setup
- **Slices Used**:
  - FT List reducer (`src/reducers/ft_list/reducer`)
  - Metadata selectors (`src/reducers/metadata`)
- **Persistence**: Using `redux-persist` for state persistence
- **Hooks**: Using `useAppDispatch`, `useAppSelector`, `useAppStore`

### Files to Review:
- Store configuration files
- All slice definitions
- Custom hook definitions (`src/hooks/useApp`)
- Async action creators
- Selector implementations

## Migration Steps

### Phase 1: Preparation & Analysis
```bash
# Check current Redux patterns
grep -r "createSlice\|createAsyncThunk\|configureStore" src/

# Review current TypeScript setup
grep -r "PayloadAction\|createAction" src/
```

### Phase 2: Update Dependencies
```bash
npm install @reduxjs/toolkit@^2.9.0 react-redux@^9.2.0
```

### Phase 3: Code Updates Required

#### 1. Store Configuration Updates
```typescript
// File: src/store configuration
// Current store may need updates for RTK v2

import { configureStore } from '@reduxjs/toolkit'
import { persistStore, persistReducer } from 'redux-persist'

// Check if any middleware configuration needs updates
// Verify RTK Query setup if used
```

#### 2. Slice Definition Updates
```typescript
// Enhanced createSlice with selectors
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

const counterSlice = createSlice({
  name: 'counter',
  initialState: { value: 0 },
  reducers: {
    increment: (state) => {
      state.value += 1
    },
  },
  selectors: {
    selectCount: (state) => state.value,
  },
})

// Export both actions and selectors
export const { increment } = counterSlice.actions
export const { selectCount } = counterSlice.selectors
```

#### 3. TypeScript Hook Updates
```typescript
// File: src/hooks/useApp.ts
// May need updates for React-Redux v9 types

import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import type { RootState, AppDispatch } from '../store'

// Verify these types still work with new versions
export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
```

#### 4. Async Actions Review
```typescript
// Check any createAsyncThunk usage
// May benefit from new RTK v2 features

// Current pattern in actions/chain/*
import { createAsyncThunk } from '@reduxjs/toolkit'

// Verify error handling and type inference improvements
```

### Phase 4: React-Redux v9 Updates

#### Component Connection Updates:
```typescript
// React-Redux v9 has improved TypeScript support
// Check all components using useSelector and useDispatch

// Benefits of v9:
// - Better performance
// - Improved TypeScript inference
// - Enhanced debugging support
```

## Risk Assessment
**Risk Level: LOW-MEDIUM**

### Low Risk Areas:
- **Backward Compatibility**: RTK v2 maintains most APIs
- **TypeScript**: Incremental improvements, not breaking changes
- **Performance**: Generally improves performance

### Medium Risk Areas:
- **Immer Changes**: Updated Immer may affect complex state mutations
- **React-Redux v9**: New major version may have subtle changes
- **Bundle Size**: May increase slightly with new features

### Benefits:
- **Better Performance**: Improved rendering and state updates
- **Enhanced TypeScript**: Better type inference and safety
- **New Features**: Access to latest RTK capabilities
- **Future-proofing**: Stay current with Redux ecosystem

## Compatibility Check

### Current Dependencies:
- `redux-persist`: Should be compatible
- Custom middleware: Verify compatibility
- DevTools: Should work with enhanced debugging

### Build Tools:
- `react-scripts`: Compatible
- TypeScript: Current 4.9.5 meets minimum requirements
- Webpack: No issues expected

## Migration Testing Strategy

### Phase 1: Smoke Testing
```bash
npm run build
npm start
```

### Phase 2: State Management Testing
- Test all Redux actions dispatch correctly
- Verify state persistence works
- Check async actions (thunks) behavior
- Validate selector performance

### Phase 3: Component Integration
- Test all connected components
- Verify state updates trigger re-renders correctly
- Check for any performance regressions
- Test development tools integration

## Estimated Timeline
- **Dependency Update**: 1 day
- **Code Updates**: 2-3 days
- **Testing**: 2-3 days
- **Performance Validation**: 1 day

**Total**: 1 week

## Specific Areas to Test

### FT List Reducer:
- Token addition/removal functionality
- State persistence across sessions
- Async token fetching

### Metadata Selectors:
- Confirmation count calculations
- Contract metadata retrieval
- Performance of complex selectors

### Custom Hooks:
- `useAppDispatch` functionality
- `useAppSelector` type inference
- `useAppStore` direct access patterns

## Success Criteria
- [ ] All Redux actions work correctly
- [ ] State persistence maintains functionality
- [ ] No TypeScript compilation errors
- [ ] Performance metrics maintained or improved
- [ ] DevTools integration works
- [ ] All async operations complete successfully
- [ ] Component re-rendering behaves correctly

## Rollback Plan
```bash
# If issues arise
npm install @reduxjs/toolkit@^1.9.7 react-redux@^8.1.3

# Test all functionality
npm run build
npm start
```

## Recommendation
**PROCEED WITH CONFIDENCE** - This is a relatively safe upgrade with significant benefits:

1. **Low Breaking Changes**: Most APIs remain the same
2. **Performance Gains**: Improved rendering and state management
3. **TypeScript Benefits**: Better type safety and inference
4. **Ecosystem Alignment**: Stay current with Redux best practices

The migration should be straightforward and provide immediate benefits for the development experience.