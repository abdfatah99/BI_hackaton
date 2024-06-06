from fastapi import APIRouter, HTTPException, Form
from API.utils.DBConnection import DBConnection
from psycopg2 import sql
from API.models.DataSchema import VendorCreate, VendorUpdate, Vendor
from typing import List

router = APIRouter()

@router.get("/vendor")
async def get_all_vendors():
    connection = DBConnection.get_client()
    cursor = connection.cursor()

    try:
        cursor.execute("SELECT vendor_id, company_name, nib, phone, email FROM vendor")
        rows = cursor.fetchall()
        vendors = [Vendor(vendor_id=row[0], company_name=row[1], nib=row[2], phone=row[3], email=row[4]) for row in rows]
        print(vendors)
        return vendors

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
    finally:
       cursor.close()

@router.get("/vendor/{id}", response_model=Vendor)
async def get_vendor_detail(id: int):
    connection = DBConnection.get_client()
    cursor = connection.cursor()
    cursor.execute("SELECT vendor_id, company_name, nib, phone, email FROM vendor WHERE vendor_id = %s", (id,))
    row = cursor.fetchone()
    cursor.close()
    if row:
        return Vendor(vendor_id=row[0], company_name=row[1], nib=row[2], phone=row[3], email=row[4])
    else:
        raise HTTPException(status_code=404, detail="Vendor not found")

@router.post("/vendor")
async def post_vendor_data(
    company_name: str = Form(...),
    nib: int = Form(...),
    email: str = Form(...),
    phone: str = Form(...)
):
    connection = DBConnection.get_client()
    cursor = connection.cursor()
    query = """
    INSERT INTO vendor (company_name, nib, phone, email)
    VALUES (%s, %s, %s, %s) RETURNING vendor_id
    """
    try:
        cursor.execute(query, (company_name, nib, phone, email))
        vendor_id = cursor.fetchone()[0]
        print(vendor_id)
        # print("saved vendor data: ", vendor[0], vendor[1], vendor[2], vendor[3], vendor[4])

        connection.commit()
        # return Vendor(vendor_id=vendor[''], **vendor.model_dump())
        return { "message": "Post Data vendor Successfully" }
    
    except HTTPException as e:
        print("Error for sending vendor data:", e)
        raise HTTPException(status_code=400, detail=str(e))
    
    finally:
        cursor.close()

@router.put("/vendor/{id}")
async def update_vendor_data(
    vendor_id: str = Form(...),
    company_name: str = Form(...),
    nib: int = Form(...),
    email: str = Form(...),
    phone: str = Form(...)
):
    connection = DBConnection.get_client()
    cursor = connection.cursor()
    
    # update_data = vendor.model_dump(exclude_unset=True)
    # set_clause = ', '.join([f"{key} = %s" for key in update_data.keys()])
    
    # if set_clause:
    #     query = sql.SQL(f"UPDATE vendor SET {set_clause} WHERE vendor_id = %s")
    #     values = list(update_data.values())
    #     values.append(id)
    #     cursor.execute(query, tuple(values))
    #     connection.commit()

    query_update = sql.SQL(f"UPDATE vendor SET company_name = %s, nib = %s, email = %s, phone = %s WHERE vendor_id = %s")
    cursor.execute(query_update, (company_name, nib, email, phone, vendor_id))
    connection.commit()


    query_select = sql.SQL("SELECT vendor_id, company_name, nib, phone, email FROM vendor WHERE vendor_id = %s")
    cursor.execute(query_select, (vendor_id,))
    row = cursor.fetchone()
    cursor.close()

    if row:
        return Vendor(vendor_id=row[0], company_name=row[1], nib=row[2], phone=row[3], email=row[4])
    else:
        raise HTTPException(status_code=404, detail="Vendor not found")

@router.delete("/vendor/{id}")
async def delete_vendor(id: int):
    connection = DBConnection.get_client()
    cursor = connection.cursor()
    cursor.execute("DELETE FROM vendor WHERE vendor_id = %s RETURNING vendor_id", (id,))
    deleted_id = cursor.fetchone()
    connection.commit()
    cursor.close()
    if deleted_id:
        return {"message": f"Vendor with id {id} deleted successfully"}
    else:
        raise HTTPException(status_code=404, detail="Vendor not found")