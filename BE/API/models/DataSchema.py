from pydantic import BaseModel, Field, EmailStr, PositiveInt, conint
from datetime import datetime
from typing import Optional, List


class ProcurementBase(BaseModel):
    procurement_name: str = Field(..., max_length=100)
    applicant_division: str = Field(..., max_length=100)
    proc_number: PositiveInt
    file_name: str = Field(..., max_length=100)
    amount: int
    createdAt: Optional[datetime] = None
    updateAt: Optional[datetime] = None


class ProcurementCreate(ProcurementBase):
    procurement_name: str
    applicant_division: str
    proc_num: int
    amount: float
    pass


class Procurement(ProcurementBase):
    procurement_id: int

    class Config:
        orm_mode: True

class ProcurementUpdate(BaseModel):
    procurement_name: Optional[str] = Field(None, max_length=100)
    applicant_division: Optional[str] = Field(None, max_length=100)
    proc_number: Optional[PositiveInt] = None
    file_name: Optional[str] = Field(None, max_length=100)
    amount: Optional[int] = None
    updateAt: Optional[datetime] = None


class VendorBase(BaseModel):
    company_name: str = Field(..., max_length=100)
    nib: PositiveInt
    # nib: str
    phone: Optional[str] = Field(None, max_length=15)
    email: str 


class VendorCreate(VendorBase):
    pass


class Vendor(VendorBase):
    vendor_id: int

    class Config:
        orm_mode: True

class VendorUpdate(BaseModel):
    company_name: Optional[str] = Field(..., max_length=100)
    nib: Optional[PositiveInt] = None
    phone: Optional[str] = Field(None, max_length=15)
    email: Optional[EmailStr] = None


class TenderBase(BaseModel):
    id_procurement: int
    id_vendor: Optional[int]
    price_total: Optional[int]
    index_value: Optional[float]


class TenderCreate(TenderBase):
    pass


class Tender(TenderBase):
    tender_id: int

    class Config:
        orm_mode: True


class ProductBase(BaseModel):
    product_name: Optional[str] = Field(None, max_length=100)
    price: Optional[int]
    market_price: Optional[int]
    id_procurement: int


class ProductCreate(ProductBase):
    pass


class Product(ProductBase):
    product_id: int

    class Config:
        orm_mode: True


class VendorPriceBase(BaseModel):
    id_product: int
    id_procurement: int
    id_vendor: Optional[int]
    propose_vendor_price: int


class VendorPriceCreate(VendorPriceBase):
    pass


class VendorPrice(VendorPriceBase):
    vendor_price_id: int

    class Config:
        orm_mode: True
