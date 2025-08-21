# Codebase Context: Palletizr Pro

## Purpose
Palletizr Pro is a professional container loading optimization application that provides intelligent pallet loading calculations with real-time 3D visualization. It helps logistics professionals maximize shipping efficiency by calculating optimal carton placement strategies.

## Architecture Overview
The application follows a modern React architecture with clear separation of concerns:

```
┌─────────────────────────────────────┐
│           Presentation Layer        │
│     (React Components + UI)         │
├─────────────────────────────────────┤
│         Business Logic Layer        │
│    (Custom Hooks + Utilities)       │
├─────────────────────────────────────┤
│       3D Visualization Layer        │
│    (Three.js + React Three Fiber)   │
├─────────────────────────────────────┤
│           Data Layer                │
│   (State Management + Validation)   │
└─────────────────────────────────────┘
```

## Key Components

### Core Modules

#### `src/App.jsx` - Main Application
Entry point that orchestrates the wizard flow and renders the current step.

#### `src/hooks/useCalculator.js` - State Management Hub
Central state management hook that coordinates:
- Step navigation
- Data validation
- Calculation orchestration
- Error handling

#### `src/lib/calculator.js` - Calculation Engine
Core business logic for:
- Pallet loading optimization algorithms
- Constraint validation
- Efficiency calculations
- Multiple stacking strategies

#### `src/lib/3d-layout.js` - 3D Positioning
Transforms calculation results into 3D coordinates for visualization.

### Component Hierarchy

#### Wizard Steps (`src/components/steps/`)
- `CartonStep.jsx` - Carton specifications input
- `PalletStep.jsx` - Pallet configuration
- `ContainerStep.jsx` - Container selection
- `SettingsStep.jsx` - Optimization preferences

#### 3D Visualization (`src/components/3d/`)
- `Scene3D.jsx` - Main 3D scene coordinator
- `Carton.jsx` - Individual carton 3D model
- `Pallet.jsx` - Pallet 3D representation
- `Container.jsx` - Container 3D structure
- `Controls3D.jsx` - 3D interaction controls

#### UI Components (`src/components/ui/`)
Comprehensive shadcn/ui component library for consistent styling.

## Data Flow

### Input Processing
1. User enters specifications in wizard steps
2. Real-time validation occurs on each input
3. Data is stored in centralized state (useCalculator)
4. Step progression requires valid data

### Calculation Pipeline
1. Validated inputs are passed to calculation engine
2. Algorithm selection based on user preferences
3. Optimization calculations execute
4. Results include efficiency metrics and 3D coordinates

### Visualization Rendering
1. Calculation results feed into 3D layout engine
2. 3D coordinates are generated for each carton
3. Three.js scene renders interactive visualization
4. User can manipulate view and toggle layers

## Technical Stack

### Frontend Framework
- **React 18**: Modern hooks-based architecture
- **Vite**: Fast development server and build tool
- **Tailwind CSS**: Utility-first styling approach

### 3D Graphics
- **Three.js**: Core 3D rendering engine
- **React Three Fiber**: React renderer for Three.js
- **React Three Drei**: Helper components and utilities

### Development Tools
- **ESLint**: Code quality and consistency
- **pnpm**: Efficient package management
- **Git**: Version control

## Conventions

### File Organization
- Components grouped by feature in directories
- Hooks placed in dedicated `hooks/` directory
- Business logic isolated in `lib/` directory
- UI components follow shadcn/ui patterns

### Naming Conventions
- Components use PascalCase (e.g., `CartonStep.jsx`)
- Hooks use camelCase with "use" prefix (e.g., `useCalculator.js`)
- Utilities use camelCase (e.g., `calculator.js`)
- Constants use UPPER_SNAKE_CASE

### Code Style
- Functional components with hooks
- Destructured imports for clarity
- Comprehensive error handling
- Inline documentation for complex logic

## State Management

### Primary State (useCalculator)
```javascript
{
  currentStep: number,
  cartonData: Object,
  palletData: Object,
  containerData: Object,
  settings: Object,
  validationErrors: Object,
  result: Object,
  isCalculating: boolean
}
```

### Validation Strategy
- Real-time input validation
- Progressive validation per step
- Comprehensive error messaging
- Prevention of invalid state progression

## Calculation Algorithms

### Optimization Strategies
1. **Auto-Optimize**: Automatically selects best pattern
2. **Simple Stacking**: Basic row-by-row placement
3. **Interlocked Pattern**: Alternating for stability
4. **Column Stacking**: Vertical alignment for access

### Constraint Handling
- Dimensional validation (carton fits on pallet)
- Weight limits (individual and total)
- Container capacity constraints
- Physical feasibility checks

## 3D Visualization Features

### Scene Management
- Interactive camera controls (orbit, zoom, pan)
- Layer visibility toggles (containers, pallets, cartons)
- Color-coded visual feedback
- Professional lighting setup

### Performance Optimization
- Efficient geometry reuse
- Selective rendering based on visibility
- Optimized update cycles
- Memory management for large datasets

## Extension Guidelines

### Adding New Features
1. Create components in appropriate directory structure
2. Extend state management in useCalculator if needed
3. Add validation logic for new inputs
4. Update 3D visualization if visual elements required
5. Maintain backward compatibility

### Custom Algorithms
1. Implement in `calculator.js` following existing patterns
2. Add algorithm selection in settings
3. Ensure comprehensive testing
4. Document algorithm-specific constraints

## Development Workflow

### Setup
```bash
pnpm install
pnpm dev
```

### Building
```bash
pnpm build
```

### Code Quality
- ESLint runs on save
- Manual testing required for 3D functionality
- Validation testing for edge cases

## Troubleshooting

### Common Issues
- **3D rendering problems**: Check browser WebGL support
- **Calculation errors**: Verify input validation logic
- **Performance issues**: Monitor Three.js rendering metrics
- **State inconsistencies**: Debug useCalculator hook flow

### Debugging Tools
- React DevTools for component inspection
- Three.js Inspector for 3D scene debugging
- Browser console for calculation validation
- Network tab for asset loading issues

## AI Assistant Integration

This codebase is optimized for AI-assisted development:
- Clear component boundaries
- Comprehensive inline documentation
- Predictable naming patterns
- Modular architecture
- Well-defined interfaces

When working with AI assistants:
1. Reference this document for context
2. Specify which component/module you're working with
3. Mention any constraint or performance requirements
4. Indicate if 3D visualization updates are needed
