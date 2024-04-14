import { useState, useEffect, FC, ChangeEvent, FormEvent } from "react";
import styles from "./styles.module.sass";

interface Param {
  id: number;
  name: string;
  type?: string;
}

interface ParamValue {
  paramId: number;
  value: string;
}

interface Model {
  paramValues: ParamValue[];
}

interface Props {
  params: Param[];
  model: Model;
}

export const ParamEditor: FC<Props> = ({ params, model }) => {
  const [paramValues, setParamValues] = useState<Map<number, string>>(new Map());
  const [isAddingParam, setIsAddingParam] = useState<boolean>(false);
  const [newParamName, setNewParamName] = useState<string>("");
  const [newParams, setNewParams] = useState<Param[]>(params);

  useEffect(() => {
    const updatedParamValues = new Map<number, string>();
    model.paramValues.forEach((paramValue) => {
      updatedParamValues.set(paramValue.paramId, paramValue.value);
    });
    setParamValues(updatedParamValues);
  }, [model]);

  const handleParamChange = (paramId: number, value: string) => {
    const updatedParamValues = new Map(paramValues);
    updatedParamValues.set(paramId, value);
    setParamValues(updatedParamValues);
  };

  const getModel = (): Model => ({
    paramValues: Array.from(paramValues.entries()).map(([paramId, value]) => ({
      paramId,
      value,
    })),
  });

  const handleChangeNewParam = (e: ChangeEvent<HTMLInputElement>) => {
    setNewParamName(e.target.value);
  };

  const handleSaveNewParam = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setNewParamName("");
    setIsAddingParam(false);
    setNewParams([...newParams, { id: Math.random(), name: newParamName }]);
  };

  const removeParam = (paramId: number) => {
    setNewParams(newParams.filter((param) => param.id !== paramId));

    const updatedParamValues = new Map(paramValues);
    updatedParamValues.delete(paramId);
    setParamValues(updatedParamValues);
  };

  return (
    <div className={styles.editor}>
      {newParams.map((param) => (
        <div key={param.id} className={styles.param}>
          <label htmlFor={`${param.id}`} className={styles.label}>
            {param.name}
          </label>
          <input
            id={`${param.id}`}
            type={param.type ? param.type : "text"}
            value={paramValues.get(param.id) || ""}
            placeholder="Введите значение"
            onChange={(e) => handleParamChange(param.id, e.target.value)}
          />
          <button className={styles.remove} onClick={() => removeParam(param.id)}>
            X
          </button>
        </div>
      ))}

      <form className={styles.create} onSubmit={handleSaveNewParam}>
        {isAddingParam ? (
          <>
            <input
              required
              type="text"
              placeholder="Введите имя параметра"
              value={newParamName}
              onChange={handleChangeNewParam}
            />
            <div className={styles.actions}>
              <button type="submit">Сохранить</button>
              <button onClick={() => setIsAddingParam(false)}>Отменить</button>
            </div>
          </>
        ) : (
          <button onClick={() => setIsAddingParam(true)}>Добавить параметр</button>
        )}
      </form>
    </div>
  );
};
