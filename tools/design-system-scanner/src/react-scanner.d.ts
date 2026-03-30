declare module 'react-scanner' {
  interface ScannerConfig {
    crawlFrom: string;
    importedFrom?: string | RegExp;
    includeSubComponents?: boolean;
    exclude?: string[] | ((dirname: string) => boolean);
    globs?: string[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    processors?: Array<string | string[] | ((...args: any[]) => any)>;
    [key: string]: unknown;
  }

  function run(config: ScannerConfig): Promise<unknown>;

  export { run };
  export default { run };
}
