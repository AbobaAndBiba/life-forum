declare namespace NodeJS {
    export interface ProcessEnv {
        PORT:number;
        MONGO_URI:string;
    }
}


declare namespace Express {
    export interface User {
        email: string;
        login: string;
    }
}