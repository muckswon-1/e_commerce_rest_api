const  {v4: uuid4} = require('uuid');

// generate a uuid
const generateId = () => {
    const newId = uuid4();

    return newId;
}


module.exports = {
    generateId
}