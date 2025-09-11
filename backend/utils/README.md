TODO

Add something about generating crypto key using below-

```
    from cryptography.fernet import Fernet

    # Generate a new Fernet key
    key = Fernet.generate_key()

    print(key.decode())  # This will be your base64-encoded 32-byte key
```
