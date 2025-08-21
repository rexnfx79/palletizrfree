# Module Documentation - Palletizr Pro

## Table of Contents
- [Core Modules](#core-modules)
- [Component Modules](#component-modules)
- [3D Visualization Modules](#3d-visualization-modules)
- [State Management](#state-management)
- [Utility Modules](#utility-modules)
- [UI Components](#ui-components)

## Core Modules

### `src/App.jsx` - Main Application Controller
**Purpose**: Central application orchestrator that manages the wizard flow and renders the current step.

**Key Responsibilities**:
- Integrates useCalculator hook for state management
- Renders step-based navigation interface
- Coordinates between form inputs and 3D visualization
- Handles application-level error boundaries

**Dependencies**: useCalculator, Header, StepIndicator, Step components, Scene3D

**Usage Pattern**:
```jsx
// Main application entry point
// Orchestrates wizard flow and step rendering
// Manages global application state
```

### `src/main.jsx` - Application Entry Point
**Purpose**: React application bootstrap and DOM mounting.

**Key Responsibilities**:
- React application initialization
- DOM mounting configuration
- Global CSS imports

## Component Modules

### `src/components/Header.jsx` - Application Header
**Purpose**: Provides consistent branding and navigation context.

**Key Responsibilities**:
- Application title and branding
- Global navigation elements
- Responsive header layout

### `src/components/StepIndicator.jsx` - Progress Visualization
**Purpose**: Visual progress indicator for the wizard flow.

**Key Responsibilities**:
- Step progress visualization
- Interactive step navigation
- Current step highlighting
- Progress percentage calculation

### `src/components/FormField.jsx` - Reusable Form Components
**Purpose**: Standardized form input components with validation.

**Key Responsibilities**:
- Consistent form field styling
- Integrated error display
- Input validation feedback
- Accessibility support

## Wizard Step Modules

### `src/components/steps/CartonStep.jsx` - Carton Specifications
**Purpose**: Collects carton dimensional and weight specifications.

**Key Features**:
- Length, width, height inputs with validation
- Weight specification with unit conversion
- Quantity selection
- Real-time validation feedback
- Dimensional constraint checking

**Validation Rules**:
- All dimensions must be positive numbers
- Weight must be realistic (0.1kg - 1000kg)
- Quantity must be positive integer
- Maximum reasonable dimensions enforced

### `src/components/steps/PalletStep.jsx` - Pallet Configuration
**Purpose**: Pallet type selection and configuration.

**Key Features**:
- Standard pallet type selection (Euro, Standard, American)
- Custom pallet dimension input
- Pallet capacity calculations
- Weight limit configuration

**Pallet Types**:
- **Euro Pallet**: 1200×800×144mm, 25kg capacity
- **Standard Pallet**: 1200×1000×144mm, 30kg capacity  
- **American Pallet**: 1219×1016×144mm, 35kg capacity
- **Custom**: User-defined dimensions

### `src/components/steps/ContainerStep.jsx` - Container Selection
**Purpose**: Container type and specifications selection.

**Key Features**:
- Standard container type selection
- Container dimension display
- Weight capacity information
- Custom container configuration

**Container Types**:
- **20ft Standard**: 5898×2352×2393mm, 28,230kg capacity
- **40ft Standard**: 12,032×2352×2393mm, 28,750kg capacity
- **40ft High Cube**: 12,032×2352×2698mm, 28,750kg capacity

### `src/components/steps/SettingsStep.jsx` - Optimization Configuration
**Purpose**: Algorithm selection and optimization preferences.

**Key Features**:
- Optimization strategy selection
- Weight limit configuration
- Rotation preferences
- Advanced settings

**Optimization Strategies**:
- **Auto-Optimize**: Automatically selects best algorithm
- **Simple Stacking**: Basic row-by-row placement
- **Interlocked Pattern**: Alternating pattern for stability
- **Column Stacking**: Vertical alignment for easy access

## 3D Visualization Modules

### `src/components/3d/Scene3D.jsx` - 3D Scene Controller
**Purpose**: Main 3D scene coordinator and renderer.

**Key Responsibilities**:
- Three.js canvas setup and configuration
- Scene lighting and camera management
- Component orchestration (Container, Pallet, Cartons)
- Performance optimization

**Technical Details**:
- Uses React Three Fiber for React integration
- Implements orbit controls for user interaction
- Optimized lighting setup for realistic rendering
- Responsive canvas sizing

### `src/components/3d/Container.jsx` - 3D Container Model
**Purpose**: 3D representation of shipping containers.

**Key Features**:
- Wireframe container visualization
- Dimensional accuracy
- Color-coded container types
- Transparent walls for interior visibility

### `src/components/3d/Pallet.jsx` - 3D Pallet Model  
**Purpose**: 3D representation of pallets.

**Key Features**:
- Realistic pallet geometry
- Material and texture representation
- Accurate dimensional scaling
- Multiple pallet type support

### `src/components/3d/Carton.jsx` - 3D Carton Model
**Purpose**: Individual carton 3D representation.

**Key Features**:
- Box geometry with accurate dimensions
- Color-coded visualization
- Position and rotation support
- Instanced rendering for performance

### `src/components/3d/Controls3D.jsx` - 3D Interaction Controls
**Purpose**: User interface controls for 3D scene interaction.

**Key Features**:
- Layer visibility toggles (containers, pallets, cartons)
- Camera reset functionality
- View mode selection
- Performance settings

## State Management

### `src/hooks/useCalculator.js` - Central State Management
**Purpose**: Centralized state management for the entire application.

**State Structure**:
```javascript
{
  // Navigation state
  currentStep: number,
  steps: Array<StepConfig>,
  
  // Input data
  cartonData: CartonSpecification,
  palletData: PalletSpecification,
  containerData: ContainerSpecification,
  settings: OptimizationSettings,
  
  // Application state
  validationErrors: ValidationErrorMap,
  result: OptimizationResult,
  isCalculating: boolean
}
```

**Key Functions**:
- `updateCartonData(updates)`: Updates carton specifications
- `updatePalletData(updates)`: Updates pallet configuration
- `updateContainerData(updates)`: Updates container selection
- `updateSettings(updates)`: Updates optimization settings
- `nextStep()`: Advances to next step with validation
- `prevStep()`: Returns to previous step
- `calculateOptimization()`: Executes optimization calculation
- `resetCalculator()`: Resets all data to initial state
- `validateCurrentStep()`: Validates current step data

### `src/hooks/use-mobile.js` - Mobile Detection
**Purpose**: Responsive design utility for mobile device detection.

**Usage**: Provides boolean flag for mobile/desktop UI adaptations.

## Utility Modules

### `src/lib/calculator.js` - Optimization Engine
**Purpose**: Core business logic for pallet loading optimization.

**Key Functions**:

#### `calculateOptimalLoading(cartonData, palletData, settings)`
- **Purpose**: Main optimization entry point
- **Algorithm**: Implements multiple stacking strategies
- **Returns**: Optimization result with carton positions

#### `calculatePalletLoading(cartonData, palletData, settings)`
- **Purpose**: Calculates carton arrangement on single pallet
- **Strategies**: Simple, interlocked, column stacking
- **Validation**: Dimensional and weight constraints

#### `calculateContainerLoading(palletResult, containerData, palletData)`
- **Purpose**: Optimizes pallet placement in container
- **Features**: Multi-pallet optimization, space utilization
- **Constraints**: Container dimensions and weight limits

#### `generateOptimizationReport(cartonData, palletData, containerData, settings)`
- **Purpose**: Generates comprehensive optimization report
- **Metrics**: Efficiency percentages, space utilization, recommendations

**Algorithm Details**:
- **Simple Stacking**: Row-by-row placement with basic rotation
- **Interlocked Pattern**: Alternating orientations for stability
- **Column Stacking**: Vertical alignment for warehouse access
- **Auto-Optimize**: Selects best strategy based on carton ratios

### `src/lib/3d-layout.js` - 3D Positioning Engine
**Purpose**: Transforms optimization results into 3D coordinates.

**Key Class**: `Layout3D`
- **Constructor**: `new Layout3D(result, containerData, palletData)`
- **Methods**: 
  - `getCartonPositions()`: Returns 3D coordinates for all cartons
  - `getPalletPositions()`: Returns pallet placement coordinates
  - `getContainerBounds()`: Returns container boundary definition

**Coordinate System**:
- Origin at container front-left-bottom
- X-axis: Length (depth into container)
- Y-axis: Width (left to right)  
- Z-axis: Height (bottom to top)

### `src/lib/utils.js` - General Utilities
**Purpose**: Common utility functions for the application.

**Key Functions**:
- `cn(...)`: Tailwind CSS class name utility
- `formatWeight(weight, unit)`: Weight formatting with units
- `formatDimensions(length, width, height)`: Dimension formatting
- `calculateVolume(dimensions)`: Volume calculation
- `validateDimensions(dimensions)`: Dimension validation

## UI Components

### `src/components/ui/` - Reusable UI Components
**Purpose**: Shadcn/ui component library integration.

**Key Components**:
- `Button.jsx`: Consistent button styling and behavior
- `Input.jsx`: Form input with validation support
- `Card.jsx`: Content containers with consistent styling
- `Dialog.jsx`: Modal dialogs and overlays
- `Progress.jsx`: Progress bars and indicators
- `Alert.jsx`: Error and notification displays

**Design System**:
- Consistent color palette
- Typography scale
- Spacing system
- Component variants
- Accessibility compliance

## Data Flow Architecture

### Input Processing Flow
```
User Input → Form Validation → State Update → Real-time Feedback
     ↓
Step Validation → Navigation Control → Progress Update
```

### Calculation Flow
```
Validated Inputs → Algorithm Selection → Optimization Engine → Result Generation
     ↓
3D Coordinate Calculation → Scene Rendering → User Interaction
```

### Error Handling Flow
```
Input Validation → Error Collection → User Feedback → Correction Guidance
     ↓
State Recovery → Retry Mechanism → Success Confirmation
```

## Performance Considerations

### React Performance
- Memoized components prevent unnecessary re-renders
- Optimized state updates minimize calculation cycles
- Lazy loading for 3D components

### 3D Performance
- Instanced rendering for repeated cartons
- Geometry reuse for identical shapes
- Level-of-detail for complex scenes
- Efficient material management

### Memory Management
- Cleanup of Three.js resources
- Event listener removal
- State reset functionality
- Garbage collection optimization

## Extension Guidelines

### Adding New Modules
1. Follow established naming conventions
2. Implement consistent error handling
3. Add comprehensive documentation
4. Consider performance implications
5. Maintain backward compatibility

### Algorithm Extensions
1. Implement in `calculator.js` following existing patterns
2. Add algorithm selection in settings
3. Ensure validation compatibility
4. Document algorithm-specific constraints
5. Test with various input scenarios

### UI Component Extensions
1. Use shadcn/ui patterns for consistency
2. Implement accessibility features
3. Add responsive design considerations
4. Follow Tailwind CSS conventions
5. Test across different browsers
