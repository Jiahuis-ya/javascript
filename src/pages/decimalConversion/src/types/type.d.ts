interface IBase {
  key: string,
  value: IConversionStatus,
  checked: boolean
}

interface ITable {
  key: IConversionStatus,
  value: string
}
interface IStore {
  selectValue: IConversionStatus
  inputValue: string
  options: IConversionStatus[]
  tableData: Array<ITable>
  baseOptions: Array<IBase>
  setSelect: (value: IConversionStatus) => void
  setInputValue: (value: string) => void
  formatCount: () => void
}

type IConversionStatus = ConversionStatus
