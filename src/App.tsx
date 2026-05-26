import { useState } from 'react'
import { Layout } from './components/Layout'
import { TelemetryDashboard } from './views/TelemetryDashboard/TelemetryDashboard'
import { UnifilarDiagram } from './views/UnifilarDiagram/UnifilarDiagram'
import { SCADABuilder } from './views/SCADABuilder/SCADABuilder'
import './App.css'

function App() {
  const [currentTab, setTab] = useState<'dashboard' | 'diagram' | 'editor'>('dashboard')

  return (
    <Layout currentTab={currentTab} setTab={setTab}>
      {currentTab === 'dashboard' && <TelemetryDashboard />}
      {currentTab === 'diagram' && <UnifilarDiagram />}
      {currentTab === 'editor' && <SCADABuilder />}
    </Layout>
  )
}

export default App
