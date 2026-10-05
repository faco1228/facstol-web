// Slovak plural form: plural(3, ['fotka', 'fotky', 'fotiek']) → '3 fotky'
export function plural(count: number, [one, few, many]: [string, string, string]) {
  if (count === 1) return `${count} ${one}`;
  if (count >= 2 && count <= 4) return `${count} ${few}`;
  return `${count} ${many}`;
}
