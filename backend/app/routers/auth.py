from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
from app.db import supabase

router = APIRouter()

security = HTTPBearer()


class LoginInput(BaseModel):
    email: str
    password: str


class SignupInput(BaseModel):
    email: str
    password: str
    role: str = "user"


@router.post("/auth/signup")
def signup(data: SignupInput):
    try:
        response = supabase.auth.sign_up({
            "email": data.email,
            "password": data.password,
            "options": {
                "data": {"role": data.role}
            }
        })
        return {"message": "Signup successful", "user": response.user}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/auth/login")
def login(data: LoginInput):
    try:
        response = supabase.auth.sign_in_with_password({
            "email": data.email,
            "password": data.password
        })
        user = response.user
        role = (user.user_metadata or {}).get("role", "user") if user else "user"
        return {
            "access_token": response.session.access_token,
            "user": {
                "id": user.id,
                "email": user.email,
                "role": role
            }
        }
    except Exception as e:
        raise HTTPException(status_code=401, detail="Invalid email or password")


def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    try:
        user_response = supabase.auth.get_user(token)
        return user_response.user
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid or expired token")


def require_role(allowed_roles: list):
    def role_checker(user=Depends(get_current_user)):
        role = (user.user_metadata or {}).get("role", "user")
        if role not in allowed_roles:
            raise HTTPException(status_code=403, detail="Access denied for this role")
        return user
    return role_checker