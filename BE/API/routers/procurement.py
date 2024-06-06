from datetime import datetime
from fastapi import APIRouter, HTTPException, File, UploadFile, Form, Depends
from API.utils.DBConnection import DBConnection
from psycopg2 import sql, DatabaseError
from API.models.DataSchema import ProcurementCreate, ProcurementUpdate, Product
from pathlib import Path
import os
import csv
from io import TextIOWrapper
import uuid

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.chrome.service import Service as ChromeService
from webdriver_manager.chrome import ChromeDriverManager
import time
import csv

router = APIRouter()

def check_db_connection():
    if not DBConnection.flag:
        raise HTTPException(status_code=503, detail="service can't connect to database")

def init_driver():
    options = webdriver.ChromeOptions()
    # options.add_argument('--headless')
    # options.add_argument('--no-sandbox')
    # options.add_argument('--disable-dev-shm-usage')
    # driver = webdriver.Chrome(service=ChromeService(ChromeDriverManager().install()), options=options)
    driver = webdriver.Chrome()
    return driver

def currency_to_int(currency_str):
    return int(currency_str.replace('Rp', '').replace('.', '').replace(',', ''))

def get_average_price(driver, item: str):
    driver.get('https://www.tokopedia.com')
    time.sleep(3)  # Wait for the page to load

    search_element = driver.find_element(by=By.CLASS_NAME, value="css-3017qm")
    search_element.send_keys(item)
    search_element.send_keys(Keys.ENTER)

    time.sleep(10)  # Wait for the search results to load

    list_of_product_name = driver.find_elements(by=By.CLASS_NAME, value='prd_link-product-name')
    list_of_product_price = driver.find_elements(by=By.CLASS_NAME, value="prd_link-product-price")
    list_of_product_link = driver.find_elements(by=By.CLASS_NAME, value="pcv3__info-content")

    product_prices = []
    # for i in range(min(len(list_of_product_name), len(list_of_product_price), len(list_of_product_link))):
    #     try:
    #         product_prices.append([
    #             list_of_product_name[i].text,
    #             list_of_product_price[i].text,
    #             list_of_product_link[i].get_attribute('href')
    #         ])
    #     except Exception as e:
    #         print(f"Error processing product {i}: {e}")
    
    # sorted_data = sorted(product_prices, key=lambda x: currency_to_int(x[1]))
    # return_data = []
    # for i in range(min(5, len(sorted_data))):  # Ensure we do not exceed the number of available products
    #     return_data.append(sorted_data[i])
    
    # return return_data
    for i in range(min(len(list_of_product_name), len(list_of_product_price))):
        try:
            price = currency_to_int(list_of_product_price[i].text)
            product_prices.append(price)
        except Exception as e:
            print(f"Error processing product {i}: {e}")
    
    if product_prices:
        average_price = sum(product_prices) / len(product_prices)
    else:
        average_price = 0
    
    return average_price


@router.get("/procurement", dependencies=[Depends(check_db_connection)])
async def get_all_procurement():
    conn = DBConnection.get_client()
    cursor = conn.cursor()

    try:
        query = sql.SQL("SELECT procurement_id, procurement_name, applicant_division, proc_number, file_name, amount, createdAt, updateAt FROM procurement WHERE is_tender = false")
        cursor.execute(query)
        records = cursor.fetchall()
        
        procurement_list = []
        for row in records:
            procurement_data = {
                "procurement_id": row[0],
                "procurement_name": row[1],
                "applicant_division": row[2],
                "proc_number": row[3],
                "file_name": row[4],
                "amount": row[5],
                "createdAt": row[6],
                "updateAt": row[7]
            }
            procurement_list.append(procurement_data)
        
        return procurement_list

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    finally:
        cursor.close()
        conn.commit()

@router.get("/procurement/{id}", dependencies=[Depends(check_db_connection)])
async def get_procurement_detail(id: int):
    conn = DBConnection.get_client()
    cursor = conn.cursor()

    try:
        query = sql.SQL("SELECT procurement_id, procurement_name, applicant_division, proc_number, file_name, amount, createdAt, updateAt FROM procurement WHERE procurement_id = %s")
        cursor.execute(query, (id,))
        record = cursor.fetchone()
        
        if not record:
            raise HTTPException(status_code=404, detail="Procurement not found")

        procurement_data = {
            "procurement_id": record[0],
            "procurement_name": record[1],
            "applicant_division": record[2],
            "proc_number": record[3],
            "file_name": record[4],
            "amount": record[5],
            "createdAt": record[6],
            "updateAt": record[7]
        }
        
        return procurement_data

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    finally:
        cursor.close()
        conn.commit()

