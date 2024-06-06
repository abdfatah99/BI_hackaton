from pathlib import Path
from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse
from API.models.DataSchema import ProductCreate, Product
from API.utils.DBConnection import DBConnection
from psycopg2 import sql
from typing import List

router = APIRouter()

@router.get("/product", response_model=List[Product])
async def get_all_products():
    try:
        connection = DBConnection.get_client()
        cursor = connection.cursor()
        cursor.execute("SELECT product_id, product_name, price, market_price, id_procurement FROM product")
        rows = cursor.fetchall()
        products = [Product(product_id=row[0], product_name=row[1], price=row[2], market_price=row[3], id_procurement=row[4]) for row in rows]
        return products
    finally:
        cursor.close()

@router.get("/product/{id}", response_model=Product)
async def get_product_detail(id: int):
    try:
        connection = DBConnection.get_client()
        cursor = connection.cursor()
        cursor.execute("SELECT product_id, product_name, price, market_price, id_procurement FROM product WHERE product_id = %s", (id,))
        row = cursor.fetchone()
        if row:
            return Product(product_id=row[0], product_name=row[1], price=row[2], market_price=row[3], id_procurement=row[4])
        else:
            raise HTTPException(status_code=404, detail="Product not found")
    finally:
        cursor.close()

@router.get("/favicon.ico", include_in_schema=False)
async def favicon():
    file_path = Path("API/static/favicon.ico")
    return FileResponse(file_path)

@router.get("/product/csv/{id}")
async def get_product_csv(id: int):
    directory_path = Path("API/storage/product/")
    file_name = f"procurement_{id}.csv"
    file_path = directory_path / file_name

    if not file_path.exists():
        raise HTTPException(status_code=404, detail="File not found")

    return FileResponse(file_path, filename=file_name)


@router.post("/product", response_model=Product)
async def post_product_data(product: ProductCreate):
    try:
        connection = DBConnection.get_client()
        cursor = connection.cursor()
        query = """
        INSERT INTO product (product_name, price, market_price, id_procurement)
        VALUES (%s, %s, %s, %s) RETURNING product_id
        """
        cursor.execute(query, (product.product_name, product.price, product.market_price, product.id_procurement))
        product_id = cursor.fetchone()[0]
        return Product(product_id=product_id, **product.model_dump())
    finally:
        connection.commit()
        cursor.close()


@router.put("/product/{id}", response_model=Product)
async def update_product_data(id: int, product: ProductCreate):
    try:
        connection = DBConnection.get_client()
        cursor = connection.cursor()
        
        update_data = product.model_dump(exclude_unset=True)
        set_clause = ', '.join([f"{key} = %s" for key in update_data.keys()])
        
        if set_clause:
            query = sql.SQL(f"UPDATE product SET {set_clause} WHERE product_id = %s")
            values = list(update_data.values())
            values.append(id)
            cursor.execute(query, tuple(values))
            connection.commit()

        cursor.execute("SELECT product_id, product_name, price, market_price, id_procurement FROM product WHERE product_id = %s", (id,))
        row = cursor.fetchone()
        if row:
            return Product(product_id=row[0], product_name=row[1], price=row[2], market_price=row[3], id_procurement=row[4])
        else:
            raise HTTPException(status_code=404, detail="Product not found")
    finally:
        cursor.close()

@router.delete("/product/{id}")
async def delete_product(id: int):
    try:

        connection = DBConnection.get_client()
        cursor = connection.cursor()
        cursor.execute("DELETE FROM product WHERE product_id = %s RETURNING product_id", (id,))
        deleted_id = cursor.fetchone()
        if deleted_id:
            connection.commit()
            return {"message": f"Product with id {id} deleted successfully"}
        else:
            raise HTTPException(status_code=404, detail="Product not found")
    finally:
        cursor.close()
 