from API.core.ConfigEnv import settings
import psycopg2


class DBConnection:
    __connection = None
    flag = False
    def __init__(self):
        # if client instance already created, do not create new client
        try:
            if DBConnection.__connection is not None:
                raise Exception("This class is a singleton")
            else:
                DBConnection.__connection = psycopg2.connect(
                    user = settings.DATABASE_USERNAME,
                    password = settings.DATABASE_PASSWORD,                                  
                    host = settings.DATABASE_IP,                                            
                    port = settings.DATABASE_PORT,                                          
                    database = settings.DATABASE_NAME
                )
                DBConnection.flag = True
        except (psycopg2.DatabaseError, Exception) as error:
            print("Can't connect to database, error:", error)
        
    
    # A static method is a method that is called without creating an instance of
    # the class
    @staticmethod
    def get_client():
        """
        The get_client() function is used to get the client instance

        Returns:
            DBConnection.__client: it return the client instance. 
        """
        return DBConnection.__connection