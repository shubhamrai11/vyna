import { Injectable } from '@angular/core';
import { BehaviorSubject } from "rxjs";
import { ErrorContainer } from '../models/ErrorContainer';

@Injectable({
    providedIn: 'root'
})
export class ErrorHandlerService {

    private _error: ErrorContainer | null = null;
    errorsStatus: BehaviorSubject<ErrorContainer | null> = new BehaviorSubject<ErrorContainer | null>(this._error);

    get error(): ErrorContainer | null {
        return this._error;
    }

    set error(value: ErrorContainer | null) {
        this._error = value;
        this.errorsStatus.next(value);
    }

    resetError() {
        this._error = null;
        this.errorsStatus.next(null); // On ne complète pas le BehaviorSubject
    }
}
