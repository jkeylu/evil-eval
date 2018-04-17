export enum SignalType {
    Continue,
    Break,
    Return
}

export default class Signal {
    static Continue(label?: string) {
        return new Signal(SignalType.Continue, label);
    }

    static Break(label?: string) {
        return new Signal(SignalType.Break, label);
    }

    static Return(value?: any) {
        return new Signal(SignalType.Return, value);
    }

    static isSignal(signal: any) {
        return signal instanceof Signal;
    }

    static isContinue(signal: any) {
        return signal instanceof Signal && signal.type === SignalType.Continue;
    }

    static isBreak(signal: any) {
        return signal instanceof Signal && signal.type === SignalType.Break;
    }

    static isReturn(signal: any) {
        return signal instanceof Signal && signal.type === SignalType.Return;
    }

    constructor(
        public readonly type: SignalType,
        public readonly value?: any
    ) { }
}
