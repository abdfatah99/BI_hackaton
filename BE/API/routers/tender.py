import csv
from pathlib import Path
import uuid
from fastapi import APIRouter, File, Form, HTTPException, UploadFile
from API.models.DataSchema import Tender, TenderCreate, Procurement
from API.utils.DBConnection import DBConnection
from psycopg2 import sql

router = APIRouter()

# handler for all tender page (List of tender)
# list all procurement with is_tender = true
@router.get('/tender')
async def get_all_tenders():
    connection = DBConnection.get_client()
    cursor = connection.cursor()

    try:
        query_get_all_tender = sql.SQL("SELECT procurement_id, procurement_name, applicant_division, proc_number, amount, file_name FROM procurement WHERE is_tender = TRUE")
        cursor.execute(query_get_all_tender)
        records = cursor.fetchall()
        
        procurement_list = []
        for row in records:
            procurement_data = Procurement(
                procurement_id= row[0],
                procurement_name= row[1],
                applicant_division= row[2],
                proc_number= row[3],
                amount= row[4],
                file_name=row[5]
            )
            procurement_list.append(procurement_data)
        
        return procurement_list
    except Exception as error:
        print("ROUTER: tender.py - get_all_tenders() error:", error)
        raise HTTPException(status_code=500, detail=str(error))
    finally:
        cursor.close()
        # connection.close()

# handler for tender detail - user can add vendor
# {id}: procurement id - Because we want to select all tender with this procurement id
# get all data from tender with desired procurement id
#
@router.get("/tender/{id}")
async def get_tender_detail(id: int):
    connection = DBConnection.get_client()
    cursor = connection.cursor()

    try:
        query_to_list_all_tender_with_defined_procurement_left = """
        SELECT
            p.procurement_id,
            p.procurement_name,
            p.proc_number,
            p.applicant_division,
            v.vendor_id,
            v.company_name,
            t.index_value
        FROM
            procurement p
        LEFT JOIN tender t ON p.procurement_id = t.id_procurement
        LEFT JOIN vendor v ON t.id_vendor = v.vendor_id
        WHERE
           p.procurement_id = %s
        ORDER BY
            t.index_value DESC;
        """

        cursor.execute(query_to_list_all_tender_with_defined_procurement_left, (id,))
        rows = cursor.fetchall()

        tender_list = []
        for row in rows:
            tender_data = {
                "procurement_id": row[0],
                "procurement_name": row[1],
                "proc_number": row[2],
                "applicant_division": row[3],
                "vendor_id": row[4],
                "company_name": row[5],
                "index_value": row[6],
            }
            tender_list.append(tender_data)

        return tender_list

    except Exception as error:
        print("ROUTER: tender.py - get_tender_detail() error:", error)
        raise HTTPException(status_code=500, detail=str(error))
    finally:
        cursor.close()

# get list of all product from the vendor
# {procurement id} - Because we want to select all tender with this procurement id
# {vendor} - get all product that vendor offer
# get all data from tender with desired procurement id
#
@router.get("/tender/{procurement_id}/{vendor_id}")
async def get_list_of_all_product_tender_from_vendor(procurement_id: int, vendor_id: int):
    connection = DBConnection.get_client()
    cursor = connection.cursor()

    try:
        # 12 column
        query_all_product_detail_from_defined_tender = """
        SELECT 
            proc.procurement_id,
            proc.procurement_name,
            proc.proc_number,
            proc.applicant_division,
            prod.product_name, 
            prod.price, 
            prod.market_price, 
            v.company_name, 
            v.vendor_id,
            v.nib,
            v.email,
            vp.propose_vendor_price,
            CASE 
                WHEN vp.propose_vendor_price < prod.market_price * 1.10 THEN 'acc'
                ELSE 'over'
            END AS approval_status
        FROM vendor_price vp 
        INNER JOIN procurement proc 
        ON vp.id_procurement = proc.procurement_id 
        INNER JOIN vendor v 
        ON vp.id_vendor = v.vendor_id
        INNER JOIN product prod
        ON vp.id_product = prod.product_id
        WHERE procurement_id = %s AND vendor_id = %s;
        """

        cursor.execute(query_all_product_detail_from_defined_tender, (procurement_id, vendor_id,))
        rows = cursor.fetchall()

        tender_list = []
        for row in rows:
            tender_data = {
                "procurement_id": row[0],
                "procurement_name": row[1],
                "proc_number": row[2],
                "applicant_division": row[3],
                "product_name": row[4],
                "price": row[5],
                "market_price": row[6],
                "company_name": row[7],
                "vendor_id": row[8],
                "nib": row[9],
                "email": row[10],
                "propose_vendor_price": row[11],
                "approval_status": row[12]
            }
            tender_list.append(tender_data)

        return tender_list

    except Exception as error:
        print("ROUTER: tender.py - get_list_of_all_product_tender_from vendor() error:", error)
        raise HTTPException(status_code=500, detail=str(error))
    finally:
        cursor.close()

