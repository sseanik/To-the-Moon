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
        #cur = conn.cursor()
        #selectQuery = "SELECT 5;"
        #cur.execute(selectQuery)
        #query_results = cur.fetchall()
        #print(query_results)
        return conn

    except Exception as e:
        print("Database connection failed due to {}".format(e))


def createPortfolioTable():
    conn = createDBConnection()
    cur = conn.cursor()
    cur.execute(open("Tables/Portfolio.sql", "r").read())
    conn.commit()
    conn.close()

def createHoldingsTable():
    conn = createDBConnection()
    cur = conn.cursor()
    cur.execute(open("Tables/Holdings.sql", "r").read())
    conn.commit()
    conn.close()

def insertGarbage():
    conn = createDBConnection()
    cur = conn.cursor()
    insertQuery = "INSERT INTO Portfolio (portfolioname, userid) VALUES (%s, %s)"
    cur.execute(insertQuery, ("Austin", 4))
    cur.execute(insertQuery, ("Bob", 2))
    conn.commit()
    conn.close()

if __name__ == "__main__":
    createDBConnection()
    createPortfolioTable()
    createHoldingsTable()

    insertGarbage()
