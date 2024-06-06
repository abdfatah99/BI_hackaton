# Middleware to handle CORS (cross origin  resource sharing) error in the browser

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

# Todo

## NIB Error Handler

> create handler for handling vendor `nib` value, because the database using `int`
for the data type, therefor the number for nib that bigger than `int` value in 
database will resultin an error

file: `API > routers > vendor.py`
router: `/vendor`
function name: `post_vendor_data`

