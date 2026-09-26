import re
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from app.api.deps import get_current_user
from app.core.security import hash_password, verify_password, create_access_token
from app.db.session import get_db
from app.models.user import User
from app.schemas.auth import (
    SignupRequest,
    LoginRequest,
    TokenResponse,
    MessageResponse
)
from app.schemas.user import UserResponse

router = APIRouter(prefix="/auth", tags=["Authentication"])


def generate_public_slug(email: str, name: str | None = None) -> str:
    """Generate a clean URL slug for the public skill passport."""
    base = name if name else email.split("@")[0]
    cleaned = re.sub(r"[^a-zA-Z0-9]+", "-", base.strip().lower()).strip("-")
    return cleaned if cleaned else "user"


@router.post(
    "/signup",
    response_model=TokenResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Sign up a new user",
    description="Registers a new candidate user, hashes the password, and returns an access token."
)
def signup(data: SignupRequest, db: Session = Depends(get_db)):
    # Check if user already exists
    existing_user = db.query(User).filter(User.email == data.email.lower()).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A user with this email address already exists."
        )

    # Hash password
    hashed_pwd = hash_password(data.password)

    # Generate unique public_url slug
    slug_base = generate_public_slug(data.email, data.name)
    slug = slug_base
    counter = 1
    while db.query(User).filter(User.public_url == slug).first():
        slug = f"{slug_base}-{counter}"
        counter += 1

    # Create new user
    new_user = User(
        email=data.email.lower(),
        password_hash=hashed_pwd,
        name=data.name,
        professional_title=data.professional_title,
        location=data.location,
        public_url=slug
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    # Generate JWT token
    access_token = create_access_token(subject=new_user.id)

    return TokenResponse(
        access_token=access_token,
        token_type="bearer",
        user=UserResponse.model_validate(new_user)
    )


@router.post(
    "/login",
    response_model=TokenResponse,
    summary="Log in with email & password (JSON)",
    description="Authenticates with email and password, returning an access token and user profile."
)
def login(data: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == data.email.lower()).first()
    if not user or not verify_password(data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password.",
            headers={"WWW-Authenticate": "Bearer"}
        )

    access_token = create_access_token(subject=user.id)

    return TokenResponse(
        access_token=access_token,
        token_type="bearer",
        user=UserResponse.model_validate(user)
    )


@router.post(
    "/login/swagger",
    summary="OAuth2 compatible login for Swagger UI",
    description="Allows testing authenticated endpoints directly in Swagger UI (/docs)."
)
def login_swagger(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.email == form_data.username.lower()).first()
    if not user or not verify_password(form_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password.",
            headers={"WWW-Authenticate": "Bearer"}
        )

    access_token = create_access_token(subject=user.id)
    return {"access_token": access_token, "token_type": "bearer"}


@router.get(
    "/me",
    response_model=UserResponse,
    summary="Get current user profile",
    description="Returns the profile of the authenticated user from the Bearer token."
)
def get_me(current_user: User = Depends(get_current_user)):
    return UserResponse.model_validate(current_user)


@router.post(
    "/logout",
    response_model=MessageResponse,
    summary="Log out",
    description="Stateless logout confirmation."
)
def logout():
    return MessageResponse(message="Successfully logged out.")
