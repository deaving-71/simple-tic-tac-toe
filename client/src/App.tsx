import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Login, StartMenu, Game, Layout } from "./components";
import { useSocket } from "./store";

function App() {
  const { user } = useSocket();

  return (
    <main className="dark min-h-screen h-full bg-background text-foreground p-2 flex items-center justify-center">
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" Component={user?.username ? StartMenu : Login} />
            <Route path="/game" Component={Game} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </main>
  );
}

export default App;
