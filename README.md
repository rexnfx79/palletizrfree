# Palletizr Pro - Advanced Container Loading Optimization

A modern, professional container loading optimization tool with 3D visualization capabilities. Built with React, Three.js, and advanced optimization algorithms.

## 🚀 Live Demo

**Production Application:** [https://qywtsemc.manus.space](https://qywtsemc.manus.space)

## ✨ Features

### 🎯 Core Functionality
- **Advanced Calculator**: Sophisticated pallet loading optimization algorithms
- **Multiple Container Types**: Support for 20ft, 40ft, and High Cube containers
- **Flexible Pallet Options**: Euro, Standard, American, and custom pallets
- **Smart Optimization**: Auto-optimize, Simple, Interlocked, and Column stacking patterns
- **Weight & Dimension Constraints**: Comprehensive validation and optimization

### 🎨 Modern UI/UX
- **iOS-Style Interface**: Clean, modern design with smooth animations
- **Step-by-Step Wizard**: Intuitive 5-step optimization process
- **Progress Tracking**: Visual progress indicators and completion status
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Professional Styling**: Tailwind CSS with custom components

### 🎮 3D Visualization
- **Interactive 3D Scene**: Real-time 3D rendering with Three.js
- **Realistic Models**: Detailed carton, pallet, and container representations
- **Layer Controls**: Toggle visibility of containers, pallets, and cartons
- **Camera Controls**: Orbit, zoom, and pan functionality
- **Visual Feedback**: Color-coded cartons and professional lighting

### 🔧 Technical Excellence
- **Input Validation**: Comprehensive error handling and user feedback
- **Performance Optimized**: Fast calculations and smooth 3D rendering
- **SEO Ready**: Proper meta tags and semantic HTML
- **Production Ready**: Built and optimized for deployment

## 🏗️ Technology Stack

### Frontend
- **React 18**: Modern React with hooks and functional components
- **Vite**: Fast build tool and development server
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Beautiful icon library

### 3D Graphics
- **Three.js**: 3D graphics library
- **React Three Fiber**: React renderer for Three.js
- **React Three Drei**: Useful helpers and components

### Development Tools
- **ESLint**: Code linting and quality assurance
- **Git**: Version control
- **pnpm**: Fast, disk space efficient package manager

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- pnpm (recommended) or npm

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/palletizr-pro.git
   cd palletizr-pro
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   # or
   npm install
   ```

3. **Start development server**
   ```bash
   pnpm dev
   # or
   npm run dev
   ```

4. **Open in browser**
   ```
   http://localhost:5173
   ```

### Building for Production

```bash
pnpm build
# or
npm run build
```

The built files will be in the `dist/` directory.

## 📁 Project Structure

### Core Architecture
```
src/
├── components/                # React components organized by feature
│   ├── 3d/                   # 3D visualization components
│   │   ├── Scene3D.jsx       # Main 3D scene controller
│   │   ├── Carton.jsx        # 3D carton model rendering
│   │   ├── Pallet.jsx        # 3D pallet representation
│   │   ├── Container.jsx     # 3D container visualization
│   │   └── Controls3D.jsx    # 3D interaction controls
│   ├── steps/                # Wizard step components
│   │   ├── CartonStep.jsx    # Carton specifications input
│   │   ├── PalletStep.jsx    # Pallet configuration
│   │   ├── ContainerStep.jsx # Container specifications
│   │   └── SettingsStep.jsx  # Optimization settings
│   ├── ui/                   # Reusable UI components (shadcn/ui)
│   ├── Header.jsx            # Application header
│   ├── StepIndicator.jsx     # Progress visualization
│   └── FormField.jsx         # Form input components
├── lib/                      # Business logic and utilities
│   ├── calculator.js         # Core optimization algorithms
│   ├── 3d-layout.js         # 3D positioning calculations
│   └── utils.js             # General utility functions
├── hooks/                    # Custom React hooks
│   ├── useCalculator.js      # Central state management
│   └── use-mobile.js         # Mobile detection utility
├── assets/                   # Static assets
├── App.jsx                   # Main application orchestrator
├── App.css                   # Global styles
├── index.css                 # Base CSS styles
└── main.jsx                  # Application entry point
```

### Documentation Structure
```
docs/
├── DEVELOPMENT.md            # Development guide and workflows
├── MODULES.md                # Detailed module documentation
└── CONTEXT-ENGINEERING.md   # Context engineering implementation

Root Documentation:
├── .context.md               # Primary AI context file
├── CODEBASE-CONTEXT.md      # Technical architecture overview
└── README.md                # Project overview (this file)
```

## 🎯 Key Improvements Over Original

### ✅ Fixed Issues
- **Input Validation**: Proper validation with error messages (no negative values)
- **Professional Content**: Removed default WordPress content
- **SEO Optimization**: Added proper meta tags and descriptions
- **Error Handling**: Comprehensive error handling throughout
- **Performance**: Optimized loading and calculation speed

### 🚀 Enhanced Features
- **3D Visualization**: Interactive 3D scene showing optimization results
- **Modern UI**: iOS-style interface with smooth animations
- **Step-by-Step Process**: Intuitive wizard-based workflow
- **Advanced Algorithms**: Multiple optimization strategies
- **Responsive Design**: Works perfectly on all devices
- **Professional Styling**: Enterprise-grade appearance

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root directory:

```env
VITE_APP_TITLE=Palletizr Pro
VITE_APP_DESCRIPTION=Advanced Container Loading Optimization
```

### Customization
- **Colors**: Modify Tailwind config in `tailwind.config.js`
- **Algorithms**: Extend optimization logic in `src/lib/calculator.js`
- **3D Models**: Customize 3D components in `src/components/3d/`

## 📊 Algorithm Details

### Optimization Strategies
1. **Auto-Optimize**: Automatically selects the best pattern based on carton ratios
2. **Simple Stacking**: Basic row-by-row stacking for straightforward loading
3. **Interlocked Pattern**: Alternating orientations for enhanced stability
4. **Column Stacking**: Vertical alignment for easy warehouse access

### Performance Characteristics
- **Real-time calculations** for up to 10,000 cartons
- **Multi-threaded optimization** for complex scenarios
- **Memory-efficient algorithms** with optimized data structures
- **3D coordinate generation** for accurate visualization

## 🤖 AI-Assisted Development

This project implements **context engineering** principles for optimal AI collaboration:

### Context Documentation
- **`.context.md`** - Primary AI context and project overview
- **`CODEBASE-CONTEXT.md`** - Detailed technical architecture
- **Comprehensive inline documentation** - Self-explaining code patterns
- **Module-level documentation** - Clear component responsibilities

### AI-Friendly Architecture
- **Predictable patterns** - Consistent naming and structure
- **Clear separation of concerns** - Modular component design
- **Comprehensive validation** - Well-documented constraints
- **Extension guidelines** - Clear patterns for adding features

### Development with AI Assistants
The codebase is optimized for AI collaboration with:
- Rich contextual documentation for accurate code understanding
- Clear architectural patterns for consistent code generation
- Comprehensive examples and usage patterns
- Well-defined interfaces and data flows

For detailed information on the context engineering implementation, see [`docs/CONTEXT-ENGINEERING.md`](docs/CONTEXT-ENGINEERING.md).

### Calculation Process
1. **Carton Analysis**: Validate dimensions and calculate volume
2. **Pallet Optimization**: Determine optimal carton arrangement
3. **Container Loading**: Calculate pallet placement in container
4. **3D Positioning**: Generate precise coordinates for visualization
5. **Efficiency Metrics**: Calculate space and weight utilization

## 🎮 3D Visualization Features

### Interactive Controls
- **Orbit**: Drag to rotate the camera around the scene
- **Zoom**: Scroll wheel to zoom in/out
- **Pan**: Right-click and drag to pan the camera
- **Reset**: Button to return to default view

### Layer Management
- **Container**: Toggle container walls visibility
- **Pallets**: Show/hide pallet structures
- **Cartons**: Toggle carton visibility
- **Real-time Updates**: Instant visual feedback

### Visual Elements
- **Realistic Materials**: Wood textures for pallets, metallic containers
- **Dynamic Lighting**: Professional lighting with shadows
- **Color Coding**: Different colors for each pallet's cartons
- **Scale Accuracy**: Precise dimensional representation

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Configure build settings:
   - Build Command: `pnpm build`
   - Output Directory: `dist`
3. Deploy automatically on push

### Netlify
1. Connect repository to Netlify
2. Set build command: `pnpm build`
3. Set publish directory: `dist`

### Manual Deployment
1. Build the project: `pnpm build`
2. Upload `dist/` contents to your web server

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Three.js Community**: For the amazing 3D graphics library
- **React Team**: For the excellent React framework
- **Tailwind CSS**: For the utility-first CSS framework
- **Vite Team**: For the fast build tool

## 📞 Support

For support, questions, or feature requests:
- Open an issue on GitHub
- Contact: [your-email@example.com]

---

**Built with ❤️ using React, Three.js, and modern web technologies**

