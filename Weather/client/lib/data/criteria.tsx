const criteria = [
  { value: "temperature", label: "Temperature" },
  { value: "pressure", label: "Pressure" },
  { value: "humidity", label: "Humidity" },
  { value: "visibility", label: "Visibility" },
  { value: "condition", label: "Condition" },
];

const operators = [
  {
    value: ">",
    label: "Greater than",
    temperature: true,
    pressure: true,
    humidity: true,
    visibility: true,
  },
  {
    value: "<",
    label: "Less than",
    temperature: true,
    pressure: true,
    humidity: true,
    visibility: true,
  },
  {
    value: "=",
    label: "Equal to",
    condition: true,
    visibility: true,
    pressure: true,
    humidity: true,
    temperature: true,
  },
  {
    value: ">=",
    label: "Greater than or equal to",
    temperature: true,
    pressure: true,
    humidity: true,
    visibility: true,
  },
  {
    value: "<=",
    label: "Less than or equal to",
    temperature: true,
    pressure: true,
    humidity: true,
    visibility: true,
  },
];

export { criteria, operators };
