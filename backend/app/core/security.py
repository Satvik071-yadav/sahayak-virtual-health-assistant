"""
Security helpers: password hashing (bcrypt) and JWT creation / verification.

Note: this used to go through passlib's CryptContext, but passlib (last
released in 2020) is unmaintained and breaks on modern bcrypt releases
(it inspects bcrypt.__about__, which newer bcrypt versions removed). We
call the bcrypt library directly instead, which is simpler and avoids
that incompatibility.
"""
from datetime import datetime, timedelta
from typing import Optional

import bcrypt
from jose import jwt, JWTError

from app.core.config import settings

# bcrypt only uses the first 72 bytes of the input; anything beyond that
# is silently ignored by design, so we truncate ourselves for clarity and
# to avoid bcrypt>=4.1 raising on inputs longer than 72 bytes.
_BCRYPT_MAX_BYTES = 72


def _prepare_password(password: str) -> bytes:
    return password.encode("utf-8")[:_BCRYPT_MAX_BYTES]


def hash_password(password: str) -> str:
    hashed = bcrypt.hashpw(_prepare_password(password), bcrypt.gensalt())
    return hashed.decode("utf-8")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    try:
        return bcrypt.checkpw(
            _prepare_password(plain_password), hashed_password.encode("utf-8")
        )
    except ValueError:
        # Malformed/unknown hash format (e.g. a stale non-bcrypt hash).
        return False


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + (
        expires_delta or timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)


def decode_access_token(token: str) -> Optional[dict]:
    try:
        return jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
    except JWTError:
        return None
