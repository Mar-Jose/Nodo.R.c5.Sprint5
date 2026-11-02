import { ThemeProvider } from './context/ThemeContext.jsx'
import { PaisesProvider } from './context/PaisesContext.jsx'
import { Navigate, Route, Routes } from 'react-router-dom'
import PaisesAmericaView, {
  DetallePaisView,
  FormularioPaisView,
  ListadoPaisesView,
} from './components/views/PaisesAmericaView.jsx'

function App() {
  return (
    <ThemeProvider>
      <PaisesProvider>
        <Routes>
          <Route element={<PaisesAmericaView />}>
            <Route index element={<Navigate to="/paises" replace />} />
            <Route path="paises" element={<ListadoPaisesView />} />
            <Route path="paises/nuevo" element={<FormularioPaisView />} />
            <Route path="paises/:id/editar" element={<FormularioPaisView />} />
            <Route path="paises/:id" element={<DetallePaisView />} />
            <Route path="*" element={<Navigate to="/paises" replace />} />
          </Route>
        </Routes>
      </PaisesProvider>
    </ThemeProvider>
  )
}

export default App
