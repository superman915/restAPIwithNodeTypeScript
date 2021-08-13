import express, { Express, Request, Response } from "express"
export default function(app: Express){
    app.get('/healthcheck', (req: Request, res: Response) => res.sendStatus(200));
    
    //Register
    app.post('/api/user');

    //Login
    app.post('/api/sessions');

    //User's Sessions
    app.get('/api/sessions');

    //LogOut
    app.delete('/api/sessions');
}