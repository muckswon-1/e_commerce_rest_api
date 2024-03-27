const { db } = require("./db");

//update by id 
const updateById = async (tableName,data,idColumnName,id) => {
   
    const columns = Object.keys(data);
    const setClause = columns.map((column, index) => `${column}=COALESCE($${index + 1},${column})`).join(', ');
    console.log(setClause);
    const whereClause = `${idColumnName}=$${columns.length+1}`;
    
    const sqlQuery = `UPDATE ${tableName} SET ${setClause} WHERE  ${whereClause}`;
    console.log(sqlQuery);
    
   let client;
    try {
        client = await db.connect();
   } catch (error) {
       console.error('An error occured while attempting to connect to the database.',error.stack);
       return 500
   }

   try {
       const result = await  client.query(sqlQuery,[...Object.values(data),id]);
      
       if(result.rowCount > 0) {
           return 200
       } else {
           return 404
       }
   } catch (error) {
       console.error('An error occured while attempting  query the database.',error.stack);
       return 400
   }finally {
       client.release();
   }

}


//get all entries
const getAllTableItems =  async (tablename) => {
    const sqlQuery = `SELECT * FROM ${tablename}`;

    let client;
    try {
         client = await db.connect();
    } catch (error) {
        console.error('An error occured while attempting to connect to the database.',error.stack);
        return 500
    }

    try {
        const result = await  client.query(sqlQuery);
        return result
    } catch (error) {
        console.error('An error occured while attempting query the  database.',error.stack);
        return 400
    }finally {
        client.release();
    }
}


//insert into a table

const insertIntoTable = async (tableName, data) => {
    const columns = Object.keys(data)
    const values = Object.values(data);

    const placeholders = values.map((_, index) => `$${index + 1}`);

    const columnList = columns.join(', ');
    const placeholderList = placeholders.join(', ');

   
    console.log(placeholderList);
    console.log(columnList);

    const sqlQuery = `INSERT INTO ${tableName} (${columnList}) VALUES(${placeholderList})`;
    console.log(sqlQuery);

    let client;
    try {
         client = await db.connect();
    } catch (error) {
        console.error('An error occured while attempting to connect to the database.',error.stack);
        return 500
    }

    try {
        const result = await  client.query(sqlQuery,Object.values(data));
        if(result.rowCount > 0) return 200;
    } catch (error) {
        console.error('An error occured while attempting to query the database.',error.stack);
        return 400
    }finally {
        client.release();
    }

}



//delete from a table 
const deleteFromTable =  async (tablename, id) => {
    const sqlQuery = `DELETE FROM ${tablename} WHERE id=$1`;

    let client;
    try {
         client = await db.connect();
    } catch (error) {
        console.error('An error occured while attempting to connect to the database.',error.stack);
        return 500
    }

    try {
        const result = await  client.query(sqlQuery,[id]);
        if(result.rowCount > 0){
            return 204
        } else {
            return 404
        }
    } catch (error) {
        console.error('An error occured while attempting to query the database.',error.stack);
        return 400
    }finally {
        client.release();
    }
}


module.exports = {
    updateById,
    getAllTableItems,
    insertIntoTable,
    deleteFromTable
}