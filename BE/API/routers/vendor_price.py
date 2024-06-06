from fastapi import APIRouter, HTTPException
from API.models.DataSchema import VendorPrice, VendorPriceCreate
from API.utils.DBConnection import DBConnection
from psycopg2 import sql
from typing import List

router = APIRouter()

@router.get("/vendorprice", response_model=List[VendorPrice])
async def get_all_vendorprices():
    connection = DBConnection.get_client()
    cursor = connection.cursor()
    cursor.execute("SELECT vendor_price_id, id_product, id_procurement, id_vendor, propose_vendor_price FROM vendor_price")
    rows = cursor.fetchall()
    cursor.close()
    vendorprices = [VendorPrice(vendor_price_id=row[0], id_product=row[1], id_procurement=row[2], id_vendor=row[3], propose_vendor_price=row[4]) for row in rows]
    return vendorprices

@router.get("/vendorprice/{id}", response_model=VendorPrice)
async def get_vendorprice_detail(id: int):
    connection = DBConnection.get_client()
    cursor = connection.cursor()
    cursor.execute("SELECT vendor_price_id, id_product, id_procurement, id_vendor, propose_vendor_price FROM vendor_price WHERE vendor_price_id = %s", (id,))
    row = cursor.fetchone()
    cursor.close()
    if row:
        return VendorPrice(vendor_price_id=row[0], id_product=row[1], id_procurement=row[2], id_vendor=row[3], propose_vendor_price=row[4])
    else:
        raise HTTPException(status_code=404, detail="Vendor price not found")

@router.post("/vendorprice", response_model=VendorPrice)
async def post_vendorprice_data(vendorprice: VendorPriceCreate):
    connection = DBConnection.get_client()
    cursor = connection.cursor()
    query = """
    INSERT INTO vendor_price (id_product, id_procurement, id_vendor, propose_vendor_price)
    VALUES (%s, %s, %s, %s) RETURNING vendor_price_id
    """
    cursor.execute(query, (vendorprice.id_product, vendorprice.id_procurement, vendorprice.id_vendor, vendorprice.propose_vendor_price))
    vendor_price_id = cursor.fetchone()[0]
    connection.commit()
    cursor.close()
    return VendorPrice(vendor_price_id=vendor_price_id, **vendorprice.dict())

@router.put("/vendorprice/{id}", response_model=VendorPrice)
async def update_vendorprice_data(id: int, vendorprice: VendorPriceCreate):
    connection = DBConnection.get_client()
    cursor = connection.cursor()
    
    update_data = vendorprice.dict(exclude_unset=True)
    set_clause = ', '.join([f"{key} = %s" for key in update_data.keys()])
    
    if set_clause:
        query = sql.SQL(f"UPDATE vendor_price SET {set_clause} WHERE vendor_price_id = %s")
        values = list(update_data.values())
        values.append(id)
        cursor.execute(query, tuple(values))
        connection.commit()

    cursor.execute("SELECT vendor_price_id, id_product, id_procurement, id_vendor, propose_vendor_price FROM vendor_price WHERE vendor_price_id = %s", (id,))
    row = cursor.fetchone()
    cursor.close()
    if row:
        return VendorPrice(vendor_price_id=row[0], id_product=row[1], id_procurement=row[2], id_vendor=row[3], propose_vendor_price=row[4])
    else:
        raise HTTPException(status_code=404, detail="Vendor price not found")

@router.delete("/vendorprice/{id}")
async def delete_vendorprice(id: int):
    connection = DBConnection.get_client()
    cursor = connection.cursor()
    cursor.execute("DELETE FROM vendor_price WHERE vendor_price_id = %s RETURNING vendor_price_id", (id,))
    deleted_id = cursor.fetchone()
    connection.commit()
    cursor.close()
    if deleted_id:
        return {"message": f"Vendor price with id {id} deleted successfully"}
    else:
        raise HTTPException(status_code=404, detail="Vendor price not found")