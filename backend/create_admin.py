"""Create or reset an admin account interactively. Password is never stored in code or env.
Usage (from backend/):  python create_admin.py --email you@example.com --name "Your Name" """
import argparse, getpass, sys
from app.core.security import hash_password
from app.database.mongo import db, init_indexes
from app.models.base import now

p = argparse.ArgumentParser(); p.add_argument("--email", required=True); p.add_argument("--name", required=True)
a = p.parse_args()
pw = getpass.getpass("Password (min 12 chars): ")
if len(pw) < 12 or pw != getpass.getpass("Confirm password: "):
    sys.exit("Passwords must match and be at least 12 characters.")
init_indexes()
db.admins.update_one({"email": a.email.lower()}, {"$set": {"name": a.name, "password_hash": hash_password(pw), "active": True, "updated_at": now()},
                     "$setOnInsert": {"created_at": now()}}, upsert=True)
print("Admin saved:", a.email.lower())
