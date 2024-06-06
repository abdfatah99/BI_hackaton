FROM python:3.10-alpine

RUN pip install fastapi uvicorn psycopg2-binary pydantic pydantic_settings

WORKDIR /app/be

COPY . .

EXPOSE 8000

# CMD [ "python", "main.py" ]
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]