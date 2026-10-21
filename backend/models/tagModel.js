const pool = require("../config/db");

const getAllTags = async()=>{
    const result=await pool.query(`SELECT * FROM tags ORDER BY ID`);
    return result.rows;
}

const getTagByID = async(id)=>{
    const result=await pool.query(`SELECT * FROM tags WHERE ID=$1`,[id]);
    return result.rows[0];
}

const createTag = async(name)=>{
    const result=await pool.query(`INSERT INTO tags(name) VALUES ($1) RETURNING *`,[name]);
    return result.rows[0];
}

const updateTag = async(id,name)=>{
    const result=await pool.query(`UPDATE tags SET name=COALESCE($1,name) WHERE ID=$2 RETURNING *`,[name,id]);
    return result.rows[0];
}

const deleteTag = async(id)=>{
    const result=await pool.query(`DELETE FROM tags WHERE ID=$1 RETURNING *`,[id]);
    return result.rows[0];
}

module.exports={
    getAllTags,
    getTagByID,
    createTag,
    updateTag,
    deleteTag
}