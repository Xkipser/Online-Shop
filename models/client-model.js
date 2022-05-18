const db = require('../data/database');
const bcrypt = require('bcryptjs');
const mongodb = require('mongodb');

class Client {
    constructor(userData) {
        const data = { ...userData }

        this.email = data.email;
        this.password = data.password;
        this.name = data.name;
        this.street = data.street;
        this.postal = data.postalCode;
        this.city = data.city
    }

    static findById(userId) {
        const uid = new mongodb.ObjectId(userId);

        return db.getDb().collection('users').findOne({ _id: uid }, { projection: { password: 0 } });
    }

    async findUser() {
        const existingUser = await db
            .getDb()
            .collection('users')
            .findOne({ email: this.email });

        return existingUser;
    }

    async insertUser() {
        const hashedPassword = await bcrypt.hash(this.password, 12);

        const newUser = {
            email: this.email,
            password: hashedPassword,
            name: this.name,
            street: this.street,
            postal: this.postal,
            city: this.city
        }

        await db.getDb().collection('users').insertOne(newUser);
    }

    async comparePass(comparePassoword) {
        const passwordAreEqual = await bcrypt.compare(this.password, comparePassoword);

        return passwordAreEqual;
    }
}

module.exports = Client;