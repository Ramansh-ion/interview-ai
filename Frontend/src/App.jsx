import {RouterProvider} from "react-router"
import {router} from "./app.routes.jsx"
import { AuthProvider } from "./features/interview/auth/auth.context.jsx"
import { InterviewContext, InterviewProvider } from "./features/interview/style/interview.context.jsx";

function App() {


  return (

    <AuthProvider>
<InterviewProvider>
<RouterProvider router={router}/>
</InterviewProvider>
    </AuthProvider>
  )
}

export default App
