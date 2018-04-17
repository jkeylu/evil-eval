import Script from './script';

export function runInContext(code: string, sandbox?: object, options?: any) {
    return new Script(code, options).runInContext(sandbox);
}
