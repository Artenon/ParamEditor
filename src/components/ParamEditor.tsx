import { ChangeEvent, Component, FormEvent } from "react";
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

interface State {
  paramValues: Map<number, string>;
  params: Param[];
  isAddingParam: boolean;
  newParamName: string;
}

class ParamEditor extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    const { model, params } = this.props;

    const paramValues = new Map<number, string>();
    model.paramValues.forEach((paramValue) => {
      paramValues.set(paramValue.paramId, paramValue.value);
    });

    this.state = {
      paramValues,
      params,
      isAddingParam: false,
      newParamName: "",
    };
  }

  handleParamChange = (paramId: number, value: string) => {
    const { paramValues } = this.state;
    paramValues.set(paramId, value);
    this.setState({ paramValues });
  };

  getModel(): Model {
    const { paramValues } = this.state;
    return {
      paramValues: Array.from(paramValues.entries()).map(([paramId, value]) => ({
        paramId,
        value,
      })),
    };
  }

  handleChangeNewParam = (e: ChangeEvent<HTMLInputElement>) => {
    this.setState({ newParamName: e.target.value });
  };

  handleSaveNewParam = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { params, newParamName } = this.state;
    const newParams = [...params, { id: Math.random(), name: newParamName }];
    this.setState({ params: newParams, newParamName: "", isAddingParam: false });
  };

  removeParam = (paramId: number) => {
    const { params, paramValues } = this.state;
    const newParams = params.filter((param) => param.id !== paramId);
    paramValues.delete(paramId);
    this.setState({ params: newParams, paramValues });
  };

  render() {
    const { paramValues, newParamName, isAddingParam, params } = this.state;
    return (
      <div className={styles.editor}>
        {params.map((param) => (
          <div key={param.id} className={styles.param}>
            <label htmlFor={`${param.id}`} className={styles.label}>
              {param.name}
            </label>
            <input
              id={`${param.id}`}
              type={param.type ? param.type : "text"}
              value={paramValues.get(param.id) || ""}
              placeholder="Введите значение"
              onChange={(e) => this.handleParamChange(param.id, e.target.value)}
            />
            <button className={styles.remove} onClick={() => this.removeParam(param.id)}>
              X
            </button>
          </div>
        ))}

        <form className={styles.create} onSubmit={this.handleSaveNewParam}>
          {isAddingParam ? (
            <>
              <input
                required
                type="text"
                placeholder="Введите имя параметра"
                value={newParamName}
                onChange={this.handleChangeNewParam}
              />
              <div className={styles.actions}>
                <button type="submit">Сохранить</button>
                <button onClick={() => this.setState({ isAddingParam: false })}>Отменить</button>
              </div>
            </>
          ) : (
            <button onClick={() => this.setState({ isAddingParam: true })}>
              Добавить параметр
            </button>
          )}
        </form>
      </div>
    );
  }
}

export default ParamEditor;
