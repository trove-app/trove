"""Cryptographic utilities for secure data handling."""

import base64
import os
from cryptography.fernet import Fernet
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC

class CryptoManager:
    def __init__(self, key: str = None):
        """Initialize the crypto manager with a key or generate one."""
        if key is None:
            key = os.getenv('TROVE_ENCRYPTION_KEY')
        if key is None:
            # Generate a new key if none provided
            key = self._generate_key()
        self.fernet = Fernet(key.encode() if isinstance(key, str) else key)
    
    @staticmethod
    def _generate_key() -> str:
        """Generate a new Fernet key."""
        return base64.urlsafe_b64encode(os.urandom(32)).decode()
    
    def encrypt(self, data: str) -> bytes:
        """Encrypt a string."""
        return self.fernet.encrypt(data.encode())
    
    def decrypt(self, data: bytes) -> str:
        """Decrypt bytes to a string."""
        return self.fernet.decrypt(data).decode()

# Global instance
crypto_manager = CryptoManager()
