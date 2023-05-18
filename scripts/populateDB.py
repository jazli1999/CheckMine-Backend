import pandas as pd
import psycopg2
from tqdm import tqdm
import sys
import os
from sqlalchemy import create_engine, inspect
from datetime import datetime
from dotenv import load_dotenv

load_dotenv()

def getDuration(row):
    start = datetime.fromisoformat(row["outbounddeparturedatetime"])
    end = datetime.fromisoformat(row["inboundarrivaldatetime"])
    return (end - start).days


conn = psycopg2.connect(
    host=os.getenv("DB_HOST"), database=os.getenv("DB_DATABASE"), user=os.getenv("DB_USERNAME"), password=os.getenv("DB_PASSWORD")
)
conn.autocommit = True
cur = conn.cursor()

engine = create_engine(f"postgresql://{os.getenv('DB_USERNAME')}:{os.getenv('DB_PASSWORD')}@{os.getenv('DB_HOST')}:{os.getenv('DB_PORT')}/{os.getenv('DB_DATABASE')}")
connSA = engine.connect()

if inspect(engine).has_table('hotel'):
    print("Hotel table already exists, import skipped")
else:
    print("Importing hotels.csv")
    cur.execute(
    """
        CREATE TABLE IF NOT EXISTS hotel (
            hotelid INTEGER PRIMARY KEY,
            hotelname VARCHAR(128),
            hotelstars FLOAT
        );
    """
    )
    df = pd.read_csv("scripts/hotels.csv", sep=";")
    df.to_sql("hotel", connSA, index=False, if_exists="replace")
    

if inspect(engine).has_table('offer'):
    print("Offer table already exists, import skipped")
else:
    print(
        "Importing offers.csv to Postgres, this could take very long (1 hour to 2), depending on your hardware"
    )

    cur.execute(
        """
        CREATE TABLE IF NOT EXISTS offer (
            id SERIAL,
            hotelid INTEGER,
            countadults INTEGER,
            countchildren INTEGER,
            price INTEGER,
            outbounddeparturedatetime TIMESTAMP,
            outbounddepartureairport VARCHAR(3),
            outboundarrivaldatetime TIMESTAMP,
            outboundarrivalairport VARCHAR(3),
            inbounddeparturedatetime TIMESTAMP,
            inbounddepartureairport VARCHAR(3),
            inboundarrivaldatetime TIMESTAMP,
            inboundarrivalairport VARCHAR(3),
            mealtype VARCHAR(64),
            oceanview BOOLEAN,
            roomtype VARCHAR(32),
            duration INTEGER
        ) PARTITION BY LIST (outbounddepartureairport);
    """)
    cur.execute(open("scripts/partition.sql").read())

    with tqdm(total=1027, file=sys.stdout) as pbar:
        for i, chunk in enumerate(
            pd.read_csv(
                "scripts/offers.csv",
                chunksize=10**5,
                low_memory=False,
            )
        ):
            chunk["duration"] = chunk.apply(lambda row: getDuration(row), axis=1)
            chunk.to_sql("offer", connSA, index=False, if_exists="append")
            pbar.set_description("Importing: %d" % (1 + i))
            pbar.update(1)
            print(pbar)

cur.close()
conn.close()