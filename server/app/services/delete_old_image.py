import os
from app.database import query_db

def delete_old_image(column, table, identifier):
    row = query_db(
        f"SELECT {column} FROM {table} WHERE senior_id = %s",
        (identifier,),
        True
    )
    path = row.get(column)

    if path and os.path.exists(path):
        os.remove(path)