@router.get("/procurement/{id}/product", dependencies=[Depends(check_db_connection)])
async def get_procurement_product(id: str):
    conn = DBConnection.get_client()
    cursor = conn.cursor()

    try:
        query = sql.SQL("SELECT product_id, product_name, price, market_price, id_procurement FROM product WHERE id_procurement = %s")
        cursor.execute(query, (id,))
        record = cursor.fetchall()

        if not record:
            raise HTTPException(status_code=404, detail="Procurement Product Not Found")

        # print( "'func_name': 'get_procurement_product' :: get list of product")
        # for row in record:
        #     print("row of product:", row)
        
        products = [Product(product_id=row[0], product_name=row[1], price=row[2], market_price=row[3], id_procurement=row[4]) for row in record]
        print(products)
        cursor.close()
        return products
    
    except Exception as error:
        cursor.close()
        print({
            "func_name": "get_procurement_product", 
            "exception_for": "try to execute the sql data",
            "error": error
        })
        return {"error": "Product not found"}

@router.post("/procurement", dependencies=[Depends(check_db_connection)])
async def post_procurement_data(
    procurement_name: str = Form(...),
    applicant_division: str = Form(...),
    proc_number: int = Form(...),
    # amount: float = Form(...),
    file: UploadFile = File(...),
):
    conn = DBConnection.get_client()
    cursor = conn.cursor()

    UUIDData = uuid.uuid4().hex

    try:
        # total amount will count by the system, therefor when user input the data
        # we set to 0
        amount = 0
        query = sql.SQL("""
            INSERT INTO procurement (procurement_name, applicant_division, proc_number, file_name, amount) 
            VALUES (%s, %s, %s, %s, %s) RETURNING procurement_id;
        """)

        new_file_name = f"{UUIDData}_{file.filename}"

        cursor.execute(query, (procurement_name, applicant_division, proc_number, new_file_name, amount))
        procurement_id = cursor.fetchone()[0]
 
        # after save the data, now let's save the file
        # Save the file to the directory
        directory_path = Path("API/storage/procurement/")
        file_path = directory_path / new_file_name

        print(file_path)

        with open(file_path, "wb") as f:
            f.write(await file.read())
        
        driver = init_driver()
        # parse the csv file, and insert the value into `product` table
        with open(file_path, 'r', encoding='utf-8') as csv_file:
            csv_reader = csv.DictReader(csv_file)
            for row in csv_reader:
                product_name = row['Item Name']
                price = int(row['Desired Price'].replace(".", "").replace(",", ""))
                
                # currently, 'market_price' is not available in the csv, set it to 0 for now
                # market_price = 0

                # Scrape market price
                # scraped_data = get_data(driver, product_name)
                # market_price = currency_to_int(scraped_data[0][1]) if scraped_data else 0
                market_price = get_average_price(driver, product_name)

                # update the total amount
                amount += price

                query_product = sql.SQL("""
                    INSERT INTO product (product_name, price, market_price, id_procurement)
                    VALUES (%s, %s, %s, %s) RETURNING product_id
                """)
                cursor.execute(query_product, (product_name, price, market_price, procurement_id))

        # update the procurement amount
        query_update_amount = sql.SQL("""UPDATE procurement SET amount = %s WHERE procurement_id = %s RETURNING procurement_id""")
        cursor.execute(query_update_amount, (amount, procurement_id))

        # get all produtct that already inputted from database and return a csv file
        # with structure from the database with additional
        # then place the csv file in the product directory with name uuid that already
        # submit + procurement product
        query_select_all_saved_procurement_product = sql.SQL("""
        SELECT product_id, product_name FROM product WHERE id_procurement = %s
        """)
        cursor.execute(query_select_all_saved_procurement_product, (procurement_id,))
        products = cursor.fetchall()

        # prepare for the file
        file_name = f"procurement_{procurement_id}.csv"
        directory_path_product = Path("API/storage/product/")
        product_file_path = directory_path_product / file_name 

        # Write product data to CSV file
        with open(product_file_path, mode='w', newline='', encoding='utf-8') as csv_file:
            writer = csv.writer(csv_file)

            # Write header
            writer.writerow(['product_id', 'product_name'])

            # Write product data
            for product in products:
                writer.writerow(product)


        conn.commit()
       
        return {"message": "Post procurement data successfully", "procurement_id": procurement_id}

    except Exception as e:
        print("post procurement data:", e)
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))

    finally:
        cursor.close()

