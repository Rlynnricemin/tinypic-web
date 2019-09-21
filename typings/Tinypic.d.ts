class Tinypic {
  constructor({
    file: [File, string],
    type: string,
    limitsize: number
  }: {
    file: [File, 'base64string']
    type: ['file', 'base64']
  }) {}
}