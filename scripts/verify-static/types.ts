export type ForbiddenTextPattern = {
  label: string;
  pattern: RegExp;
};

export type StaticRouteCheck = {
  route: string;
  expectedTexts: readonly string[];
  forbiddenTextPatterns?: readonly ForbiddenTextPattern[];
};
