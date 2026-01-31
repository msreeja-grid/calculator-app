from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import math

app = FastAPI(title="Calculator API", version="1.0.0")

# ✅ CORS — allows Live Server frontend to call API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------- Models ----------
class TwoNumbers(BaseModel):
    a: float
    b: float

class OneNumber(BaseModel):
    a: float

# ---------- Routes ----------
@app.get("/")
def root():
    return {"message": "Welcome to the Calculator API"}

@app.post("/add")
def add(numbers: TwoNumbers):
    return {"result": numbers.a + numbers.b}

@app.post("/subtract")
def subtract(numbers: TwoNumbers):
    return {"result": numbers.a - numbers.b}

@app.post("/multiply")
def multiply(numbers: TwoNumbers):
    return {"result": numbers.a * numbers.b}

@app.post("/divide")
def divide(numbers: TwoNumbers):
    if numbers.b == 0:
        raise HTTPException(status_code=400, detail="Division by zero not allowed")
    return {"result": numbers.a / numbers.b}

@app.post("/modulo")
def modulo(numbers: TwoNumbers):
    if numbers.b == 0:
        raise HTTPException(status_code=400, detail="Modulo by zero not allowed")
    return {"result": numbers.a % numbers.b}

@app.post("/power")
def power(numbers: TwoNumbers):
    return {"result": numbers.a ** numbers.b}

@app.post("/sqrt")
def square_root(number: OneNumber):
    if number.a < 0:
        raise HTTPException(status_code=400, detail="Square root of negative number")
    return {"result": math.sqrt(number.a)}
