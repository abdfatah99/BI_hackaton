# initialize db connection here
from API.utils.DBConnection import DBConnection
import psycopg2
from fastapi import FastAPI, APIRouter, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from .routers import procurement, product, vendor, tender, vendor_price

app = FastAPI(title="Intelligence Procurement")

origins = [
    "http://localhost:8001",
    "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(procurement.router)
app.include_router(product.router)
app.include_router(vendor.router)
app.include_router(tender.router)
app.include_router(vendor_price.router)

try:
    db_connection = DBConnection()
    if(db_connection):
        print("database connected")
except (psycopg2.DatabaseError, Exception) as error:
    print(error)



@app.get("/")
def hello_world():
   return {
       "description": "eProcurement",
       "list-of-path": ["/procurement", "/vendor", "/tender"]
   }


# @router.get("/test")
# def test():
#     return "test router"
