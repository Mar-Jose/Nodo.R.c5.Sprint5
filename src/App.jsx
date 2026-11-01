import { ThemeProvider } from './context/ThemeContext.jsx'
import { PaisesProvider } from './context/PaisesContext.jsx'
import PaisesAmericaView from './components/views/PaisesAmericaView.jsx'

function App() {
  return (
    <ThemeProvider>
      <PaisesProvider>
        <PaisesAmericaView />
      </PaisesProvider>
    </ThemeProvider>
  )
}

export default App
