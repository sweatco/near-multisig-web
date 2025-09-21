# React Router v7 Migration Plan

## Overview
Migrate from react-router-dom v6.30.1 to v7.9.1, which introduces significant changes to the routing paradigm.

## Package to Update
- `react-router-dom`: 6.30.1 → 7.9.1

## Major Changes in React Router v7

### 1. Framework Integration
- **Vite Plugin**: Built-in Vite integration for better DX
- **File-based Routing**: Optional file-based routing system
- **Build-time Optimization**: Pre-compilation of route configurations

### 2. Data Loading Revolution
- **Route-level Data**: Built-in data loading per route
- **Loader Functions**: Server-side and client-side data fetching
- **Action Functions**: Form handling and mutations
- **Streaming**: Progressive data loading support

### 3. Type Safety Improvements
- **Automatic Types**: Route-based TypeScript inference
- **Params Typing**: Strongly typed route parameters
- **Search Params**: Type-safe search parameter handling

### 4. Breaking Changes
- **createBrowserRouter**: Becomes the primary router
- **Route Configuration**: New route configuration patterns
- **Data Patterns**: Shift from useEffect to loader functions
- **Error Boundaries**: New error handling approach

## Current React Router Usage Analysis

### Current Routing Pattern:
Based on typical React Router v6 usage patterns:
- Browser-based routing
- Nested route structures
- Route parameters for contract/request IDs
- Programmatic navigation
- Route guards (likely for authentication)

### Expected Files with Routing:
- Main App routing configuration
- Navigation components
- Route parameter handling
- Link components throughout the app

## Migration Steps

### Phase 1: Current Usage Audit
```bash
# Find all React Router imports and usage
grep -r "react-router-dom\|useNavigate\|useParams\|Link\|NavLink\|Outlet" src/

# Document current route structure
# List all route parameters used
# Identify data fetching patterns per route
```

### Phase 2: Update Package
```bash
npm install react-router-dom@^7.9.1
```

### Phase 3: Router Configuration Migration

#### Before (v6 Pattern):
```typescript
import { BrowserRouter, Routes, Route } from 'react-router-dom'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/contract/:contractId" element={<Contract />} />
        <Route path="/contract/:contractId/request/:requestId" element={<Request />} />
      </Routes>
    </BrowserRouter>
  )
}
```

#### After (v7 Pattern):
```typescript
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

// New route configuration approach
const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
    loader: homeLoader, // Data loading function
  },
  {
    path: '/contract/:contractId',
    element: <Contract />,
    loader: contractLoader,
    children: [
      {
        path: 'request/:requestId',
        element: <Request />,
        loader: requestLoader,
      },
    ],
  },
])

function App() {
  return <RouterProvider router={router} />
}
```

### Phase 4: Data Loading Migration

#### Current Pattern (useEffect + useState):
```typescript
// Current likely pattern in components
function Contract() {
  const { contractId } = useParams()
  const [contractData, setContractData] = useState(null)

  useEffect(() => {
    fetchContractData(contractId).then(setContractData)
  }, [contractId])

  return <div>...</div>
}
```

#### New Pattern (Loader Functions):
```typescript
// v7 loader-based approach
export async function contractLoader({ params }) {
  const contractData = await fetchContractData(params.contractId)
  return { contractData }
}

function Contract() {
  const { contractData } = useLoaderData()
  return <div>...</div>
}
```

### Phase 5: Error Handling Updates

#### New Error Boundary Pattern:
```typescript
import { useRouteError } from 'react-router-dom'

export function ErrorBoundary() {
  const error = useRouteError()

  return (
    <div>
      <h1>Oops! Something went wrong</h1>
      <p>{error.statusText || error.message}</p>
    </div>
  )
}

// In route configuration
{
  path: '/contract/:contractId',
  element: <Contract />,
  errorElement: <ErrorBoundary />,
  loader: contractLoader,
}
```

## NEAR Multisig Specific Considerations

