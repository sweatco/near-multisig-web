# TypeScript 5 Migration Plan

## Overview
Migrate from TypeScript 4.9.5 to TypeScript 5.9.2 with improved type checking, new features, and performance enhancements.

## Package to Update
- `typescript`: 4.9.5 → 5.9.2

## Major Changes in TypeScript 5

### 1. Stricter Type Checking
- More accurate type inference
- Better handling of union and intersection types
- Stricter checks for `const` assertions

### 2. New Features
- **Decorators Support**: Stable decorators implementation
- **const Type Parameters**: Better generic constraints
- **Import Attributes**: New syntax for import assertions
- **Satisfies Operator Improvements**: Enhanced type narrowing

### 3. Performance Improvements
- Faster compilation times
- Reduced memory usage
- Better incremental compilation

### 4. Breaking Changes
- Some previously valid code may now show type errors
- Changes to module resolution in edge cases
- Stricter checking of generic constraints

## Current TypeScript Usage Analysis

Based on the codebase:
- **Current version**: 4.9.5
- **Main usage areas**:
  - React component types
  - Redux/RTK types
  - NEAR blockchain types
  - Utility functions and helpers

### Key Files to Review:
- `src/utils/chainHelpers.ts` - Crypto and NEAR types
- Redux store and slice definitions
- React component prop interfaces
- Custom hook type definitions

## Migration Steps

### Phase 1: Preparation & Analysis
```bash
# Check current TypeScript usage patterns
npx tsc --showConfig

# Analyze potential breaking changes
npx tsc --noEmit --strict
```

### Phase 2: Update TypeScript
```bash
npm install typescript@^5.9.2
```

### Phase 3: Fix Type Errors

#### Common Issues to Expect:

1. **Stricter Generic Constraints**
```typescript
// May need explicit type parameters
type MyType<T extends string = string> = {
  value: T
}
```

2. **Const Assertions**
```typescript
// More strict const assertions
const config = {
  apiUrl: 'https://api.example.com'
} as const
```

3. **Union Type Handling**
```typescript
// May need more explicit type guards
function isString(value: unknown): value is string {
  return typeof value === 'string'
}
```

### Phase 4: tsconfig.json Updates

Consider enabling new strict options:
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "allowJs": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "exactOptionalPropertyTypes": true,
    "noUncheckedIndexedAccess": true,
    "forceConsistentCasingInFileNames": true,
    "noFallthroughCasesInSwitch": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx"
  }
}
```

### Phase 5: Testing & Validation
1. **Compilation Testing**
   ```bash
   npx tsc --noEmit
   npm run build
   ```

2. **Runtime Testing**
   - Verify all type inference still works correctly
   - Test complex generic usage
   - Validate React prop types

3. **Development Experience**
   - Check IDE intellisense improvements
   - Verify faster compilation times
   - Test hot module replacement

## Risk Assessment
**Risk Level: MEDIUM**

### Potential Issues:
- **Type Errors**: New stricter checking may reveal hidden issues
- **Third-party Types**: Some @types packages may need updates
- **Build Performance**: Initial compilation may be slower during transition

### Benefits:
- **Better Type Safety**: Catch more errors at compile time
- **Performance**: Faster subsequent compilations
- **Developer Experience**: Better intellisense and error messages
- **Future-proofing**: Access to latest TypeScript features

## Compatibility Check

### Dependencies using TypeScript types:
- `@types/node`: Already on latest (20.19.17)
- `@types/react`: May benefit from TypeScript 5 improvements
- `@types/react-dom`: Compatible
- `@types/bn.js`: Should be compatible
- `@types/react-router-dom`: Should be compatible

### Build Tools:
- `react-scripts`: Compatible with TypeScript 5
- `react-app-rewired`: Should work fine
- ESLint TypeScript parser may need update

## Estimated Timeline
- **Preparation**: 1 day
- **Update & Fix Types**: 2-3 days
- **Testing**: 2-3 days
- **Production Deployment**: 1 day

**Total**: 1 week

## Pre-migration Checklist
- [ ] Backup current working branch
- [ ] Run full test suite (if any)
- [ ] Document any current TypeScript errors
- [ ] Check IDE/editor TypeScript plugin versions

## Success Criteria
- [ ] TypeScript compilation passes without errors
- [ ] No regression in type safety
- [ ] Build times improve or stay same
- [ ] No runtime issues introduced
- [ ] Developer experience improves
- [ ] All team members' IDEs work correctly

## Rollback Plan
If issues arise:
```bash
npm install typescript@^4.9.5
# Revert any tsconfig.json changes
# Test compilation and runtime
```

## Recommendation
**PROCEED WITH CAUTION** - TypeScript 5 is mature and stable. The main risk is stricter type checking revealing existing issues, which is actually beneficial for code quality. This migration should be prioritized as it provides immediate development benefits.