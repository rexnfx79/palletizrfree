# Development Guide - Palletizr Pro

## Table of Contents
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Development Workflow](#development-workflow)
- [Component Architecture](#component-architecture)
- [State Management](#state-management)
- [3D Visualization](#3d-visualization)
- [Testing Strategy](#testing-strategy)
- [Performance Guidelines](#performance-guidelines)
- [Contribution Guidelines](#contribution-guidelines)

## Getting Started

### Prerequisites
- Node.js 18+ 
- pnpm (recommended) or npm
- Modern browser with WebGL support
- Basic understanding of React, Three.js

### Initial Setup
```bash
# Clone and install
git clone <repository-url>
cd palletizr-pro
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build
```

### Development Environment
- **Hot Reload**: Vite provides instant hot module replacement
- **DevTools**: React DevTools and Three.js Inspector recommended
- **ESLint**: Configured for React and modern JavaScript

## Project Structure

### Directory Organization
```
src/
├── components/           # React components
│   ├── 3d/              # 3D visualization components
│   │   ├── Scene3D.jsx      # Main 3D scene controller
│   │   ├── Carton.jsx       # 3D carton model
│   │   ├── Pallet.jsx       # 3D pallet model
│   │   ├── Container.jsx    # 3D container model
│   │   └── Controls3D.jsx   # 3D UI controls
│   ├── steps/           # Wizard step components
│   │   ├── CartonStep.jsx   # Carton specifications
│   │   ├── PalletStep.jsx   # Pallet configuration
│   │   ├── ContainerStep.jsx # Container selection
│   │   └── SettingsStep.jsx # Optimization settings
│   ├── ui/              # Reusable UI components (shadcn/ui)
│   ├── Header.jsx       # Application header
│   ├── StepIndicator.jsx # Progress indicator
│   └── FormField.jsx    # Form components
├── hooks/               # Custom React hooks
│   ├── useCalculator.js     # Main application state
│   └── use-mobile.js        # Mobile detection
├── lib/                 # Business logic and utilities
│   ├── calculator.js        # Optimization algorithms
│   ├── 3d-layout.js        # 3D positioning calculations
│   └── utils.js            # General utilities
├── assets/              # Static assets
├── App.jsx              # Main application component
├── App.css              # Global styles
├── index.css            # Base styles
└── main.jsx             # Application entry point
```

### File Naming Conventions
- **Components**: PascalCase (e.g., `CartonStep.jsx`)
- **Hooks**: camelCase with "use" prefix (e.g., `useCalculator.js`)
- **Utilities**: camelCase (e.g., `calculator.js`)
- **Constants**: UPPER_SNAKE_CASE
- **CSS**: kebab-case for classes

## Development Workflow

### Feature Development Process
1. **Planning**: Define requirements and component boundaries
2. **Implementation**: Create components following established patterns
3. **Integration**: Connect to state management and validation
4. **Testing**: Manual testing with edge cases
5. **Optimization**: Performance review for 3D components

### Branch Strategy
- `main`: Production-ready code
- `develop`: Integration branch for features
- `feature/*`: Individual feature branches
- `hotfix/*`: Critical production fixes

### Code Quality Standards
- ESLint configuration enforced
- Consistent component structure
- Comprehensive error handling
- Performance-conscious development

## Component Architecture

### Component Design Principles
1. **Single Responsibility**: Each component has one clear purpose
2. **Composition over Inheritance**: Use component composition
3. **Props Interface**: Clear, typed prop interfaces
4. **Error Boundaries**: Graceful error handling

### Component Patterns

#### Functional Components with Hooks
```jsx
import React, { useState, useEffect } from 'react';

export function ComponentName({ prop1, prop2, onAction }) {
  const [localState, setLocalState] = useState(null);
  
  useEffect(() => {
    // Side effects
  }, [dependencies]);

  const handleAction = () => {
    // Event handling
    onAction?.(data);
  };

  return (
    <div className="component-container">
      {/* JSX content */}
    </div>
  );
}
```

#### Form Components
```jsx
export function FormComponent({ data, onUpdate, errors }) {
  const handleChange = (field, value) => {
    onUpdate({ ...data, [field]: value });
  };

  return (
    <FormField
      label="Field Label"
      value={data.field}
      onChange={(value) => handleChange('field', value)}
      error={errors?.field}
    />
  );
}
```

## State Management

### useCalculator Hook Architecture
Central state management hub that coordinates:
- Step navigation and validation
- Data collection and persistence
- Calculation orchestration
- Error handling and feedback

### State Structure
```javascript
{
  // Navigation
  currentStep: 0,
  steps: [...],
  
  // Data
  cartonData: { length, width, height, weight, quantity },
  palletData: { type, length, width, height },
  containerData: { type, length, width, height, maxWeight },
  settings: { strategy, allowRotation, weightLimit },
  
  // Status
  validationErrors: {},
  result: null,
  isCalculating: false
}
```

### State Update Patterns
```javascript
// Data updates
const updateCartonData = (updates) => {
  setCartonData(prev => ({ ...prev, ...updates }));
  validateData('carton', { ...cartonData, ...updates });
};

// Validation integration
const validateCurrentStep = () => {
  const errors = validateStep(currentStep, getCurrentStepData());
  setValidationErrors(errors);
  return Object.keys(errors).length === 0;
};
```

## 3D Visualization

### Three.js Integration
- **React Three Fiber**: React renderer for Three.js
- **React Three Drei**: Helper components and utilities
- **Performance**: Optimized for smooth rendering

### 3D Component Structure
```jsx
export function Scene3D({ result, settings }) {
  return (
    <Canvas camera={{ position: [5, 5, 5] }}>
      <ambientLight intensity={0.6} />
      <pointLight position={[10, 10, 10]} />
      
      {result && (
        <group>
          <Container data={result.container} />
          <Pallet data={result.pallet} />
          {result.cartons.map((carton, index) => (
            <Carton key={index} {...carton} />
          ))}
        </group>
      )}
      
      <OrbitControls />
    </Canvas>
  );
}
```

### 3D Performance Guidelines
- Reuse geometries when possible
- Use instanced rendering for repeated objects
- Implement level-of-detail (LOD) for complex scenes
- Monitor frame rate and optimize accordingly

## Testing Strategy

### Manual Testing Approach
- **Input Validation**: Test edge cases and invalid inputs
- **Calculation Accuracy**: Verify optimization results
- **3D Rendering**: Check visual accuracy and performance
- **User Experience**: Test complete workflow

### Test Cases
1. **Carton Input**: Negative values, zero dimensions, extreme ratios
2. **Pallet Selection**: Custom dimensions, weight limits
3. **Container Types**: Different container configurations
4. **Optimization**: Various strategies and settings
5. **3D Visualization**: Camera controls, layer toggles

### Browser Compatibility
- Chrome (recommended for development)
- Firefox, Safari, Edge
- Mobile browsers (responsive design)
- WebGL support verification

## Performance Guidelines

### React Performance
- Use `React.memo()` for expensive components
- Optimize re-renders with `useCallback` and `useMemo`
- Avoid creating objects in render functions
- Monitor component render cycles

### 3D Performance
- Limit polygon count for carton models
- Use efficient materials and textures
- Implement frustum culling for large scenes
- Monitor GPU usage and frame rates

### Bundle Size
- Code splitting for 3D components
- Lazy loading for non-critical features
- Tree shaking for unused utilities
- Asset optimization

## Contribution Guidelines

### Pull Request Process
1. **Branch**: Create feature branch from `develop`
2. **Development**: Follow coding standards and patterns
3. **Testing**: Verify functionality across browsers
4. **Documentation**: Update relevant documentation
5. **Review**: Submit PR with clear description

### Code Review Criteria
- Functionality correctness
- Performance impact assessment
- Code quality and consistency
- Documentation completeness
- Testing coverage

### Issue Reporting
- Clear reproduction steps
- Browser and environment details
- Expected vs. actual behavior
- Screenshots for visual issues

### Development Best Practices
- Write self-documenting code
- Add comments for complex logic
- Follow existing patterns and conventions
- Consider performance implications
- Test edge cases thoroughly

## Debugging Guidelines

### Common Issues and Solutions

#### 3D Rendering Problems
- **Symptom**: Black screen or no 3D content
- **Solution**: Check WebGL support, browser console errors
- **Tools**: Three.js Inspector, browser DevTools

#### State Management Issues
- **Symptom**: Unexpected behavior, data loss
- **Solution**: Debug useCalculator hook, check state updates
- **Tools**: React DevTools, console logging

#### Performance Issues
- **Symptom**: Slow rendering, unresponsive UI
- **Solution**: Profile components, optimize re-renders
- **Tools**: React Profiler, browser performance tools

### Debugging Tools
- **React DevTools**: Component inspection and profiling
- **Three.js Inspector**: 3D scene debugging
- **Browser DevTools**: Network, console, performance
- **ESLint**: Code quality and error detection

## Future Development

### Planned Enhancements
- Additional optimization algorithms
- Enhanced 3D visualization features
- Mobile app version
- API integration for external data

### Architecture Considerations
- Scalability for larger datasets
- Plugin system for custom algorithms
- Multi-language support
- Cloud-based calculations

### Technology Roadmap
- React 19 migration planning
- Three.js updates and new features
- Performance improvements
- Accessibility enhancements
