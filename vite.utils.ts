import { resolve } from 'path';
import fs from 'fs';

/**
 * Get the package name from package.json or fallback to directory name
 * @param dirname The __dirname from the calling vite config
 * @returns The package name (last part of the scoped name or directory name)
 */
export function getPackageName(dirname: string): string {
  const packageJsonPath = resolve(dirname, 'package.json');
  if (fs.existsSync(packageJsonPath)) {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
    // Extract the last part of the package name (after the last slash)
    const fullName = packageJson.name;
    return fullName.split('/').pop() || 'unknown';
  }
  // Fallback to directory name if package.json doesn't exist
  return dirname.split('/').pop() || 'unknown';
}

/**
 * Generate the fileName function for vite lib build
 * @param packageName The package name
 * @returns A function that generates the correct filename based on format
 */
export function createFileNameFunction(packageName: string) {
  return (format: string) =>
    `${packageName}.${format === 'es' ? 'esm' : 'cjs'}.js`;
}
