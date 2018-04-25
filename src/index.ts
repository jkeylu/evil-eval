import Script, { ScriptOptions } from './script';

export type RunInContextOptions = ScriptOptions;

export function runInContext(code: string, sandbox?: object, options?: RunInContextOptions) {
    return new Script(code, options).runInContext(sandbox);
}
