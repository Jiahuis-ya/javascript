import { useState } from 'react'
import './App.css'
import Operation from '@/components/Operation'
import TableContent from '@/components/TableContent'
import SelectArea from '@/components/SelectArea'

function App() {

  return (
    <div className="App">
      <SelectArea />
      <Operation />
      <TableContent />
    </div>
  )
}

export default App
