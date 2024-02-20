import { Injectable } from '@angular/core';
import * as sql from 'mssql';

const config: sql.config = {
    server: 'your_server_name',
    database: 'your_database_name',
    user: 'your_username',
    password: 'your_password',
    options: {
        encrypt: true, // Enable encryption if needed
    },
};
@Injectable({
    providedIn: 'root'
})
export class SqlService {

    async connectToDatabase() {
        try {
            await sql.connect(config);
            console.log('Connected to the database successfully!');
            // Perform database operations here
        } catch (error) {
            console.error('Error connecting to the database:', error);
        }
    }
}

