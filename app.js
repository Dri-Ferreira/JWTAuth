require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json())

// Models
const User = require('./models/User')

app.get('/', (req, res) => {
    res.status(200).json({ message: 'Bem vindo a nossa API!'})
})

// Register User
app.post('/auth/register', async(req, res) => {

    const {name, email, password, confirmpassword} = req.body

    // validations
    if(!name) {
        return res.status(422).json({msg: 'O nome é obrigatório'})
    }

    if(!email) {
        return res.status(422).json({msg: 'O email é obrigatório'})
    }

    if(!password) {
        return res.status(422).json({msg: 'A senha é obrigatória'})
    }

    if(password !== confirmpassword) {
        return res.status(422).json({ msg: 'As senhas não conferem!'})
    }

    // check if user exists

    const userExists = await User.findOne({email: email})

    if(userExists) {
        return res.status(422).json('E-mail já cadastrado, Por favor insira outro email!')
    }

    // create password

    const salt = await bcrypt.genSalt(12)
    const passwordHash = await bcrypt.hash(password, salt)

    // create user

    const user = new User({
        name,
        email,
        password: passwordHash,
    })

    try {
        
        await user.save()
        res.status(201).json({ msg: 'Usuario criado com Sucesso!'})

    } catch (error) {
        console.log(error)

        res
        .status(500)
        .json({msg: 'Erro no servidor tente novamente mais tarde'})
    }
})


// Credencials
const dbUser = process.env.DB_USER
const dbPassword = process.env.DB_PASS

mongoose.connect(`mongodb+srv://${dbUser}:${dbPassword}@cluster0.zbkfh.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`).then(() => {
    app.listen(3000)
    console.log('Conectou ao banco!')
}).catch((err) => console.log(err))

