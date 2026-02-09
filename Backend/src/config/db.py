import psycopg2

def get_db_connection():
    return psycopg2.connect(
        host="localhost",
        database="drone_image_system",
        user="postgres",
        password="admin",
        port=5432
    )