@router.put("/procurement/{id}", dependencies=[Depends(check_db_connection)])
async def update_procurement_data(id: int, procurement: ProcurementUpdate):
    conn = DBConnection.get_client()
    cursor = conn.cursor()

    try:
        update_data = procurement.model_dump(exclude_unset=True)
        if not update_data:
            raise HTTPException(status_code=400, detail="No fields to update")

        set_clause = ', '.join([f"{key} = %s" for key in update_data.keys()])
    
        # Add updateAt to the set_clause
        set_clause += ", updateAt = %s"
        update_data['updateAt'] = datetime.now().isoformat()
    
        values = list(update_data.values())
        values.append(id)  # Append the ID at the end for the WHERE clause

        print(values)

        query = sql.SQL(f"UPDATE procurement SET {set_clause} WHERE procurement_id = %s")
        cursor.execute(query, tuple(values))
        
        if cursor.rowcount == 0:
            raise HTTPException(status_code=404, detail="Procurement not found")
        
        conn.commit()
        
        return {"message": "Procurement data updated successfully"}

    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))

    finally:
        cursor.close()


# change procurement tender status
@router.put("/procurement/{procurement_id}/tender", dependencies=[Depends(check_db_connection)])
async def update_procurement_status(
    procurement_id: str
):
    conn = DBConnection.get_client()
    cursor = conn.cursor()

    try:
        query = sql.SQL(f"UPDATE procurement SET is_tender = true  WHERE procurement_id = %s")
        cursor.execute(query, (procurement_id,))

        # this is the first initiator, i.e if admin want to start a tender for the
        # procurement, we'll create tender data for the procurement with 
        # vendor id is null. 
        # later you have to check it while adding vendor that want to apply for the
        # tender, if procurement is tender-less, you have to update the tender and 
        # add the vendor to the tender. (location: tender.py > post_tender_data)

        try:
            create_new_tender = sql.SQL("""
            INSERT INTO tender (id_procurement, id_vendor, price_total, index_value)
            VALUES (%s, null, null, null)
            """)
            cursor.execute(create_new_tender, (procurement_id,))
        except Exception as error:
            print("ROUTER - UPDATE TENDER STATUS - CREATE FIRST TENDER error", error)
            conn.rollback()
            raise HTTPException(status_code=500, detail="unable to create first tender")
        
        if cursor.rowcount == 0:
            raise HTTPException(status_code=404, detail="Procurement not found")
        
        conn.commit()
        
        return {"message": "Procurement data updated successfully"}

    except Exception as e:
        print("ROUTER - UPDATE TENDER STATUS - Error: ", e)
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))

    finally:
        cursor.close()

@router.delete("/procurement/{id}", dependencies=[Depends(check_db_connection)])
async def delete_procurement(id: int):
    conn = DBConnection.get_client()
    cursor = conn.cursor()

    try:
        query_get_procurment_file = sql.SQL("SELECT file_name FROM procurement WHERE procurement_id = %s")
        cursor.execute(query_get_procurment_file, (id,))
        record_file_name = cursor.fetchone()

        if record_file_name:
            file_name = record_file_name[0]
            print("file name", file_name)
            file_path = Path(f"API/storage/procurement/{file_name}")
            print(file_path)

        # attention: 
        # delete the product first, because if you delete the procurement first
        # this will cause an error of id_procurement is still referenced by procurement_id
        # from table product.

        delete_vendor_price = sql.SQL("DELETE FROM vendor_price WHERE id_procurement = %s")
        cursor.execute(delete_vendor_price, (id,))

        delete_procurement_product = sql.SQL("DELETE FROM product WHERE id_procurement = %s")
        cursor.execute(delete_procurement_product, (id,))

        delete_tender = sql.SQL("DELETE FROM tender WHERE id_procurement = %s")
        cursor.execute(delete_tender, (id,))

        query_delete_procurement = sql.SQL("DELETE FROM procurement WHERE procurement_id = %s")
        cursor.execute(query_delete_procurement, (id,))

        
        if cursor.rowcount == 0:
            raise HTTPException(status_code=404, detail="Procurement not found")
        
        if os.path.exists(file_path):
            os.remove(file_path)
            print("File deleted")


        conn.commit()
        return {"message": "Procurement deleted successfully"}

    except Exception as e:
        print(e)
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))

    finally:
        cursor.close()



