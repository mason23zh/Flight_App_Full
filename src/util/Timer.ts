export class Timer {
    private _start: Date;
    private _remaining: number;
    private _durationTimeoutId?: NodeJS.Timeout;
    private _callback: (...args: never[]) => void;
    private _done = false;
    get done() {
        return this._done;
    }

    constructor(callback: (...args: never[]) => void, ms = 0) {
        this._callback = () => {
            callback();
            this._done = true;
        };
        this._remaining = ms;
        this.resume();
    }

    /** pauses the timer */
    pause(): Timer {
        if (this._durationTimeoutId && !this._done) {
            this._clearTimeoutRef();
            this._remaining -= new Date().getTime() - this._start.getTime();
        }
        return this;
    }

    /** resumes the timer */
    resume(): Timer {
        if (!this._durationTimeoutId && !this._done) {
            this._start = new Date;
            this._durationTimeoutId = setTimeout(this._callback, this._remaining);
        }
        return this;
    }

    /**
     * clears the timeout and marks it as done.
     *
     * After called, the timeout will not resume
     */
    clearTimeout() {
        this._clearTimeoutRef();
        this._done = true;
    }

    private _clearTimeoutRef() {
        if (this._durationTimeoutId) {
            clearTimeout(this._durationTimeoutId);
            this._durationTimeoutId = undefined;
        }
    }

}