# create new tender
# continue from procurement.py > update_procurement_status [A1]
# 1. check if there is a tender without vendor, you have to assign the first vendor
#    to its tender.
#
@router.post("/tender", response_model=Tender)
async def post_tender_data(tender: TenderCreate):
    connection = DBConnection.get_client()
    cursor = connection.cursor()
 
    try:
        # [A2] 
        # check if there is a tender without vendor
        check_tender_empty_vendor = """
        SELECT tender_id, id_procurement, id_vendor, price_total, index_value FROM tender WHERE id_vendor = null;
        """
        cursor.execute(check_tender_empty_vendor)
        tender_id = cursor.fetchone()[0]
        
        if (tender_id):
            update_tender_with_current_vendor = """
            UPDATE tender SET id_vendor = %s WHERE id_procurement = %s and id_vendor = null
            """
            cursor.execute(update_tender_with_current_vendor)
            tender_id = cursor.fetchone()[0]
            cursor.close()
            return {"status": "update tender without vendor"}

        query = """
        INSERT INTO tender (id_procurement, id_vendor, price_total, index_value)
        VALUES (%s, %s, %s, %s) RETURNING tender_id
        """
        cursor.execute(query, (tender.id_procurement, tender.id_vendor, tender.price_total, tender.index_value))
        tender_id = cursor.fetchone()[0]

        connection.commit()
        return Tender(tender_id=tender_id, **tender.model_dump()) 
    except Exception as error:
        print("Error post tender data: ", error)
        connection.rollback()
    finally:
        cursor.close()
 
# when user add new vendor to involve/participate with the procurement tender
# 
@router.post("/tender/{id_procurement}")
async def update_tender_data(
    id_procurement: str,
    id_vendor: str = Form(...),
    file: UploadFile = File(...)

):
    connection = DBConnection.get_client()
    cursor = connection.cursor()

    try:
        price_total = 0 # set it to 0 first, then we'll update it later by looping through the proposed price
        index_value = 0 # set to 0 first, then later after ML calculatation, we'll update it
        query_insert_into_tender = sql.SQL("""
        INSERT INTO tender (id_procurement, id_vendor, price_total, index_value, file_name)
        VALUES (%s, %s, %s, %s, %s);
        """)
        # after save the data, now let's save the file
        # Save the file to the directory

        vendor_file_name = f"{uuid.uuid4().hex}_{file.filename}"
        directory_path = Path("API/storage/vendor/")
        file_path = directory_path / vendor_file_name

        cursor.execute(query_insert_into_tender, (id_procurement, id_vendor, price_total, index_value, vendor_file_name))

        with open(file_path, "wb") as f:
            f.write(await file.read())
        
        # parse the csv file, and insert the value into `product` table
        with open(file_path, 'r', encoding='utf-8') as csv_file:
            csv_reader = csv.DictReader(csv_file)
            for row in csv_reader:
                product_id = row['product_id']
                # product_name = row['product_name']
                vendor_price = int(row['proposed_price'].replace(".", "").replace(",", ""))
                
                # update the total amount
                price_total += vendor_price

                query_insert_vendor_product_price = sql.SQL("""
                INSERT INTO vendor_price (id_product, id_procurement, id_vendor, propose_vendor_price)
                    VALUES (%s, %s, %s, %s);
                """)
                cursor.execute(query_insert_vendor_product_price, (product_id, id_procurement, id_vendor, vendor_price))

        # update the vendor amount
        query_update_amount = sql.SQL("""
            UPDATE tender SET price_total = %s WHERE id_vendor = %s AND id_procurement = %s
        """)
        cursor.execute(query_update_amount, (price_total, id_vendor, id_procurement))
        

        connection.commit()

        return { "message": "Adding new vendor for the procurement success"}

    except Exception as error:
        connection.rollback()
        print("TENDER - update_tender_data Error:", error)
        return { "message" : "error to update tender data",
                 "error": error}
    finally:
        cursor.close()



@router.delete("/tender/{id}")
async def delete_tender(id: int):
    try:
        connection = DBConnection.get_client()
        cursor = connection.cursor()
        cursor.execute("DELETE FROM tender WHERE tender_id = %s RETURNING tender_id", (id,))
        deleted_id = cursor.fetchone()
        if deleted_id:
            return {"message": f"Tender with id {id} deleted successfully"}
        else:
            raise HTTPException(status_code=404, detail="Tender not found")
    finally:
        connection.commit()
        cursor.close()
