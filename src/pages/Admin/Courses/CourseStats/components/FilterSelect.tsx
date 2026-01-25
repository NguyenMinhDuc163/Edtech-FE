import { ResultStatus, ResultStatusLabel } from "../libs/enum/resultStatus";

interface Props {
  value: string;
  onChange: (value: string) => void;
}

const FilterSelect: React.FC<Props> = ({ value, onChange }) => {
  return (
    <select
      className="admin-select-filter"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="">Tất cả</option>

      {Object.values(ResultStatus).map((st) => (
        <option key={st} value={st}>
          {ResultStatusLabel[st]}
        </option>
      ))}
    </select>
  );
};

export default FilterSelect;
