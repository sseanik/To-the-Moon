import psycopg2
from dotenv import load_dotenv
import os

load_dotenv()

ENDPOINT = os.getenv("DBENDPOINT")
PORT = os.getenv("DBPORT")
REGION = os.getenv("DBREGION")
DBNAME = os.getenv("DBNAME")
USER = os.getenv("DBUSER")
PASS = os.getenv("DBPASS")

def createDBConnection():
    try:
        conn = psycopg2.connect(host=ENDPOINT, port=PORT, database=DBNAME, user=USER, password=PASS)
        return conn
    except Exception as e:
        print("Database connection failed due to {}".format(e))

def createPortfolioTable():
    conn = createDBConnection()
    cur = conn.cursor()
    cur.execute(open("tables/Portfolio.sql", "r").read())
    conn.commit()
    conn.close()

def createUserTable():
    conn = createDBConnection()
    cur = conn.cursor()
    cur.execute(open("tables/User.sql", "r").read())
    conn.commit()
    conn.close()

# def insertGarbage():
#     conn = createDBConnection()
#     cur = conn.cursor()
#     insertQuery = "INSERT INTO Portfolio (portfolioname, userid) VALUES (%s, %s)"
#     cur.execute(insertQuery, ("Austin", 4))
#     conn.commit()
#     conn.close()
def insertExample():
    conn = createDBConnection()
    cur = conn.cursor()
    insertQuery = "INSERT INTO Portfolio (portfolioname, userid) VALUES (%s, %s)"
    cur.execute(insertQuery, ("Austin", 4))
    conn.commit()
    conn.close()

def selectExample():
    conn = createDBConnection()
    cur = conn.cursor()
    cur.execute("""SELECT now()""")
    query_results = cur.fetchall()
    print(query_results)
    conn.close()

if __name__ == "_main_":
    selectExample()