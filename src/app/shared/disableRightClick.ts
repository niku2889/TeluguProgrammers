import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { AngularFirestore } from "@angular/fire/compat/firestore";


@Injectable({
    providedIn: 'root',
})
export class DisableRightClickService {
    constructor(@Inject(DOCUMENT) private document: Document) { }
    disableRightClick() {
        this.document.addEventListener('contextmenu', (event) =>
            event.preventDefault()
        );
    }
}