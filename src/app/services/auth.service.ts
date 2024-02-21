import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Injectable({
    providedIn: 'root',
})
export class AuthenticationService {
    constructor(
        public afAuth: AngularFireAuth // Inject Firebase auth service
    ) { }

    // Sign up with email/password
    SignUp(email: string, password: string, name: string) {
        if (name == "")
            return window.alert('Name is required');
        return this.afAuth
            .createUserWithEmailAndPassword(email, password)
            .then((result) => {
                result.user?.updateProfile({
                    displayName: name
                }).then(() => {
                }).catch((error) => {
                });
                window.alert('You have been successfully registered!');
            })
            .catch((error) => {
                window.alert(error.message);
            });
    }

    // Sign in with email/password
    SignIn(email: string, password: string) {
        return this.afAuth
            .signInWithEmailAndPassword(email, password)
            .then((result) => {
                window.alert('You have been successfully signed in!');
            })
            .catch((error) => {
                window.alert(error.message);
            });
    }

    signOut() {
        this.afAuth.signOut();
    }

    isAuthenticated() {
        return this.afAuth.user;
    }
}