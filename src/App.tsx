import ParamEditor from "./components/ParamEditor";

function App() {
  return (
    <>
      <ParamEditor
        params={[
          { id: 1, name: "Назначение" },
          { id: 2, name: "Длина" },
        ]}
        model={{
          paramValues: [
            { paramId: 1, value: "повседневное" },
            { paramId: 2, value: "макси" },
          ],
        }}
      />
    </>
  );
}

export default App;
