import { getAppName } from './config';

// tslint:disable-next-line: no-any
export function log(...message: any[]): void {
  console.log(`${getAppName()}:`, ...message);
}

// tslint:disable-next-line: no-any
export function logError(...message: any[]): void {
  console.error(`${getAppName()}:`, ...message);
}
