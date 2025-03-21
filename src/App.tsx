import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import { ToastContainer } from "react-toastify";
import "./App.css";
import { TimeInputs } from "./components/timeInputs";

function App() {
  return (
    <MantineProvider>
      <TimeInputs />
      <ToastContainer />
    </MantineProvider>
  );
}

export default App;
