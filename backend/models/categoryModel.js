const pool=require("../config/db");

const getAllCategories=async()=>{
    const result=await pool.query("SELECT * FROM categories ORDER BY name");
    return result.rows;
}

const getCategoryByID=async(id)=>{
    const result=await pool.query("SELECT * FROM categories where id=$1",[id]);
    return result.rows;
}

const createCategory=async(category)=>{
    const result=await pool.query(`INSERT INTO categories(name) VALUES ($1) RETURNING *`,[category]);
    return result.rows[0];
}

const updateCategory=async(id,category)=>{
    const result=await pool.query(`UPDATE categories SET name=COALESCE($1,name) WHERE ID=$2 RETURNING *`,[category,id]);
    return result.rows[0];
}

const deleteCategory=async(id)=>{
    const result=await pool.query(`DELETE FROM categories WHERE id=$1 RETURNING *`,[id]);
    return result.rows[0];
}

module.exports={
    getAllCategories,
    getCategoryByID,
    createCategory,
    updateCategory,
    deleteCategory
}