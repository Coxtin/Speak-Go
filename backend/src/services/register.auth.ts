import bcrypt from 'bcrypt'
import pool from '../config/db'

export const registerNewUser = async (userData: any) => {

    console.log("Am intrat in functie de creare de cont!");

    try {

        let query = `SELECT * FROM users WHERE email = $1`

        const verify_user_email = await pool.query(query, [userData.email]);
        
        if (verify_user_email.rows.length > 0){
            throw new Error("Acest email este folosit deja!");
        }
        else{

            const hashedPassword = bcrypt.hash(userData.password, 10);

            query = `INSERT INTO users (firstname, lastname, username, email, age, password) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, firstname, lastname, email` ;
            
            const insert_in_db = await pool.query(query, [userData.firstName, userData.lastName, userData.username, userData.email, userData.age, hashedPassword]);

            console.log(insert_in_db.rows[0])

            return insert_in_db.rows[0];


        }

    } catch(error: any){

        if (error.code === '23505' || error.code === 'ER_DUP_ENTRY') 

        console.error("Am primit eroare : ", error)
        throw new Error("Eroare neasteptata!")
    }

}