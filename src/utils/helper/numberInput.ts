export const handleNumericInput = (
  e: React.ChangeEvent<HTMLInputElement>,
  setter: (val: number) => void,
  options: { min: number; max: number; defaultValue?: number }
) => {
  const { min, max, defaultValue = min } = options;
  const val = e.target.value.trim();

  if (!/^\d*$/.test(val)) return;

  if (val === "") {
    setter(defaultValue);
    return;
  }

  const num = Number(val);

  if (num < min) setter(min);
  else if (num > max) setter(max);
  else setter(num);
};

export const handleNumericBlur = (
  e: React.FocusEvent<HTMLInputElement>,
  setter: (val: number) => void,
  options: { min: number; max: number }
) => {
  const { min, max } = options;
  const val = e.target.value.trim();
  const num = Number(val);

  if (isNaN(num) || val === "") {
    setter(min);
  } else if (num < min) {
    setter(min);
  } else if (num > max) {
    setter(max);
  } else {
    setter(num);
  }
};
