import { useState } from 'react'
import "@navikt/ds-css-internal";
import "@navikt/ds-css";
import { Alert } from "@navikt/ds-react";
import { Dropdown, Divider } from "@navikt/ds-react-internal";


function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="App">
        <p>Hello Vite + React!</p>
        <p>
          <button type="button" onClick={() => setCount((count) => count + 1)}>
            count is: {count}
          </button>
        </p>
        <Alert variant="info">Designsystemet</Alert>
        <Dropdown>
          <Dropdown.Toggle>Toggle</Dropdown.Toggle>

          <Dropdown.Menu>
            <Dropdown.Menu.GroupedList>
              <Dropdown.Menu.GroupedList.Heading>
                Systemer og oppslagsverk
              </Dropdown.Menu.GroupedList.Heading>
              <Dropdown.Menu.GroupedList.Item>Gosys</Dropdown.Menu.GroupedList.Item>
            </Dropdown.Menu.GroupedList>
            <Divider />
            <Dropdown.Menu.List>
              <Dropdown.Menu.List.Item>Gosys</Dropdown.Menu.List.Item>
              <Dropdown.Menu.List.Item>Psys</Dropdown.Menu.List.Item>
            </Dropdown.Menu.List>
          </Dropdown.Menu>
      </Dropdown>
    </div>
  )
}

export default App
