const userPrueba = {
    nombre: 'Test',
    email: 'test@test.com',
    password: 'password'
}

const userPrueba_json = JSON.stringify(userPrueba);

sessionStorage.getItem('userPrueba') || sessionStorage.setItem('userPrueba', userPrueba_json);