### Route Structure Likely Used:
- `/` - Home/Dashboard
- `/contract/:contractId` - Contract overview
- `/contract/:contractId/request/:requestId` - Specific request
- Possibly authentication routes

### Data Patterns to Migrate:
- Contract metadata loading
- Request list fetching
- Real-time updates for confirmations
- User authentication state

### Critical Areas:
- **Deep Links**: Ensure contract/request URLs still work
- **Navigation**: Breadcrumb and back navigation
- **Real-time Updates**: WebSocket or polling integration
- **Error States**: Network errors and invalid contracts

## Risk Assessment
**Risk Level: MEDIUM-HIGH**

### High Risk Areas:
- **Route Configuration**: Complete restructuring required
- **Data Loading**: Fundamental shift in data fetching patterns
- **Error Handling**: New error boundary approach
- **TypeScript**: Significant type changes

### Medium Risk Areas:
- **Navigation Hooks**: Some hook APIs changed
- **Testing**: Testing patterns need updates
- **Bundle Size**: May increase with new features

### Benefits:
- **Performance**: Better data loading and caching
- **User Experience**: Faster navigation and loading states
- **Developer Experience**: Better TypeScript support
- **Future-proofing**: Access to React Router's latest paradigms

## Compatibility Considerations

### Build Tools:
- May benefit from Vite integration (currently using Webpack via CRA)
- Consider migration to Vite for optimal v7 experience

### React Version:
- Works with React 18.3.1
- Better integration with React 19 when available

### Redux Integration:
- May need updates to Redux integration patterns
- Consider how loaders interact with Redux state

## Alternative Migration Approaches

### Option 1: Gradual Migration
1. Update to v7 but keep v6 patterns initially
2. Migrate to new router configuration
3. Gradually adopt loader functions
4. Update error handling last

### Option 2: Complete Rewrite
1. Design new route structure from scratch
2. Implement all loader functions upfront
3. Update all components simultaneously
4. Comprehensive testing phase

## Estimated Timeline

### Gradual Approach:
- **Router Config Update**: 3-5 days
- **Loader Function Migration**: 1-2 weeks
- **Error Handling**: 2-3 days
- **Testing & Refinement**: 1 week
- **Total**: 3-4 weeks

### Complete Rewrite:
- **Planning & Design**: 1 week
- **Implementation**: 2-3 weeks
- **Testing**: 1-2 weeks
- **Total**: 4-6 weeks

## Testing Strategy

### Core Functionality:
- All existing routes work correctly
- Route parameters parse correctly
- Navigation between routes
- Back/forward browser buttons
- Deep linking to specific contracts/requests

### Data Loading:
- Contract data loads correctly
- Request data loads correctly
- Loading states display appropriately
- Error states handle network failures

### Performance:
- Initial page load times
- Navigation speed between routes
- Memory usage with new caching

## Success Criteria
- [ ] All existing routes accessible
- [ ] Route parameters work correctly
- [ ] Data loading faster or equivalent
- [ ] Error handling improved
- [ ] TypeScript compilation passes
- [ ] No regression in user experience
- [ ] Performance metrics maintained

## Recommendation

**CONSIDER CAREFULLY** - React Router v7 is a significant paradigm shift:

### Pros:
- **Modern Patterns**: Latest routing best practices
- **Performance**: Better data loading and caching
- **TypeScript**: Improved type safety

### Cons:
- **Learning Curve**: New mental model for routing
- **Migration Effort**: Significant code changes required
- **Ecosystem Maturity**: v7 is relatively new

### Suggested Approach:
1. **Wait and Watch**: Let other projects adopt v7 first
2. **Stay on v6**: Continue with current stable version
3. **Plan for Late 2024**: Consider migration when v7 is more mature

If proceeding now:
1. **Spike Phase**: 1-week proof of concept
2. **Stakeholder Review**: Assess effort vs. benefit
3. **Phased Rollout**: Gradual migration approach