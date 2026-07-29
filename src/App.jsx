import Home from "./pages/Home"

function App() {

  return (
   <div>
 {/* 共通のサイドバー（一旦管理者固定、またはroleFlagを渡す） */}
      <Sidebar roleFlag={1} />
 <Home/>
 </div>
  )
}

export default App
